import { Icon } from 'antd';
import LoginForm from '@components/LoginForm';
import TwoStepVerify from '@components/TwoStepVerify';
import styles from './styles.less';

const IconPrefix = ({ type }) => <Icon type={type} style={{ color: 'rgba(0,0,0,.25)' }} />;

export default class LoginPage extends React.PureComponent {
    constructor() {
        super();
        this.state = { verifyCodeIsRequired: false, hasUserName: false };
    }
    async componentDidMount() {
        const userData = await handleGetBindData({ account: 'admin1', password: '1313313313aaa' }).catch(e => {
            console.log(e);
        });
        if (userData) {
            this.setState({ userData });
        }
    }
    onUserNameChanged = async ({ target }) => {
        if (target.value && target.value !== '') {
            this.setState({ userChecking: true });
            const verifyCodeIsRequired = await callUserCheck(target.value);
            this.setState({ verifyCodeIsRequired, hasUserName: true, userChecking: false });
        }
    };
    handleSubmit = data => {
        console.log(data);
    };
    handleAuthBind = data => {
        console.log(data);
    };
    render() {
        const { userData, hasUserName, userChecking, verifyCodeIsRequired } = this.state;
        const verifyCodeRequired = hasUserName && !verifyCodeIsRequired;

        const fieldsConfig = {
            account: {
                inputProps: {
                    onBlur: this.onUserNameChanged,
                    prefix: <IconPrefix type={'user'} />,
                    suffix: userChecking && <IconPrefix type={'loading'} spin />,
                    size: 'large',
                    placeholder: '用户名',
                    autoComplete: 'off'
                },
                fieldOption: {
                    rules: [
                        {
                            whitespace: true,
                            required: true,
                            message: '请输入用户名!'
                        }
                    ]
                }
            },
            password: {
                inputProps: {
                    prefix: <IconPrefix type={'lock'} />,
                    size: 'large',
                    placeholder: '密码',
                    autoComplete: 'off'
                },
                fieldOption: {
                    rules: [
                        {
                            required: true,
                            message: '请输入密码!'
                        }
                    ]
                }
            },
            verifycode: {
                disabled: verifyCodeRequired,
                inputProps: {
                    prefix: <IconPrefix type={'safety'} />,
                    size: 'large',
                    autoComplete: 'off',
                    placeholder: verifyCodeRequired ? '此帐号无需输入口令' : '输入动态口令',
                    type: 'tel'
                },
                fieldOption: {
                    rules: [
                        {
                            required: verifyCodeIsRequired,
                            pattern: /^\d{6}$/,
                            message: '请输入6位数字验证码'
                        }
                    ]
                }
            }
        };
        const pageTitle = 'React Seed';
        return (
            <div className={styles['login-page']}>
                <h1 className={styles['page-title']}>{pageTitle}</h1>
                <div className={styles['login-form-wrapper']}>
                    <div className={styles['login-form-content']}>
                        <section className={styles.left}>
                            <span className={styles.illustration} />
                        </section>
                        <span className={styles['split-line']} />
                        <section className={styles.right}>
                            <div style={{ width: '82%' }}>
                                <h1 className={styles['page-subtitle']}>{pageTitle}</h1>
                                <LoginForm
                                    config={fieldsConfig}
                                    onSubmit={this.handleSubmit}
                                    onAuthBind={this.handleAuthBind}
                                    userNameField="account"
                                    passwordField="password"
                                    disabledAuthBind={false}
                                    disableSubmit={userChecking}
                                    loading={false}
                                    showAuthBind
                                />
                            </div>
                        </section>
                    </div>
                </div>
                <TwoStepVerify userData={userData} />
            </div>
        );
    }
}
function handleGetBindData({ account, password }) {
    const { data } = require('@views/auth-mock.json');
    return new Promise((resolve, reject) => {
        const delay = parseInt(Math.random() * 100, 10);
        setTimeout(() => {
            Math.random() < 0.1
                ? reject({ message: 'error' })
                : resolve({ account, password, secretKey: data.secretKey, qrcode: data.qrcode });
        }, delay);
    });
}
function callUserCheck(account) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(account !== 'admin');
        }, 300);
    });
}
