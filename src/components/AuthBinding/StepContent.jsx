import { Tabs, Icon, Tooltip, Form, Input } from 'antd';
import VerifyCodeInput from '@components/VerifyCodeInput';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
export const StepOne = props => (
    <div {...props}>
        <Tabs defaultActiveKey="ios" size="large">
            <TabPane tab={<Icon type="apple" />} key="ios">
                <img draggable="false" src={require('./images/ios.jpg')} />
            </TabPane>
            <TabPane tab={<Icon type="android" />} key="android">
                <img draggable="false" src={require('./images/android.jpg')} />
            </TabPane>
        </Tabs>
        <span className="text-center">手机扫描二维码下载Google动态口令应用</span>
    </div>
);
export const StepThree = props => (
    <div {...props}>
        <Icon type="check-circle" theme="filled" />
        <h2>动态口令设置成功</h2>
        <span className="text-center">以后登录都需要输入Google动态口令哦，手机千万不要丢失！</span>
    </div>
);

@Form.create()
export class StepTwo extends React.PureComponent {
    render() {
        const { data, form, className } = this.props;
        const { secretKey, qrcode, account, password } = data || {};
        return (
            <section className={className}>
                <div className="auth-qrcode">
                    <img draggable="false" src={qrcode} />
                </div>
                <Form autoComplete="off">
                    <span className="secret-key text-center">
                        <span>本次绑定密钥: </span>
                        <Tooltip
                            overlayStyle={{ minWidth: 460 }}
                            title="如果扫码绑定失败，也可在Authenticator中手动输入密钥获取动态口令"
                        >
                            <span className="text-primary">{secretKey}</span>
                        </Tooltip>
                    </span>
                    <FormItem className="hidden">
                        {form.getFieldDecorator('account', {
                            initialValue: account,
                            rules: [{ required: true }]
                        })(<Input autoComplete="off" hidden />)}
                    </FormItem>
                    <FormItem className="hidden">
                        {form.getFieldDecorator('password', {
                            initialValue: password,
                            rules: [{ required: true }]
                        })(<Input autoComplete="off" hidden />)}
                    </FormItem>
                    <FormItem>
                        {form.getFieldDecorator('code', {
                            rules: [{ required: true, pattern: /^\d{6}$/, message: '请输入6位数字验证码' }]
                        })(<VerifyCodeInput codeType="number" len={6} />)}
                    </FormItem>
                </Form>
            </section>
        );
    }
}
