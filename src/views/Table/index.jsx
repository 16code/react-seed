import { Button } from 'antd';

@displayName('Table')
@safeSetState
export default class Table extends React.PureComponent {
    state = { url: null }
    async componentDidMount() {
        this.setState({ loading: true });
        // http://localhost:3000/api/products
        // http://localhost:3000/api/image
        // http://localhost:3000/api/xlsx
        // http://localhost:8383/235538174171.png
        // request.defaults.headers.common.Authorization = 'AUTH_TOKEN';
        request.setHeader({ Authorization: '1313131' });
        request('/api/products/:id', { method: 'POST', body: { data: 13131, id: 123 }, params: { id: 333333 } })
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.log(error);
            });
        // request
        //     .get('/api/products')
        //     .then(res => {
        //         console.log(res);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });
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
                <Button>13131</Button>
                {this.state.loading && <button onClick={this.handleCancel}>cancel xhr</button>}
                {this.state.loading && <button onClick={this.handleCancel2}>cancel xhr2</button>}
                <img width="40" src={this.state.url} alt="" />
            </div>
        );
    }
}
