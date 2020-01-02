import * as Vibrant from 'node-vibrant';

export function preloadImg(src, cb) {
    if (!src) return;
    return new Promise((res, rej) => {
        const img = new Image();
        if (typeof cb === 'function') {
            img.onload = event => {
                cb(event);
                res(event);
            };
        }
        img.onerror = rej;
        img.crossOrigin = 'Anonymous';
        img.src = src;
    });
}

export function parseColorFormImg(src, cb) {
    if (!src) return;
    preloadImg(src, () => {
        Vibrant.from(src)
            .getPalette()
            .then(palette => {
                const rgb = palette.LightVibrant.rgb.map(n => parseInt(n, 10)).join(',');                
                cb({
                    primary: `rgb(${rgb})`,
                    secondary: `rgba(${rgb}, .3)`,
                    palette
                });
            });
    });
}

export function createReducer(initialState, handlers) {
    return (state = initialState, action) =>
        Object.prototype.hasOwnProperty.call(handlers, action.type) ? handlers[action.type](state, action) : state;
}

export const isMobileDevice = window.innerWidth < 767.99;

export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });

const viewportWidth = 1200;
export function px2vw($px) {
    const pixel = $px;
    const floatNum = (pixel / viewportWidth) * 100;
    return `${Math.floor(floatNum * 100) / 100}vw`;
}

export function sizeFormat(size) {
    const failbackSize = { width: 'auto', height: 'auto' };
    if (size && size.includes('x')) {
        const [width, height] = size.split('x');
        if (width && height) return { width: px2vw(width), height: px2vw(height) };
    }
    return failbackSize;
}

export const formatDuration = millis => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// 格式化媒体持续时间
export function formatTime(time) {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
}

export const isMobile = /mobile/i.test(window.navigator.userAgent);
export const eventMap = {
    dragStart: isMobile ? 'touchstart' : 'mousedown',
    dragMove: isMobile ? 'touchmove' : 'mousemove',
    dragEnd: isMobile ? 'touchend' : 'mouseup',
    mouseWheel: isMobile ? 'touchmove' : 'mousewheel'
};

//
export function bindEvents(player, events) {
    Object.keys(events).forEach(eventItem => {
        player.addEventListener(eventItem, events[eventItem], false);
    });
}
export function removeEvents(player, events) {
    Object.keys(events).forEach(eventItem => {
        player.removeEventListener(eventItem, events[eventItem], false);
    });
}

export function safaJsonParse(o) {
    try {
        return JSON.parse(o);
    } catch (ex) {
        return null;
    }
}
