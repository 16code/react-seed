import SongItem from 'components/SongItem';

function SongList({ dataSource = [] }) {
    return dataSource.map((item, index) => <SongItem key={item.id} index={index} data={item} size="52x52" />);
}
export default SongList;
