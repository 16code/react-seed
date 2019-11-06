import AudioVisualizer from 'helper/AudioVisualizer';
const useState = React.useState;

const canvas = document.createElement('canvas');
const audio = document.getElementById('audio');
const audioVisualizer = new AudioVisualizer(audio, canvas);

export default function useAudioEffect(canvasId, canvasWrapEl) {
    const [canvasWrap, setCanvasWrap] = React.useState(canvasWrapEl);
    const [canvasElId, setCanvasElId] = React.useState(canvasId);
    if (canvasWrap && canvasElId && !document.getElementById(canvasElId)) {
        canvas.id = canvasElId;
        canvasWrap.appendChild(canvas);
    }
    const [visualizer] = useState(audioVisualizer);
    return {
        visualizer,
        canvas,
        setCanvasWrap,
        setCanvasElId
    };
}
