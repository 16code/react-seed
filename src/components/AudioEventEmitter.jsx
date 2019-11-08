import mitt from 'mitt';
const events = [
    'abort',
    'canplay',
    'canplaythrough',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'loadeddata',
    'loadedmetadata',
    'loadstart',
    'mozaudioavailable',
    'pause',
    'play',
    'playing',
    'progress',
    'ratechange',
    'seeked',
    'seeking',
    'stalled',
    'suspend',
    'timeupdate',
    'volumechange',
    'waiting'
];
export const emitter = mitt();

export default function AudioEventEmitter() {
    console.log('EventEmitter init');
    const audio = document.getElementById('audio');
    for (let index = 0; index < events.length; index++) {
        const name = events[index];
        audio.addEventListener(name, event => {
            emitter.emit(name, event);
        });
    }
}
