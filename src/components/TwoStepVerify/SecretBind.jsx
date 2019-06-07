import { Tooltip, Form, Spin } from 'antd';
import SecurityCodeInput from '@components/SecurityCodeInput';
const FormItem = Form.Item;

export default class SecretBind extends React.PureComponent {
    render() {
        const { userData = {}, form, loading } = this.props;
        const { qrcode, secretKey } = userData;

        return (
            <div className="secret-bind-wrapper">
                <div className="secret-qrcode">
                    <Spin spinning={loading} tip="数据更新中...">
                        <img draggable="false" src={qrcode} />
                    </Spin>
                </div>
                <span className="secret-key" style={{ margin: '.06rem 0 .15rem', fontSize: '.15rem' }}>
                    <span>本次绑定密钥: </span>
                    <Tooltip title="如果扫码失败，也可手动输入绑定">
                        <span
                            style={{ minWidth: 180, display: 'inline-block', textAlign: 'center' }}
                            className="text-primary"
                        >
                            {loading ? <del>{secretKey}</del> : secretKey}
                        </span>
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
