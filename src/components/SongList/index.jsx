import SongItem from 'components/SongItem';

function SongList({ dataSource = [] }) {
    return dataSource.map(item => <SongItem key={item.id} data={item} size="52x52" />);
}
export default SongList;
