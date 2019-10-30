import { types, hasSongInPlaylist } from 'reducers/player';
export default function playerMiddleware() {
    return ({ dispatch, getState }) => next => action => {
        if (!action || action.type !== types.changePlayerState) return next(action);
        const { player } = getState();
        // shuffle , repeat
        if (player.playerState !== 'stoped') return next(action);
        const { listRepeatMode, playListByMusic, playingSongId } = player;
        if (listRepeatMode === 'repeat' && playListByMusic.length > 1) {
            const offst = hasSongInPlaylist(playingSongId, playListByMusic);
            const nextSong = playListByMusic[offst + 1] || playListByMusic[0];
            if (nextSong.id) {
                return dispatch({
                    type: types.playSong,
                    payload: { id: nextSong.id }
                });
            }
        } else if (listRepeatMode === 'shuffle') {
            const nextSong = getNextSong(playingSongId, playListByMusic);
            if (nextSong.id) {
                return dispatch({
                    type: types.playSong,
                    payload: { id: nextSong.id }
                });
            }
        }
        return next(action);
    };
}
function random(songs) {
    return songs[Math.floor(Math.random() * songs.length)];
}
function getNextSong(curId, songs) {
    let nextSong = random(songs);
    if (nextSong && nextSong.id === curId) {
        nextSong = random(songs);
    }
    return nextSong;
}
