import { Tabs, Icon } from 'antd';

const TabPane = Tabs.TabPane;
const qrcode = {
    apple: require('./qrcode/apple.jpg'),
    android: require('./qrcode/android.jpg')
};

export default function AppDownload(props) {
    const [activeKey, setActiveKey] = React.useState('apple');
    const platform = activeKey === 'apple' ? '苹果' : '安卓';
    return (
        <div {...props}>
            <Tabs defaultActiveKey={activeKey} size="large" onChange={setActiveKey}>
                <TabPane tab={<Icon type="apple" />} key="apple" />
                <TabPane tab={<Icon type="android" />} key="android" />
            </Tabs>
            <div className="qrcode">
                <img draggable="false" src={qrcode[activeKey]} />
            </div>
            <span>使用{platform}手机扫描二维码下载应用</span>
        </div>
    );
}
