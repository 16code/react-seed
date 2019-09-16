import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

export default function AppProvider({ children }) {
    return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
}

AppProvider.displayName = 'AppProvider';
