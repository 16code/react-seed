import { message } from 'antd';
import Login from '@components/Login';
import AuthBinding from '@components/AuthBinding';

export function handleCheckAccount(account) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(account !== 'admin');
        }, 300);
    });
}

function handleGetBindData({ account, password }) {
    const { data } = require('./auth-mock.json');
    return new Promise((resolve, reject) => {
        const delay = parseInt(Math.random() * 100, 10);
        setTimeout(() => {
            Math.random() < 0.1
                ? reject({ message: 'error' })
                : resolve({ account, password, secretKey: data.secretKey, qrcode: data.qrcode });
        }, delay);
    });
}

export default class LoginView extends React.PureComponent {
    state = { authBindModalVisible: false, loginRef: null };
    handleSubmit = values => {
        console.log('handleSubmit', values);
    };
    handleBindAuth = async values => {
        this.setState({ fetchBindData: true });
        const hideMessage = message.loading('正在请求二次验证数据, 请稍后...', 0);
        const bindData = await handleGetBindData(values)
            .catch(e => {
                console.log(e);
            })
            .finally(() => {
                this.setState({ fetchBindData: false }, hideMessage);
            });
        if (bindData) {
            this.setState({ authBindModalVisible: true, userData: bindData });
        }
    };
    handleClose = () => {
        this.setState({ authBindModalVisible: false });
    };
    handleAuthBind = data => {
        return new Promise(res => {
            setTimeout(() => {
                res(data);
            }, 3000);
        });
    };
    render() {
        const { authBindModalVisible, userData, fetchBindData, loginRef } = this.state;
        return (
            <>
                <Login
                    ref={r => {
                        this.setState({ loginRef: r });
                    }}
                    onCheckAccount={handleCheckAccount}
                    onSubmit={this.handleSubmit}
                    onBindAuth={this.handleBindAuth}
                    fetchBindData={fetchBindData}
                    authBind
                />
                {loginRef && (
                    <AuthBinding
                        visible={authBindModalVisible}
                        userData={userData}
                        getContainer={loginRef}
                        onBind={this.handleAuthBind}
                        onOk={this.handleClose}
                    />
                )}
            </>
        );
    }
}
