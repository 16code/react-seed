import { connect } from 'react-redux';
import { formatTime } from 'helper';
import { emitter } from 'components/AudioEventEmitter';
import { PLAYER_STATE } from 'common/constants';
import { actions as playerActions } from 'reducers/player';
import { actions as lyricBoxActions } from 'reducers/lyric';
import { actions as historyBoxActions } from 'reducers/history';
import PlayControl from 'components/PlayControl';
import RangeSlider from 'components/RangeSlider';
import VolumeControl from './Volume';
import styles from './styles.less';

@connect(
    ({ player, lyric, playHistory }) => ({
        volume: player.volume,
        lyricVisible: lyric.visible,
        playerState: player.playerState,
        playingSongId: player.playingSongId,
        listRepeatMode: player.listRepeatMode,
        playHistory: playHistory.list
    }),
    {
        playSong: playerActions.playSong,
        changePlayerState: playerActions.changePlayerState,
        playNextOrPrevSong: playerActions.playNextOrPrevSong,
        changeVolume: playerActions.changeVolume,
        changeRepeatMode: playerActions.changeRepeatMode,
        toggleLrcBoxVisible: lyricBoxActions.toggleVisible,
        toggleHistoryVisible: historyBoxActions.toggleVisible
    }
)
export default class AudioPlayer extends React.PureComponent {
    playerBoxRef = React.createRef();
    playerProgressBarRef = React.createRef();
    mediaPlayer = document.getElementById('audio');
    cachedRepaatModeIcons = {};
    componentDidMount() {
        emitter.on('progress', this.onProgress);
        emitter.on('durationchange', this.onLoadedMetaData);
        emitter.on('timeupdate', this.onPlayerTimeUpdate);
        emitter.on('canplay', this.props.changePlayerState.bind(null, PLAYER_STATE.PLAYING));
        emitter.on('error', () => {
            this.props.changePlayerState(PLAYER_STATE.FAILED);
        });
        emitter.on('ended', this.props.changePlayerState.bind(null, PLAYER_STATE.STOPED));

        const playerBox = this.playerBoxRef.current;
        this.playerProgressBar = this.playerProgressBarRef.current.progressBar;
        this.currentTimeElement = playerBox.querySelector('#audio-current-time');
        this.totalTimeElement = playerBox.querySelector('#audio-duration-titme');
        this.preloadedBarElement = playerBox.querySelector('#audio-preload-bar');
        this.updateVolume(this.props.volume);
    }
    componentWillUnmount() {
        emitter.off('progress', this.onProgress);
        emitter.off('durationchange', this.onLoadedMetaData);
        emitter.off('timeupdate', this.onPlayerTimeUpdate);
        emitter.off('canplay', this.props.changePlayerState.bind(null, PLAYER_STATE.PLAYING));
        emitter.off('error', this.props.changePlayerState.bind(null, PLAYER_STATE.FAILED));
        emitter.off('ended', this.props.changePlayerState.bind(null, PLAYER_STATE.STOPED));
    }
    componentDidUpdate(prevProps) {
        const { playerState, playingSongId, listRepeatMode } = this.props;
        if (!prevProps.playerState || prevProps.playerState === playerState) return;
        if (prevProps.playingSongId !== playingSongId) {
            const isloop = listRepeatMode === 'repeatonce';
            this.setupAudio(playingSongId, isloop);
            this.doPause();
        }

        switch (playerState) {
            case 'paused':
                this.doPause();
                break;
            case 'playing':
                this.doPlay();
                break;
            case 'stoped':
                this.doStop();
                break;
            default:
                break;
        }
    }
    doPlay() {
        const promise = this.mediaPlayer.play();
        if (promise) {
            promise.then(() => {
                console.log('Autoplay started!');
            }).catch(error => {
                console.log(error);
            });
        }
    }
    doPause() {
        this.mediaPlayer.pause();
    }
    doStop() {
        this.doPause();
        this.mediaPlayer.currentTime = 0;
    }
    // 播放音乐
    handlePlayBtnClick = () => {
        const { playingSongId } = this.props;
        if (playingSongId) {
            this.props.playSong({ id: playingSongId });
        }
    };
    // 切换播放模式
    handleChangeRepeatMode = () => {
        const { listRepeatMode, changeRepeatMode } = this.props;
        changeRepeatMode(listRepeatMode);
    };
    // 音量调整
    handleVolumeChange = value => {
        this.updateVolume(value);
        this.props.changeVolume(value);
    };
    // 进度条拖拽回调
    handleProgressMoved = ({ eventType, origin: percentageNum }) => {
        if (eventType === 'dragStart') {
            this.disableTimeupdate = true;
        } else {
            const { duration } = this.mediaMetaInfo;
            const currentTime = duration * percentageNum;
            this.updatePlayedTime(currentTime);
            if (eventType === 'dragEnd') {
                this.disableTimeupdate = false;
                this.mediaPlayer.currentTime = currentTime || 0;
            }
        }
    };
    // 切换播放列表
    handleTogglePlaylist = () => {
        this.props.toggleHistoryVisible();
    };
    // 播放上一曲下一曲
    playNextOrPrevSong = type => {
        this.props.playNextOrPrevSong(type);
    };
    onPlayerTimeUpdate = () => {
        const { currentTime, duration } = this.mediaMetaInfo;
        if (!this.disableTimeupdate) {
            this.updatePlayedTime(currentTime);
            const offset = calcProgressPos(currentTime, duration);
            this.updateProgressBar(offset);
        }
    };
    // 更新当前播放的时间
    updatePlayedTime = currentTime => {
        this.currentTimeElement.textContent = formatTime(currentTime);
    };
    // 更新进度条
    updateProgressBar = offset => {
        this.playerProgressBar.style.width = offset;
    };
    // 加载音频元数据
    onLoadedMetaData = () => {
        const { duration } = this.mediaMetaInfo;
        this.totalTimeElement.textContent = formatTime(duration);
        this.onProgress();
    };
    onProgress = () => {
        const { buffered, duration } = this.mediaMetaInfo;
        updatePreloadBar(buffered, duration, this.preloadedBarElement);
    };
    updateVolume = v => {
        const volume = v / 100;
        this.mediaPlayer.volume = volume;
    };
    // 获取媒体信息
    get mediaMetaInfo() {
        const { buffered, duration, currentTime, currentSrc } = this.mediaPlayer;
        return { buffered, duration, currentTime, currentSrc };
    }
    get playerIsPaused() {
        return this.mediaPlayer.paused;
    }
    createRepeatModeClass = mode => {
        const cls = classNames('iconplayer', `icon-${mode}`);
        this.cachedRepaatModeIcons[mode] = cls;
        return cls;
    };
    getRepeatModeClass = mode => {
        const cached = this.cachedRepaatModeIcons[mode];
        return cached ? cached : this.createRepeatModeClass(mode);
    };
    handleToggleLrcBox = () => {
        this.props.toggleLrcBoxVisible();
    };
    setupAudio = (nextId, isLoop) => {
        const dataset = this.mediaPlayer.dataset;
        if (nextId && +dataset.songid !== nextId) {
            dataset.songid = nextId;
            this.mediaPlayer.src = `/media/${nextId}/url`;
        }
        this.mediaPlayer.loop = isLoop;
    };
    render() {
        const { playingSongId, playerState, volume, listRepeatMode, playHistory, lyricVisible } = this.props;
        const repeatModeIonClass = this.getRepeatModeClass(listRepeatMode);
        const btnDisabled = !playHistory.length;
        const method = lyricVisible ? 'add' : 'remove';
        const { currentSrc } = this.mediaMetaInfo;
        const disabledRangeSlider = !playingSongId || !currentSrc || currentSrc === '';
        document.body.classList[method](styles.dark);
        return (
            <>
                <div className={classNames(styles['audio-player'])} ref={this.playerBoxRef} key="audioPlayerBox">
                    <div className={classNames(styles['player-controls'], styles['left-controls'])}>
                        <button
                            className={styles['control-button']}
                            title="上一曲"
                            role="button"
                            disabled={btnDisabled}
                            onClick={() => this.playNextOrPrevSong('prev')}
                        >
                            <i className="iconplayer icon-skip-back" />
                        </button>
                        <PlayControl
                            songId={playingSongId}
                            disabled={playerState === 'pending'}
                            onClick={this.handlePlayBtnClick}
                            theme="dark"
                        />
                        <button
                            className={styles['control-button']}
                            title="下一曲"
                            role="button"
                            disabled={btnDisabled}
                            onClick={() => this.playNextOrPrevSong('next')}
                        >
                            <i className="iconplayer icon-skip-forward" />
                        </button>
                    </div>
                    <div className={styles['player-extra']}>
                        <span id="audio-current-time" className={classNames(styles['player-time'], styles.current)}>
                            00:00
                        </span>
                        <RangeSlider
                            ref={this.playerProgressBarRef}
                            percentage={0}
                            onChange={this.handleProgressMoved}
                            disabled={disabledRangeSlider}
                        >
                            <span id="audio-preload-bar" className={styles['bar-preload']} />
                        </RangeSlider>
                        <span id="audio-duration-titme" className={classNames(styles['player-time'], styles.duration)}>
                            00:00
                        </span>
                    </div>
                    <div className={classNames(styles['player-controls'], styles['right-controls'])}>
                        <VolumeControl onChange={this.handleVolumeChange} volume={volume} />
                        <button
                            className={styles['control-button']}
                            title="循环模式"
                            role="button"
                            onClick={this.handleChangeRepeatMode}
                        >
                            <i className={repeatModeIonClass} />
                        </button>
                        <button
                            className={styles['control-button']}
                            title="播放列表"
                            role="button"
                            onClick={this.handleTogglePlaylist}
                        >
                            <i className="iconplayer icon-queue" />
                        </button>
                    </div>
                </div>
            </>
        );
    }
}

function calcProgressPos(currentTime, duration) {
    return Number.isNaN(duration) ? 0 : `${(currentTime / duration) * 100}%`;
}
function updatePreloadBar(buffered, duration, ele) {
    if (!ele) return;
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
        ranges.push([buffered.start(i), buffered.end(i)]);
    }
    for (let i = 0; i < buffered.length; i++) {
        const pos = Math.round((100 / duration) * (ranges[i][1] - ranges[i][0]));
        ele.style.width = `${pos}%`;
    }
}
