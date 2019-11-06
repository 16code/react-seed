import LyricBox from './Lyric';

export default function LyricModal() {
    return ReactDOM.createPortal(<LyricBox />, document.getElementById('lyricBox'));
}
