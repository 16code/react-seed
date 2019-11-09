import { emitter } from 'components/AudioEventEmitter';
import Particle from 'helper/Particle';
import defaultCoverImg from 'assets/default.jpg';
const PI = Math.PI;
const dpr = window.devicePixelRatio || 1;
const accuracy = 128;

export default class AudioEffect {
    constructor(audio, canvas) {
        this.audio = audio;
        this.canvas = canvas;
        this.inVisible = false;
        this.animationId = null;
        this.particles = [];
        this.plyingSongInfo = {};
        this.coverImg = new Image();
        this.coverImg.src = defaultCoverImg;
        this.option = {
            maxParticle: 100,
            maxHeight: 26,
            minHeight: 2,
            spacing: 1,
            danceBarColor: '#caa',
            particleColor: '#caa',
            progressBarColor: '#caa',
            circleRadius: 88,
            showProgress: true
        };
        this.init(audio, canvas);
    }
    init = () => {
        this.setupAudio();
        this.setupCanvas();
        this.setupGradient();
    };
    start = () => {
        // listener audio events
        emitter.on('play', this.start);

        this.freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.context.resume();
        this.updateAnimations();
    };
    updateSongInfo = (nextSong, visible) => {
        this.inVisible = visible;
        if (this.plyingSongInfo.id !== nextSong.id) {
            this.plyingSongInfo = nextSong;
            this.preloadCoverImg(nextSong.coverImg);
        }
        if (visible) this.start();
    };
    updateAnimations = () => {
        // console.log('updateAnimations');
        if (this.isPlaying && this.inVisible) {
            this.startTimer();
        } else {
            const isEmpty = !this.freqData || !this.freqData.some(a => a > 0);
            if (isEmpty) {
                this.clearTimers();
            } else if (this.inVisible) {
                this.startTimer();
            }
        }
        this.animate();
    };
    animate = () => {
        this.analyser.getByteFrequencyData(this.freqByteData);
        this.freqData = rebuildData(this.freqByteData);
        this.render(this.freqData);
    };
    render = freqBytseData => {
        const audio = this.audio;
        const ctx2d = this.ctx2d;
        const option = this.option;
        const angle = (PI * 2) / freqBytseData.length;
        const progress = audio.currentTime / audio.duration;
        let maxHeight;
        let width;
        let height;
        let left;
        const circleRadius = option.circleRadius;
        // clear canvas
        ctx2d.clearRect(0, 0, this.canvasSize, this.canvasSize);
        ctx2d.save();
        ctx2d.translate(this.canvasSize / 2, this.canvasSize / 2);
        this.drawCover(progress, circleRadius);
        // this.createParticles();
        ctx2d.beginPath();
        freqBytseData.forEach((value, index) => {
            // prettier-ignore
            width = ((circleRadius * PI) - (accuracy * option.spacing)) / accuracy;
            left = index * (width + option.spacing);
            option.spacing !== 1 && (left += option.spacing / 2);
            maxHeight = option.maxHeight;
            // prettier-ignore
            height = (value / 256) * maxHeight;
            height = height < option.minHeight ? option.minHeight : height;
            ctx2d.fillStyle = option.danceBarColor;
            ctx2d.save();
            // prettier-ignore
            ctx2d.rotate((angle * index) - (progress * 100));
            ctx2d.fillRect(-width / 2, circleRadius, width, height);
            ctx2d.restore();
            ctx2d.fill();
        });
        if (option.showProgress) this.drawProgress(progress, circleRadius);
        ctx2d.restore();
    };
    drawCenterCircle = color => {
        const ctx2d = this.ctx2d;
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.globalCompositeOperation = 'source-over';
        ctx2d.arc(0, 0, 6, 0, PI * 2);
        ctx2d.fillStyle = color;
        ctx2d.fill();
        ctx2d.restore();
    };
    drawCover = (progress, circleRadius) => {
        // draw cover image
        const ctx2d = this.ctx2d;
        const img = this.coverImg;
        ctx2d.save();
        ctx2d.beginPath();
        ctx2d.lineWidth = 4;
        ctx2d.strokeStyle = this.gradient;

        ctx2d.globalCompositeOperation = 'destination-over';
        ctx2d.rotate((PI * 2 * (progress * 10)) / 2);
        // prettier-ignore
        ctx2d.arc(0, 0, circleRadius - 12, -PI / 2, (PI * 2) - (PI / 2));

        ctx2d.closePath();
        ctx2d.stroke();
        ctx2d.clip();
        const drawSize = circleRadius * 2;
        const sx = -circleRadius;
        const sy = sx;
        const imgWidth = img.width;
        // if (img.width / img.height !== 1) {
        //     const croppedImgWidth = (circleRadius * 2 * (img.width - img.height)) / img.height;
        //     // prettier-ignore
        //     sx = sx - (croppedImgWidth / 2);
        // }
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // ctx2d.drawImage(img, sx, sy, drawSize, drawSize);
        ctx2d.drawImage(img, 0, 0, imgWidth, imgWidth, sx, sy, drawSize, drawSize);
        ctx2d.restore();
    };
    drawProgress = (progress, circleRadius) => {
        const scaledRadius = circleRadius - 6;
        const ctx2d = this.ctx2d;
        ctx2d.beginPath();
        ctx2d.arc(0, 0, scaledRadius, 0, 2 * PI, false);
        ctx2d.lineWidth = 4;
        ctx2d.strokeStyle = 'rgba(255,255,255, 0.2)';
        ctx2d.stroke();

        ctx2d.beginPath();
        ctx2d.strokeStyle = this.option.progressBarColor;
        ctx2d.lineWidth = 2;
        ctx2d.lineCap = 'round';
        // prettier-ignore
        ctx2d.arc(0, 0, scaledRadius, -PI / 2, (PI * 2 * progress) - (PI / 2));
        ctx2d.stroke();
    };
    createParticles = () => {
        const deg = Math.random() * PI * 2;
        const { circleRadius, particleColor, maxParticle } = this.option;
        const particle = new Particle({
            x: (circleRadius + 20) * Math.sin(deg),
            y: (circleRadius + 20) * Math.cos(deg),
            vx: ((0.3 * Math.sin(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
            vy: ((0.3 * Math.cos(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
            life: Math.random() * 10,
            color: particleColor
        });
        this.particles.push(particle);
        // should clean dead particle before render.
        if (this.particles.length > maxParticle) {
            this.particles.shift();
        }
        this.particles.forEach(dot => {
            dot.update(this.ctx2d);
        });
    };
    setupGradient = () => {
        this.gradient = this.ctx2d.createLinearGradient(0, this.canvasSize / 2, this.canvasSize / 2, 0);
        this.gradient.addColorStop(0, '#AC4250');
        this.gradient.addColorStop(0.5, '#C6BFD0');
        this.gradient.addColorStop(1, '#CD6D93');
    };
    preloadCoverImg = url => {
        this.coverImg.src = defaultCoverImg;
        let img = new Image();
        img.onload = () => {
            this.coverImg.src = url;
            img = null;
        };
        img.src = url;
    };
    setupOption = o => {
        this.option = Object.assign({}, this.option, o);
    };
    setupAudio = () => {
        this.audioContext = new window.AudioContext();

        // setup audio sources
        this.audioSrc = this.audioContext.createMediaElementSource(this.audio);
        this.analyser = this.audioContext.createAnalyser();

        // connect sources
        this.audioSrc.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        // setup analyser
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -20;
        this.analyser.smoothingTimeConstant = 0.72;
        this.analyser.fftSize = 256;
    };
    setupCanvas = () => {
        const { circleRadius, maxHeight } = this.option;
        // prettier-ignore
        this.canvasSize = (circleRadius * 2) + (maxHeight * 2);
        this.ctx2d = this.canvas.getContext('2d', { alpha: true });
        // hd screen
        const hdSize = this.canvasSize * dpr;
        const hdSizeOfVw = px2vw(hdSize);
        this.canvas.style.width = hdSizeOfVw;
        this.canvas.style.height = hdSizeOfVw;
        this.ctx2d.canvas.height = hdSize;
        this.ctx2d.canvas.width = hdSize;
        this.ctx2d.scale(dpr, dpr);
        this.ctx2d.globalCompositeOperation = 'lighter';
    };
    get isPlaying() {
        return !this.audio.paused;
    }
    clearTimers = () => {
        this.particles.length = 0;
        this.animationId && window.cancelAnimationFrame(this.animationId);
        this.animationId = null;
    };
    startTimer = () => {
        this.animationId = window.requestAnimationFrame(this.updateAnimations);
    };
    destroy = () => {
        this.ctx2d.clearRect(0, 0, this.canvasSize, this.canvasSize);
        this.clearTimers();
        emitter.off('play', this.start);
    };
}

function rebuildData(freqByteData) {
    const output = [].concat(
        Array.from(freqByteData)
            .reverse()
            .splice(accuracy / 2, accuracy / 2),
        Array.from(freqByteData).splice(0, accuracy / 2)
    );
    return output;
}
