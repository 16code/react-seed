import { createReducer, safaJsonParse } from 'helper';
import { HISTORY_BY_SONG_LIST, KEY_PREFIX_SETTING } from 'common/constants';

export const types = {
    playSong: 'player/playSong', // 播放歌曲
    playNextOrPrevSong: 'player/playNextOrPrevSong', // 播放上, 下一首,
    playPrevSong: 'player/playPrevSong', // 播放上一首,
    playerPause: 'player/playerPause', // 暂停播放
    playerStop: 'player/playerStop', // 停止播放,
    playerChangeVolume: 'player/changeVolume', // 调整音量,
    playerChangeRepeatMode: 'player/changeRepeatMode', // 调整播放器循环模式,
    changePendingToPlaying: 'player/changePendingToPlaying', // 播放器状态改为播放中
    changePlayerCanPlay: 'player/changePlayerCanPlay', // 播放器状态改为播放中
    changePlayerRepeatState: 'player/changePlayerRepeatState', // 更改列表播放模式,
    fetchSongDataRequest: 'player/fetchSongDataRequest',
    fetchSongDataSuccess: 'player/fetchSongDataSuccess',
    fetchSongDataFailure: 'player/fetchSongDataFailure'
};
const cachedSongs = safaJsonParse(window.localStorage.getItem(HISTORY_BY_SONG_LIST)) || [];

const initialState = {
    listRepeatState: window.localStorage.getItem(`${KEY_PREFIX_SETTING}listRepeatMode`) || 'repeat',
    volume: +window.localStorage.getItem(`${KEY_PREFIX_SETTING}volume`) || 65,
    canPlaying: false,
    songFetching: false, // 是否正在请求歌曲信息
    playerState: undefined, // 当前播放状态
    playingSongId: undefined, // 正在播放的歌曲ID,
    playingSongData: undefined,
    playListByMusic: cachedSongs // 歌曲列表
};

export const updatedReducer = createReducer(initialState, {
    [types.playSong]: handlePlaySong,
    [types.playNextOrPrevSong]: handlePlayNextOrPrevSong,
    [types.playerStop]: handlePlayerStop,
    [types.changePendingToPlaying]: handleChangePendingToPlaying,
    [types.changePlayerCanPlay]: handleChangePlayerCanPlay,
    [types.playerChangeVolume]: handleChangeVolume,
    [types.playerChangeRepeatMode]: handleChangeRepeatMode,
    [types.fetchSongDataRequest]: handleFetchSongDataRequest,
    [types.fetchSongDataSuccess]: handleFetchSongDataSuccess,
    [types.fetchSongDataFailure]: handleFetchSongDataFailure
});

// 处理reduces

// 处理歌曲播放状态
function handlePlaySong(state, action) {
    const { playingSongId, playerState, playListByMusic } = state;
    const { id } = action.payload || {};
    // 验证是否当前播放歌曲
    const adjustState = { playerState, playingSongId };

    if (playingSongId !== id) {
        // 如果要播放的歌曲是当前正在播放的歌曲, 那么就要做播放处理, 并且要添加到播放列表;
        const newPlayList = addSongToPlaylist(action.payload, playListByMusic);

        adjustState.playListByMusic = [...newPlayList];
        adjustState.playerState = 'pending'; // pending 的原因是因为还要去请求歌曲播放地址;
        adjustState.canPlaying = false;
        adjustState.playingSongId = id;
        // const currentMusicOffset = hasSongInPlaylist(id, playListByMusic);
        // adjustState.playingSongData = playListByMusic[currentMusicOffset];
    } else {
        // 如果要播放的歌曲是当前正在播放的歌曲, 那么就要根据当前播放状态做暂停处理;
        adjustState.playerState = playerState === 'playing' ? 'paused' : 'playing';
        // 如果歌曲地址请求完成之后要通知reduce做状态更改 playing
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
        return { ...state, playingSongId: nextSong.id, playerState: 'pending', canPlaying: false };
    }
    return state;
}
// 设置播放器可播放状态 canPlaying
function handleChangePlayerCanPlay(state, action) {
    const { playerState } = state;
    if (playerState === 'pending') {
        return { ...state, canPlaying: action.payload };
    }
    return state;
}
// 从pending 状态更改到 playing 状态
function handleChangePendingToPlaying(state) {
    const { playerState } = state;
    if (playerState === 'pending') {
        return { ...state, playerState: 'playing' };
    }
    return state;
}
// 添加到播放列表
export function hasSongInPlaylist(checkID, songs) {
    return songs.findIndex(item => item.id === checkID);
}
function addSongToPlaylist(song, songs) {
    const isInList = hasSongInPlaylist(song.id, songs) !== -1;
    if (!isInList) {
        songs.unshift(song);
        window.localStorage.setItem(HISTORY_BY_SONG_LIST, JSON.stringify(songs));
    }
    return songs;
}
// 调整播放器音量
function handleChangeVolume(state, action) {
    window.localStorage.setItem(`${KEY_PREFIX_SETTING}volume`, action.payload);
    return { ...state, volume: action.payload };
}
// 调整播放器列表循环模式
function handleChangeRepeatMode(state, action) {
    const nextMode = getNextRepeatMode(action.payload);
    window.localStorage.setItem(`${KEY_PREFIX_SETTING}listRepeatMode`, nextMode);
    return { ...state, listRepeatState: nextMode };
}
// 播放器停止播放停止
function handlePlayerStop(state) {
    return { ...state, playerState: 'stoped', canPlaying: false };
}

// 获取歌曲信息
function handleFetchSongDataRequest(state) {
    return { ...state, songFetching: true, playerState: 'pending' };
}
function handleFetchSongDataSuccess(state, action) {
    return { ...state, songFetching: false, playingSongData: action.payload };
}
function handleFetchSongDataFailure(state) {
    return { ...state, songFetching: false, playingSongData: null, playerState: 'failed' };
}

export const actions = {
    playSong: msuic => ({ type: types.playSong, payload: msuic }),
    playNextOrPrevSong: nextType => ({ type: types.playNextOrPrevSong, payload: nextType }),
    playerStop: state => ({ type: types.playerStop, payload: state }),
    fetchLrc: id => ({ type: types.fetchLrc, payload: id }),
    changePendingToPlaying: () => ({ type: types.changePendingToPlaying }),
    changePlayerCanPlay: state => ({ type: types.changePlayerCanPlay, payload: state }),
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
