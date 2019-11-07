export default class Lyric {
    constructor(options) {
        this.options = options;
        this.currentIndex = 0;
        this.prevLrcLine = 0;
        this.updateStyle();
    }
    getCurrentLrcId() {
        return this.options.id;
    }
    setOption(options) {
        this.options = Object.assign({}, this.options, options);
        if (this.options.lrcData) {
            this.renderLrc(this.options.lrcData, this.options.scrollBox);
        }
    }
    renderLrc(lrcData, scrollBox) {
        const lrcEle = this.createLrc(lrcData);
        scrollBox.innerHTML = '';
        scrollBox.appendChild(lrcEle);
    }
    update(currentTime = 0) {
        if (currentTime === 0) this.resetLrc();
        const { lrcData = [], paused } = this.options;
        if (paused) return;
        const lrcLen = lrcData.length;
        if (
            this.currentIndex > lrcLen - 1 ||
            currentTime < lrcData[this.currentIndex][0] ||
            (!lrcData[this.currentIndex + 1] || currentTime >= lrcData[this.currentIndex + 1][0])
        ) {
            for (let i = 0; i < lrcLen; i++) {
                if (currentTime >= lrcData[i][0] && (!lrcData[i + 1] || currentTime < lrcData[i + 1][0])) {
                    this.currentIndex = i;
                    if (this.prevLrcLine > 0 && this.prevLrcLine === this.currentIndex) return;
                    this.prevLrcLine = i;
                    const pos = this.calcScrollOffset(lrcLen, this.currentIndex, i);
                    this.updateScrollBox(pos, i);
                }
            }
        }
    }
    updateScrollBox(pos, index) {
        const { container, scrollBox, lrcOnClassName = 'lrc-on' } = this.options;
        const posRem = `translate3d(0, ${px2vw(pos)}, 0)`;
        scrollBox.style.cssText = `; transform: ${posRem}; -webkit-transform: ${posRem};`;
        if (index) {
            container.querySelector(`.${lrcOnClassName}`).classList.remove(lrcOnClassName);
            container.getElementsByTagName('li')[index].classList.add(lrcOnClassName);
        }
    }
    calcScrollOffset(lrcLen, currentIndex, index) {
        let offset = 0;
        const { lrcLineHeight, lrcMaxVisibleLine } = this.options;
        const halfMaxVisibleLine = Math.ceil(lrcMaxVisibleLine / 2);

        if (index > halfMaxVisibleLine && index < lrcLen - halfMaxVisibleLine) {
            offset = -(currentIndex - halfMaxVisibleLine);
        } else if (index > lrcLen - 1 - halfMaxVisibleLine) {
            offset = -(lrcLen - 1 - lrcMaxVisibleLine);
        }
        return offset * lrcLineHeight;
    }
    createLrc(data) {
        const oFrag = document.createDocumentFragment();
        for (let i = 0; i < data.length; i++) {
            const li = document.createElement('li');
            li.innerText = data[i][1];
            if (i === 0) li.classList.add(this.options.lrcOnClassName || 'lrc-on');
            oFrag.appendChild(li);
        }
        return oFrag;
    }
    updateStyle() {
        const { container, lrcMaxVisibleLine, lrcLineHeight } = this.options;
        const height = px2vw(lrcLineHeight * (lrcMaxVisibleLine + 1));
        const lineHeight = px2vw(lrcLineHeight);
        container.style.cssText += `;height: ${height}; line-height:${lineHeight};`;
    }
    resetLrc() {
        this.currentIndex = 0;
        this.prevLrcLine = 0;
        this.updateScrollBox(0);
    }
    static parseLyric(lrcString = '') {
        const larArray = [];
        lrcString = lrcString.replace(/([^\]^\n])\[/g, (match, p1) => `${p1}\n[`);
        const lrcString2Array = lrcString.split('\n');
        const lyricLen = lrcString2Array.length;

        for (let i = 0; i < lyricLen; i++) {
            const lrcTimes = lrcString2Array[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g);
            const lrcText = lrcString2Array[i]
                .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
                .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
                .replace(/^\s+|\s+$/g, '');
            if (lrcTimes) {
                const timeLen = lrcTimes.length;
                for (let j = 0; j < timeLen; j++) {
                    const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(lrcTimes[j]);
                    const min2sec = oneTime[1] * 60;
                    const sec2sec = parseInt(oneTime[2], 10);
                    const msec2sec = oneTime[4]
                        ? parseInt(oneTime[4], 10) / (`${oneTime[4]}`.length === 2 ? 100 : 1000)
                        : 0;
                    const lrcTime = min2sec + sec2sec + msec2sec;
                    larArray.push([lrcTime, lrcText]);
                }
            }
        }
        return larArray.filter(item => item[1]).sort((a, b) => a[0] - b[0]);
    }
}
