import Particle from 'helper/Particle';
const useRef = React.useRef;
const useEffect = React.useEffect;
const PI = Math.PI;

// hd screen
const particles = [];
let timerid;
export default function ParticleEffect({ playing, option = {} }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const { radius, dpr, max, canvasSize, canvasSizeVw, canvasSizeHd, fillColor } = buildConfig(option);
        const canvas = canvasRef.current;
        const ctx2d = canvas.getContext('2d');
        canvas.style.width = canvasSizeVw;
        canvas.style.height = canvasSizeVw;
        ctx2d.canvas.height = canvasSizeHd;
        ctx2d.canvas.width = canvasSizeHd;
        ctx2d.scale(dpr, dpr);
        if (playing) {
            animate();
        } else {
            cleanup();
        }
        function animate() {
            timerid = window.requestAnimationFrame(animate);
            ctx2d.clearRect(0, 0, canvasSize, canvasSize);
            ctx2d.save();
            ctx2d.translate(canvasSize / 2, canvasSize / 2);
            const deg = Math.random() * PI * 2;
            const particle = new Particle({
                x: (radius - 10) * Math.sin(deg),
                y: (radius - 10) * Math.cos(deg),
                vx: ((0.3 * Math.sin(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
                vy: ((0.3 * Math.cos(deg)) + (Math.random() * 0.5)) - 0.3, // prettier-ignore
                life: Math.random() * 10,
                color: fillColor
            });
            particles.push(particle);
            if (particles.length > max) {
                particles.shift();
            }
            particles.forEach(dot => {
                dot.update(ctx2d);
            });
            ctx2d.restore();
        }
        function cleanup() {
            window.cancelAnimationFrame(timerid);
            timerid = null;
            particles.length = 0;
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        }
        return cleanup;
    }, [option, playing]);
    return <canvas ref={canvasRef} />;
}

export function buildConfig(cfg) {
    const dpr = window.devicePixelRatio || 1;
    const radius = cfg.radius || 88;
    const fillColor = cfg.fillColor || '#caa';
    const max = cfg.max || 100;
    const canvasSize = radius * 2.4;
    const canvasSizeHd = canvasSize * dpr;
    const option = {
        dpr,
        radius,
        max,
        fillColor,
        canvasSize,
        canvasSizeHd,
        canvasSizeVw: px2vw(canvasSizeHd)
    };
    return option;
}
