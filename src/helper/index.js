export const isMobileDevice = window.innerWidth < 767.99;

export const delay = ms =>
    new Promise(res => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            res();
        }, ms);
    });

const $baseFontSize = 1000;
export function px2vw($px) {
    const pixel = $px;
    const floatNum = (pixel / $baseFontSize) * 100;
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
