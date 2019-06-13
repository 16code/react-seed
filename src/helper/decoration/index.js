/// <reference path="./index.d.ts" />

const validateFunction = (func, decorator) => {
    if (typeof func !== 'function') {
        throw new Error(`@${decorator} decorator can only be applied to methods not: ${typeof func}`);
    }
};
const validateClass = (clazz, decorator) => {
    if (typeof clazz !== 'function') {
        throw new Error(`@${decorator} decorator can only be applied to class not: ${typeof clazz}`);
    }
};

export function defaultProps(props) {
    return target => {
        validateClass(target, 'defaultProps');
        target.defaultProps = props;
    };
}

export function propTypes(props) {
    return target => {
        validateClass(target, 'propTypes');
        target.propTypes = props;
    };
}

export function property(name, value) {
    return target => {
        validateClass(target, name);
        Object.defineProperty(target.prototype, name, { value });
    };
}

export function initialState(state) {
    return target => {
        validateClass(target, 'initialState');
        target.prototype.state = state;
    };
}
export function safeSetState(target) {
    target.isTestable = true;
    const setState = target.prototype.setState;
    const componentWillUnmount = target.prototype.componentWillUnmount || function() {};
    target.prototype.setState = function() {
        return setState.apply(this, [...arguments]);
    };
    target.prototype.componentWillUnmount = function() {
        const value = componentWillUnmount.apply(this, [...arguments]);
        this.setState = () => {};
        return value;
    };
}
export function displayName(name) {
    return target => {
        validateClass(target, 'displayName');
        target.displayName = name;
    };
}

export function log(target, key, descriptor) {
    const original = descriptor.value;
    validateFunction(original, 'log');
    return {
        ...descriptor,
        value: function logger(...args) {
            console.log(`Calling function "${key}" with params: `, ...args);
            return original.apply(this, [...args]);
        }
    };
}

export function debounce(wait = 300, immediate = false) {
    return (target, key, descriptor) => {
        const userFunc = descriptor.value;

        validateFunction(userFunc, 'debounce');

        let timeout;

        return {
            ...descriptor,
            value: function debouncer(...params) {
                const callNow = immediate && !timeout;
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                    timeout = null;
                    if (!immediate) {
                        userFunc.apply(this, [...params]);
                    }
                }, wait);

                if (callNow) {
                    userFunc.apply(this, [...params]);
                }
            }
        };
    };
}

export function throttle(wait = 300, options = {}) {
    return (target, key, descriptor) => {
        const userFunc = descriptor.value;

        validateFunction(userFunc, 'throttle');

        let result;
        let timeout;
        let args;
        let previous = 0;

        return {
            ...descriptor,
            value: function throttler(...params) {
                const now = Date.now();
                if (!previous && options.leading === false) {
                    previous = now;
                }
                const remaining = wait - (now - previous);
                args = [...params];
                if (remaining <= 0 || remaining > wait) {
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    previous = now;
                    result = userFunc.apply(this, args);
                    if (!timeout) {
                        args = null;
                    }
                } else if (!timeout && options.trailing !== false) {
                    timeout = setTimeout(() => {
                        previous = options.leading === false ? 0 : Date.now();
                        timeout = null;
                        result = userFunc.apply(this, args);
                        if (!timeout) {
                            args = null;
                        }
                    }, remaining);
                }
                return result;
            }
        };
    };
}
export const killEvent = getEventPreprocessor('killEvent', 'stopPropagation', 'preventDefault');
export const preventDefault = getEventPreprocessor('preventDefault', 'preventDefault');
export const stopPropagation = getEventPreprocessor('stopPropagation', 'stopPropagation');
export function autobind(...args) {
    if (args.length === 1) {
        return boundClass(...args);
    }
    return boundMethod(...args);
}

export function inject(value) {
    return (target, key, descriptor) => {
        const userFunc = descriptor.value;
        validateFunction(userFunc, `inject${value.charAt(0).toUpperCase()}${value.slice(1)}`);
        return {
            ...descriptor,
            value: function Injector(...params) {
                return userFunc.apply(this, [this[value], ...params]);
            }
        };
    };
}

export function getEventPreprocessor(decorator, ...methods) {
    if (methods.length === 0) {
        throw new Error('Invalid method list');
    }

    return (target, key, descriptor) => {
        let userHandler = target;

        if (typeof userHandler !== 'function') {
            userHandler = descriptor && descriptor.value;
        }

        validateFunction(userHandler, decorator);

        return {
            ...descriptor,
            value: function processEvent(event, ...params) {
                methods.forEach(method => {
                    if (event && method && typeof event[method] === 'function') {
                        event[method]();
                    }
                });

                userHandler.apply(this, [event, ...params]);
            }
        };
    };
}

export function boundMethod(target, key, descriptor) {
    let fn = descriptor.value;

    if (typeof fn !== 'function') {
        throw new TypeError(`@boundMethod decorator can only be applied to methods not: ${typeof fn}`);
    }

    let definingProperty = false;

    return {
        configurable: true,
        get() {
            // eslint-disable-next-line no-prototype-builtins
            if (definingProperty || this === target.prototype || this.hasOwnProperty(key) || typeof fn !== 'function') {
                return fn;
            }

            const boundFn = fn.bind(this);
            definingProperty = true;
            Object.defineProperty(this, key, {
                configurable: true,
                get() {
                    return boundFn;
                },
                set(value) {
                    fn = value;
                    delete this[key];
                }
            });
            definingProperty = false;
            return boundFn;
        },
        set(value) {
            fn = value;
        }
    };
}

export function boundClass(target) {
    let keys;
    if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
        keys = Reflect.ownKeys(target.prototype);
    } else {
        keys = Object.getOwnPropertyNames(target.prototype);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            keys = keys.concat(Object.getOwnPropertySymbols(target.prototype));
        }
    }

    keys.forEach(key => {
        if (key === 'constructor') {
            return;
        }

        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);

        if (typeof descriptor.value === 'function') {
            Object.defineProperty(target.prototype, key, boundMethod(target, key, descriptor));
        }
    });
    return target;
}
