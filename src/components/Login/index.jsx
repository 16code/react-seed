import { Icon } from 'antd';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import LoginForm from './LoginForm';
import styles from './styles.less';

const IconPrefix = ({ type }) => <Icon type={type} style={{ color: 'rgba(0,0,0,.25)' }} />;

class UserLogin extends React.PureComponent {
    static propTypes = {
        authBind: PropTypes.bool,
        onCheckAccount: PropTypes.func,
        onBindAuth: PropTypes.func,
        onSubmit: PropTypes.func.isRequired
    };
    userLoginForm = React.createRef();
    constructor() {
        super();
        this.state = { lockIsRequired: false };
        this.callAccountChecker = debounce(this.callAccountChecker, 300);
    }
    accountChecker = ({ target }) => {
        if (target.value && target.value !== '') this.callAccountChecker(target.value);
    };
    callAccountChecker = async value => {
        const { onCheckAccount } = this.props;
        this.setState({ accountChecking: true, hasAccount: value && value !== '' });
        const isRequired = await onCheckAccount(value).finally(() => {
            this.setState({ accountChecking: false });
        });
        this.setState({ lockIsRequired: isRequired }, () => {
            if (!isRequired) {
                const { resetFields } = this.userLoginForm.current;
                resetFields(['verifycode']);
            }
        });
    };
    render() {
        const { onCheckAccount, onSubmit, onBindAuth, authBind, fetchBindData } = this.props;
        const { accountChecking, lockIsRequired, hasAccount } = this.state;
        let pl = '入动态口令';
        if (hasAccount && !lockIsRequired) {
            pl = '此帐号无需输入口令';
        }
        const fieldsConfig = {
            account: {
                inputProps: {
                    onBlur: onCheckAccount ? this.accountChecker : () => {},
                    prefix: <IconPrefix type={'user'} />,
                    suffix: onCheckAccount && accountChecking && <IconPrefix type={'loading'} spin />,
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
                inputProps: {
                    prefix: <IconPrefix type={'safety'} />,
                    size: 'large',
                    autoComplete: 'off',
                    type: 'tel',
                    disabled: pl === '此帐号无需输入口令',
                    placeholder: pl
                },
                fieldOption: {
                    rules: [
                        {
                            required: lockIsRequired,
                            message: '请输入动态口令'
                        },
                        {
                            pattern: /^\d{6}$/,
                            message: '请输入6位数字验证码'
                        }
                    ]
                }
            }
        };
        return (
            <div className={classNames(styles['login-page'], 'unselect')}>
                <h1 className={styles['page-title']}>React Seed</h1>
                <div className={styles['middle-box']}>
                    <section className={styles['form-wrapper']} ref={this.props.forwardedRef}>
                        <span className={styles.illustration} />
                        <LoginForm
                            ref={this.userLoginForm}
                            className={styles['login-form']}
                            styles={styles}
                            config={{ ...fieldsConfig }}
                            onSubmit={onSubmit}
                            onBindAuth={onBindAuth}
                            authBind={authBind}
                            fetchBindData={fetchBindData}
                        />
                    </section>
                </div>
            </div>
        );
    }
}
export default React.forwardRef((props, ref) => <UserLogin {...props} forwardedRef={ref} />);
