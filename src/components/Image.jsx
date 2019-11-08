import throttle from 'lodash/throttle';
import scrollParent from 'helper/scroll-parent';
import AlbumDefault from 'assets/AlbumDefault.png';
const useEffect = React.useEffect;
const useRef = React.useRef;
const useState = React.useState;

function loadImg(src, imgEl, scrollBox, cb) {
    const inView = hasElementInViewport(imgEl, scrollBox);
    if (inView) {
        let image = new Image();
        image.onload = () => {
            cb(src);
            image = null;
        };
        image.onerror = () => {
            console.log('load img error', image.src);
        };
        image.src = src;
    }
}
function cleanup(throttled, scrollBox) {
    throttled && throttled.cancel;
    scrollBox.removeEventListener('scroll', throttled, { passive: true });
}
function Img(props) {
    const imgElRef = useRef(null);
    const { size, style, lazyload, src, className } = props;
    const [imgSrc, setImgSrc] = useState(AlbumDefault);
    useEffect(() => {
        let unmounted = false;
        const imgEl = imgElRef.current;
        const { width, height } = sizeFormat(size);
        imgEl.style.width = width;
        imgEl.style.height = height;
        if (lazyload && src) {
            const scrollBox = scrollParent(imgEl);
            const throttled = throttle(
                loadImg.bind(null, src, imgEl, scrollBox, loaded => {
                    !unmounted && setImgSrc(loaded);
                    imgEl.classList.remove('lazy');
                    cleanup(throttled, scrollBox);
                }),
                200
            );
            scrollBox.addEventListener('scroll', throttled, { passive: true });
            throttled();
            return function() {
                unmounted = true;
                cleanup(throttled, scrollBox);
            };
        }
        if (!unmounted && src) setImgSrc(src);
        return function() {
            unmounted = true;
        };
    }, [imgSrc, lazyload, size, src]);

    return (
        <img
            ref={imgElRef}
            className={classNames('img', className, { lazy: lazyload })}
            style={style}
            src={imgSrc}
            draggable="false"
        />
    );
}
Img.displayName = 'Image';
export default React.memo(Img);

function hasElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    return isVisible;
}
