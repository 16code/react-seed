import { Icon } from 'antd';
import LoginForm from '@components/LoginForm';
import TwoStepVerify from '@components/TwoStepVerify';
import styles from './styles.less';

const IconPrefix = ({ type }) => <Icon type={type} style={{ color: 'rgba(0,0,0,.25)' }} />;

export default class LoginPage extends React.PureComponent {
    constructor() {
        super();
        this.state = { verifyCodeIsRequired: false, hasUserName: false, secretFetching: false };
    }
    onUserNameChanged = async ({ target }) => {
        if (target.value && target.value !== '') {
            this.setState({ userChecking: true });
            const verifyCodeIsRequired = await callUserCheck(target.value);
            this.setState({ verifyCodeIsRequired, hasUserName: true, userChecking: false });
        }
    };
    getSecretData = async data => {
        this.setState({ secretFetching: true });
        await delay(3000);
        const response = await callBindData(data)
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                this.setState({ secretFetching: false });
            });
        if (response) {
            this.setState({ userData: response, visible: true });
        }
    };
    handleSubmit = data => {
        console.log(data);
    };
    handleOpenAuthModal = data => {
        this.getSecretData(data);
    };
    handleRebindAuth = ({ data }) => {
        this.getSecretData(data);
    };
    handleCancelBind = () => {
        console.log('handleCancelBind');
        this.setState({ visible: false });
    };
    handleBindDone = () => {
        console.log('handleBindDone');
        this.setState({ visible: false });
    };
    handleTwoStepOnNext = async ({ current, data }) => {
        if (current === 2 && data) {
            try {
                this.setState({ bindState: 'waiting' });
                await delay(1500);
                await callBindResult(data).catch(() => {
                    this.setState({ bindState: 'filed' });
                    return Promise.reject('auth bind filed');
                });
                this.setState({ bindState: 'succeed' });
            } catch (error) {
                console.log(error);
            }
        }
    };
    render() {
        const {
            userData,
            hasUserName,
            userChecking,
            verifyCodeIsRequired,
            bindState,
            visible,
            secretFetching
        } = this.state;
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
                    autoComplete: 'new-password',
                    type: 'password'
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
                    autoComplete: 'new-password',
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
                                    onAuthBind={this.handleOpenAuthModal}
                                    userNameField="account"
                                    passwordField="password"
                                    disableAuthBind={secretFetching}
                                    disableSubmit={userChecking}
                                    loading={false}
                                    showAuthBind
                                />
                            </div>
                        </section>
                    </div>
                    <TwoStepVerify
                        visible={visible}
                        userData={userData}
                        onNext={this.handleTwoStepOnNext}
                        onCancel={this.handleCancelBind}
                        onDone={this.handleBindDone}
                        onRebind={this.handleRebindAuth}
                        loading={secretFetching}
                        state={bindState}
                    />
                </div>
            </div>
        );
    }
}
function callBindData({ account, password }) {
    const { data } = require('@views/auth-mock.json');
    return new Promise((resolve, reject) => {
        const delay = parseInt(Math.random() * 100, 10);
        setTimeout(() => {
            Math.random() < 0.1
                ? reject({ message: 'error' })
                : resolve({
                    account,
                    password,
                    secretKey: btoa(Math.random())
                        .substring(0, 16)
                        .toUpperCase(),
                    qrcode: data.qrcode
                });
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
function callBindResult() {
    return new Promise((resolve, reject) => {
        const delay = parseInt(Math.random() * 100, 10);
        setTimeout(() => {
            Math.random() < 0.88 ? reject() : resolve();
        }, delay);
    });
}
