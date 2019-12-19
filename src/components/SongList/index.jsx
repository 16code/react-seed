import SongItem from 'components/SongItem';

function SongList({ dataSource = [], ordered, size }) {
    return dataSource.map((item, index) => (
        <SongItem
            ordered={ordered}
            key={item.id}
            index={index}
            data={item}
            size={size || '52x52'}
        />));
}
export default SongList;
