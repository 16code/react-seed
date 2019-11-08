import Box from 'components/Box';
import MemoItem from './MemoList';
const s = ['pending', 'playing', 'stoped'];

@hot
export default class Memo extends React.PureComponent {
    state = { list: [], selectedId: undefined };
    componentDidMount() {
        const states = Array.from({ length: 4 }).map((item, id) => ({
            id,
            name: `name -- ${id}`,
            state: this.getState()
        }));
        this.updateState(states);
    }
    updateState = next => {
        this.setState({ list: [...next] });
    };
    getState() {
        return s[Math.floor(Math.random() * s.length)];
    }
    handleClick = item => {
        const nextState = this.getState();
        const list = this.state.list;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.id === item.id) {
                element.state = nextState === item.state ? this.getState() : nextState;
                break;
            }
        }
        this.updateState(list);
        this.setState({ selectedId: item.id });
    };
    renderList = data => (
        <MemoItem
            selected={this.state.selectedId}
            key={data.id}
            id={data.id}
            state={data.state}
            data={data}
            onClick={this.handleClick}
        />
    );
    render() {
        return (
            <Box title="Memo">
                <ul>{this.state.list.map(this.renderList)}</ul>
            </Box>
        );
    }
}
