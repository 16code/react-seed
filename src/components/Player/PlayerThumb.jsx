import { delay } from 'helper';
import SingerLink from 'components/Links';
import styles from './thumb.less';

const rAF = window.requestAnimationFrame;
function setStyle(text) {
    const tag = document.getElementById('bgStyle') || createTag();
    tag.innerText = text;
    document.head.appendChild(tag);
}
function createTag() {
    const tag = document.createElement('style');
    tag.id = 'bgStyle';
    return tag;
}
let prevImg = 1;
export default ({ data, onClick, lyricModalVisible }) => {
    const { album = {}, name, artist } = data;
    const div = document.getElementsByClassName('container-wrapper')[0];
    if (album.blurUrl && div) {
        if (prevImg !== album.blurUrl) {
            prevImg = album.blurUrl;
            const pic = album.blurUrl;
            div.classList.remove('bg-loaded');
            let img = new Image();
            img.onload = () => {
                const cssText = `.container-wrapper::before {background-image:url(${img.src});}`;
                img = null;
                rAF(async () => {
                    await delay(500);
                    setStyle(cssText);
                    div.classList.add('bg-loaded');
                });
            };
            img.src = pic;
        }
    } else {
        setStyle('.container-wrapper::before {background-image: unset;}');
    }
    const iconCls = lyricModalVisible ? 'icon-suoxiao' : 'icon-bianda';
    return (
        <div className={styles['player-thumb']}>
            <figure>
                {album.picUrl && <img src={`${album.picUrl}?param=320y320&quality=60`} alt={name} />}
                <button className={styles['btn-handle']} role="button" onClick={onClick}>
                    <i className={`iconfont ${iconCls}`} />
                </button>
            </figure>
            <div className={styles.content}>
                <h3 className={styles.name} title={name} role="button" onClick={onClick}>
                    {name}
                </h3>
                <span className={styles.singer}>
                    <SingerLink data={artist} />
                </span>
            </div>
        </div>
    );
};
