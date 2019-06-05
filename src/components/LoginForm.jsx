import { Button, Input, Checkbox, Form } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

@Form.create()
export default class LoginForm extends React.PureComponent {
    static propTypes = {
        showAuthBind: PropTypes.bool,
        loading: PropTypes.bool,
        disableAuthBind: PropTypes.bool,
        disableSubmit: PropTypes.bool,
        config: PropTypes.object,
        onSubmit: PropTypes.func,
        onAuthBind: PropTypes.func,
        userNameField: PropTypes.string.isRequired,
        passwordField: PropTypes.string.isRequired
    };
    static defaultProps = {
        config: {},
        loading: false,
        showAuthBind: false,
        disableAuthBind: false
    };
    componentWillReceiveProps(prevProps) {
        const { config: prevConfig } = prevProps;
        const { config } = this.props;
        if (prevConfig.verifycode.disabled !== config.verifycode.disabled) {
            if (config.verifycode.disabled) {
                this.setFieldError('verifycode');
            } else {
                this.setFieldError('verifycode', undefined, 'resetError');
            }
        }
    }
    get formItemsRender() {
        const {
            config,
            form: { getFieldDecorator }
        } = this.props;
        const list = Object.keys(config);
        return list.map(key => {
            const { fieldOption = {}, inputProps = {}, disabled } = config[key];
            return (
                <FormItem key={key}>
                    {getFieldDecorator(key, fieldOption)(<Input disabled={disabled} {...inputProps} />)}
                </FormItem>
            );
        });
    }
    get formExtraRender() {
        const { form, loading, disableAuthBind, showAuthBind, disableSubmit } = this.props;
        const { getFieldDecorator } = form;
        return (
            <>
                <FormItem style={{ marginBottom: 0 }}>
                    <div className="clearfix">
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true
                        })(<Checkbox>记住用户名</Checkbox>)}
                        {showAuthBind && (
                            <a
                                href="javacript:;"
                                disabled={disableAuthBind}
                                style={{ float: 'right' }}
                                onClick={this.handleAuthBind}
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
                        loading={loading}
                        disabled={disableSubmit}
                        block
                    >
                        用户登陆
                    </Button>
                </FormItem>
            </>
        );
    }
    setFieldError = (key, value, resetError) => {
        const { config, form } = this.props;
        const rule = config[key].fieldOption.rules || [{ message: '不能为空' }];
        form.setFields({
            [key]: {
                value: value,
                errors: resetError ? null : [new Error(rule[0].message)]
            }
        });
    };
    handleAuthBind = event => {
        event.preventDefault();
        const { form, onAuthBind, userNameField, passwordField } = this.props;
        const userName = form.getFieldValue(userNameField);
        const password = form.getFieldValue(passwordField);
        const errorUserName = !userName || userName === '';
        const errorPassword = !password || password === '';
        if (errorUserName) {
            this.setFieldError(userNameField, userName);
        }
        if (errorPassword) {
            this.setFieldError(passwordField, password);
        }
        if (!errorUserName && !errorPassword) {
            onAuthBind && onAuthBind({ [userNameField]: userName, [passwordField]: password });
        }
    };
    handleSubmit = event => {
        event.preventDefault();
        const { form, onSubmit } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                onSubmit && onSubmit(values);
            }
        });
    };
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                {this.formItemsRender}
                {this.formExtraRender}
            </Form>
        );
    }
}
