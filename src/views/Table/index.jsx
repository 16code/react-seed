import { Button } from 'antd';

@displayName('Table')
@safeSetState()
export default class Table extends React.PureComponent {
    state = { url: null }
    async componentDidMount() {
        this.setState({ loading: true });
        request('/api/products', { method: 'GET', body: { data: 13131, id: 123 }, params: { id: 333333 } })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            });
    }
    handleCancel2 = () => {
        // this.xhr2.cancelRequest();
    }
    handleCancel = () => {
        // this.xhr.cancelRequest();
    }
    render() {
        return (
            <div>
                <Button>aa1eeewwwaaa</Button>
                {this.state.loading && <button onClick={this.handleCancel}>cancel xhr</button>}
                {this.state.loading && <button onClick={this.handleCancel2}>cancel xhr2</button>}
                <img width="40" src={this.state.url} alt="" />
            </div>
        );
    }
}
