import { Button, Form, Input, Checkbox, Icon } from 'antd';
import styles from './styles.less';

const FormItem = Form.Item;

@Form.create()
export default class Login extends React.PureComponent {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className={styles.login}>
                <div className={styles['middle-box']}>
                    <h1 className={styles['page-title']}>React Seed</h1>
                    <div className={styles['form-wrapper']}>
                        <div className={styles.illustration} />
                        <Form className={styles['login-form']} onSubmit={this.handleSubmit} autoComplete="off">
                            <div className={styles['form-item']}>
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your username!'
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            size="large"
                                            placeholder="Username"
                                            autoComplete="off"
                                        />
                                    )}
                                </FormItem>
                            </div>
                            <div className={styles['form-item']}>
                                <FormItem>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your Password!'
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            size="large"
                                            type="password"
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                    )}
                                </FormItem>
                            </div>
                            <FormItem>
                                {getFieldDecorator('code', {
                                    rules: [
                                        {
                                            message: '请输入动态口令, 首次登陆请先绑定二次认证!'
                                        },
                                        {
                                            len: 6,
                                            message: '请输入6位数字验证码'
                                        }
                                    ]
                                })(
                                    <Input
                                        size="large"
                                        placeholder="请输入口令"
                                        prefix={<Icon type="safety" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    />
                                )}
                            </FormItem>
                            <FormItem className={styles['ant-form-item-last']}>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true
                                })(<Checkbox className={styles.remember}>记住用户名</Checkbox>)}
                                <a href="#" className={styles['auth-bind']}>
                                    绑定Google二次认证
                                </a>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    className={styles['submit-button']}
                                    size="large"
                                    block
                                >
                                    用户登陆
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}
