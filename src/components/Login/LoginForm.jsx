import { Button, Form, Input, Checkbox } from 'antd';
const FormItem = Form.Item;

@Form.create()
export default class LoginForm extends React.PureComponent {
    static defaultPoprs = {
        config: {}
    };
    handleSubmit = async (event, behavior) => {
        event && event.preventDefault();
        const behaviorIsLogin = behavior === 'SUBMIT';
        const values = await this.validateFields(behavior).catch(() => {});
        if (values) {
            const { onSubmit, onBindAuth } = this.props;
            if (behaviorIsLogin) {
                onSubmit && onSubmit(values);
            } else {
                onBindAuth && onBindAuth(values);
            }
        }
    };
    validateFields = type => {
        return new Promise((resolve, reject) => {
            this.props.form.validateFields((err, values) => {
                const { account, password } = values;
                if (!err && type === 'SUBMIT') {
                    resolve(values);
                    return;
                }
                if (account && password && type === 'AUTH_BIND') {
                    resolve(values);
                } else {
                    reject(err);
                }
            });
        });
    };
    get renderFormItems() {
        const {
            config,
            form: { getFieldDecorator }
        } = this.props;
        const list = Object.keys(config);
        return list.map(key => {
            const { fieldOption = {}, inputProps = {} } = config[key];
            return <FormItem key={key}>{getFieldDecorator(key, fieldOption)(<Input {...inputProps} />)}</FormItem>;
        });
    }
    render() {
        const { authBind, className, fetchBindData, form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form className={className} onSubmit={event => this.handleSubmit(event, 'SUBMIT')} autoComplete="off">
                {this.renderFormItems}
                <FormItem style={{ marginBottom: 0 }}>
                    <div className="clearfix">
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true
                        })(<Checkbox>记住用户名</Checkbox>)}
                        {authBind && (
                            <a
                                href="javacript:;"
                                style={{ float: 'right' }}
                                disabled={fetchBindData}
                                onClick={event => this.handleSubmit(event, 'AUTH_BIND')}
                            >
                                绑定Google二次认证
                            </a>
                        )}
                    </div>
                    <Button
                        htmlType="submit"
                        type="primary"
                        style={{ height: '46px', lineHeight: '46px' }}
                        size="large"
                        block
                    >
                        用户登陆
                    </Button>
                </FormItem>
            </Form>
        );
    }
}
