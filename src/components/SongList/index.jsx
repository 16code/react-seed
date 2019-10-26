import SongItem from 'components/SongItem';

function SongList({ dataSource = [] }) {
    return dataSource.map((item, index) => {
        const songId = item.id;
        return <SongItem key={songId} index={index} data={item} size="52x52" />;
    });
}
export default SongList;
