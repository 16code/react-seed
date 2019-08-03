export const isMobileDevice = window.innerWidth < 767.99;

export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });
