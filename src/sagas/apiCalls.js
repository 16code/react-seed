export const loadMp3Address = id => request(`/media/${id}/url`);
export const loadLrc = id => request(`/media/${id}/lyric`);
export const loadSongInfo = id => request(`/api/songs/${id}`);
