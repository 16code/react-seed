import { createReducer } from 'helper';
import { KEY_PREFIX_SETTING, PLAYER_STATE } from 'common/constants';

export const types = {
    playSong: 'player/playSong', // 播放歌曲
    playNextOrPrevSong: 'player/playNextOrPrevSong', // 播放上, 下一首,
    playerChangeVolume: 'player/changeVolume', // 调整音量,
    playerChangeRepeatMode: 'player/changeRepeatMode', // 调整播放器循环模式,
    changePlayerState: 'player/changeState'
};
const cachedSongs = [];

const initialState = {
    listRepeatMode: window.localStorage.getItem(`${KEY_PREFIX_SETTING}listRepeatMode`) || 'repeat',
    volume: +window.localStorage.getItem(`${KEY_PREFIX_SETTING}volume`) || 65,
    playerState: PLAYER_STATE.STOPED, // 当前播放状态
    playingSongId: undefined, // 正在播放的歌曲ID,
    playListByMusic: cachedSongs // 歌曲列表
};

export const playerReducer = createReducer(initialState, {
    [types.playSong]: handlePlaySong,
    [types.playNextOrPrevSong]: handlePlayNextOrPrevSong,
    [types.changePlayerState]: handleChangePlayerState,
    [types.playerChangeVolume]: handleChangeVolume,
    [types.playerChangeRepeatMode]: handleChangeRepeatMode
});

// 处理歌曲播放状态
function handlePlaySong(state, action) {
    const { playingSongId, playerState } = state;
    const { id: nextSongId } = action.payload || {};
    // 验证是否当前播放歌曲
    const adjustState = { playerState, playingSongId };

    if (playingSongId !== nextSongId) {
        // 如果要播放的歌曲是当前正在播放的歌曲, 那么就要做播放处理, 并且要添加到播放列表;
        adjustState.playerState = PLAYER_STATE.PENDING;
        adjustState.playingSongId = nextSongId;
    }
    return { ...state, ...adjustState };
}
// 上一曲 下一曲
function handlePlayNextOrPrevSong(state, action) {
    const { playListByMusic, playingSongId } = state;
    const currentMusicOffset = hasSongInPlaylist(playingSongId, playListByMusic);
    const fallbackPos = action.payload === 'next' ? 0 : playListByMusic.length - 1;
    const nextSongPos = action.payload === 'next' ? currentMusicOffset + 1 : currentMusicOffset - 1;
    const nextSong = playListByMusic[nextSongPos] ? playListByMusic[nextSongPos] : playListByMusic[fallbackPos];
    if (nextSong && nextSong.id && nextSong.id !== playingSongId) {
        return { ...state, playingSongId: nextSong.id, playerState: PLAYER_STATE.PENDING };
    }
    return state;
}

function handleChangePlayerState(state, action) {
    return { ...state, playerState: action.payload };
}

// 添加到播放列表
export function hasSongInPlaylist(checkID, songs) {
    return songs.findIndex(item => item.id === checkID);
}

// 调整播放器音量
function handleChangeVolume(state, action) {
    window.localStorage.setItem(`${KEY_PREFIX_SETTING}volume`, action.payload);
    return state;
}
// 调整播放器列表循环模式
function handleChangeRepeatMode(state, action) {
    const nextMode = getNextRepeatMode(action.payload);
    window.localStorage.setItem(`${KEY_PREFIX_SETTING}listRepeatMode`, nextMode);
    return { ...state, listRepeatMode: nextMode };
}

export const actions = {
    playSong: msuic => ({ type: types.playSong, payload: msuic }),
    playNextOrPrevSong: nextType => ({ type: types.playNextOrPrevSong, payload: nextType }),
    changePlayerState: state => ({ type: types.changePlayerState, payload: state }),
    changeVolume: volume => ({ type: types.playerChangeVolume, payload: volume }),
    changeRepeatMode: mode => ({ type: types.playerChangeRepeatMode, payload: mode })
};

// const REPEAT_MODES = ['repeat', 'repeatonce', 'shuffle'];
function getNextRepeatMode(cur) {
    let next = cur;
    switch (cur) {
        case 'shuffle':
            next = 'repeat';
            break;
        case 'repeatonce':
            next = 'shuffle';
            break;
        default:
            next = 'repeatonce';
            break;
    }
    return next;
}
