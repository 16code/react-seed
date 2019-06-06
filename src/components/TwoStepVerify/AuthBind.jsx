import { Tooltip, Form } from 'antd';
import SecurityCodeInput from '@components/SecurityCodeInput';
const FormItem = Form.Item;

export default class AuthBind extends React.PureComponent {
    render() {
        const { userData = {}, form } = this.props;
        const { qrcode, secretKey } = userData;
        return (
            <div className="auth-bind">
                <div className="auth-qrcode">
                    <img draggable="false" src={qrcode} />
                </div>
                <span className="secret-key" style={{ margin: '.06rem 0 .15rem', fontSize: '.16rem' }}>
                    <span>本次绑定密钥: </span>
                    <Tooltip title="如果扫码失败，也可手动输入绑定">
                        <span className="text-primary">{secretKey}</span>
                    </Tooltip>
                </span>
                <Form autoComplete="off">
                    <FormItem>
                        {form.getFieldDecorator('securityCode', {
                            rules: [{ required: true, pattern: /^\d{6}$/, message: '请输入6位数字验证码' }]
                        })(<SecurityCodeInput len={6} />)}
                    </FormItem>
                </Form>
            </div>
        );
    }
}
