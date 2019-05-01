import { Button, Form, Input, Checkbox } from 'antd';
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
                    <h1 className={styles.title}>React Seed</h1>
                    <Form className={styles.form} onSubmit={this.handleSubmit} autoComplete="off">
                        <div className={styles['form-item']}>
                            <FormItem>
                                {getFieldDecorator('username', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your username!'
                                        }
                                    ]
                                })(<Input size="large" placeholder="Username" />)}
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
                                })(<Input size="large" type="password" placeholder="Password" />)}
                            </FormItem>
                        </div>

                        <FormItem>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(<Checkbox className={styles.remember}>Remember me</Checkbox>)}
                            <Button htmlType="submit" type="primary" className={styles.submit} block>
                                Login
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}
