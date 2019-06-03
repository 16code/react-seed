import Login from '@components/Login';

export function handleCheckAccount(account) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(account !== 'admin');
        }, 300);
    });
}
export default class LoginView extends React.PureComponent {
    handleSubmit = values => {
        console.log('handleSubmit', values);
    };
    handleBindAuth = values => {
        console.log('handleBindAuth', values);
    };
    render() {
        return (
            <Login
                onCheckAccount={handleCheckAccount}
                onSubmit={this.handleSubmit}
                onBindAuth={this.handleBindAuth}
                authBind
            />
        );
    }
}
