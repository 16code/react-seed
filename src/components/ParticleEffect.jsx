import Particle from 'helper/Particle';
// import { emitter } from 'components/AudioEventEmitter';
const useRef = React.useRef;
const useEffect = React.useEffect;
const PI = Math.PI;
const dpr = window.devicePixelRatio || 1;
const option = {
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
const { circleRadius, particleColor, maxParticle, maxHeight } = option;
const canvasSize = (circleRadius * 2) + (maxHeight * 2); // prettier-ignore
// hd screen
const hdSize = canvasSize * dpr;
const hdSizeOfVw = px2vw(hdSize);
const particles = [];
let timerid;
export default function ParticleEffect({ playing }) {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx2d = canvas.getContext('2d');
        canvas.style.width = hdSizeOfVw;
        canvas.style.height = hdSizeOfVw;
        ctx2d.canvas.height = hdSize;
        ctx2d.canvas.width = hdSize;
        ctx2d.scale(dpr, dpr);
        if (playing) {
            animate({ ctx2d, particles });
        } else {
            cleanup();
        }
        function cleanup() {
            window.cancelAnimationFrame(timerid);
            timerid = null;
            particles.length = 0;
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        }
        return cleanup;
    }, [playing]);
    return <canvas ref={canvasRef} />;
}
function animate({ ctx2d, particles }) {
    timerid = window.requestAnimationFrame(animate.bind(null, { ctx2d, particles }));
    ctx2d.clearRect(0, 0, canvasSize, canvasSize);
    ctx2d.save();
    ctx2d.translate(canvasSize / 2, canvasSize / 2);
    const deg = Math.random() * PI * 2;
    const particle = new Particle({
        x: (circleRadius + 20) * Math.sin(deg),
        y: (circleRadius + 20) * Math.cos(deg),
        vx: ((0.3 * Math.sin(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
        vy: ((0.3 * Math.cos(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
        life: Math.random() * 10,
        color: particleColor
    });
    particles.push(particle);
    if (particles.length > maxParticle) {
        particles.shift();
    }
    particles.forEach(dot => {
        dot.update(ctx2d);
    });
    ctx2d.restore();
}
