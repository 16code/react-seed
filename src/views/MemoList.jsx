export function ListItem({ data, selected, onClick }) {
    console.log(`${data.id} re-render!`);
    return (
        <li
            style={{ lineHeight: 3 }}
            onClick={() => {
                onClick(data);
            }}
        >
            {data.name}
            {selected === data.id && <span style={{ color: 'red' }}>current</span>}
            <span style={{ float: 'right' }}>{data.state}</span>
        </li>
    );
}
export default React.memo(ListItem, (prev, next) => prev.state === next.state && next.selected === prev.selected);
