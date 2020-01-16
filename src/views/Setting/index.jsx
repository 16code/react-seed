import { ThemeContext } from 'hooks/useTheme';
import Box from 'components/Box';
import Image from 'components/Image';
import Switche from 'components/Switche';

import s from './styles.less';

@hot
export default class SettingPage extends React.PureComponent {
    static contextType = ThemeContext;
    constructor() {
        super();
        this.state = {
            notify: false
        };
    }
    componentDidMount() {
        // const permissions = {
        //     granted: '已同意',
        //     denied: '已拒绝',
        //     default: '未询问'
        // };
        const permission = Notification.permission;
        // console.log(`permission === ${permissions[permission]}`);
        if (permission === 'granted') {
            console.log('用户已同意浏览器通知');
            this.setState({ notify: true });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(result => {
                console.log(result);
            });
        }
        Notification.requestPermission().then(result => {
            console.log(result);
        });
    }
    render() {
        const { themes, theme, changeTheme } = this.context;             
        return (
            <>
                <Box title="设置">
                    <ul className={s.list}>
                        <li>
                            <div className={s.meta}>
                                <h4 className={s.title}>主题外观</h4>
                                <span className={s.description}>设置界面主题外观色彩</span>
                            </div>
                            <div className={s.action}>
                                {themes.map(item => (
                                    <label key={item.key} title={item.name}>
                                        <input
                                            type="radio"
                                            name="theme"
                                            checked={item.key === theme}
                                            value={item.key}
                                            onChange={() => {
                                                changeTheme(item.key);
                                            }}
                                        />
                                        <div className={s.img}><Image size="77x52" src={item.src} /></div>
                                    </label>
                                ))}
                            </div>
                        </li>
                        <li>
                            <div className={s.meta}>
                                <h4 className={s.title}>允许通知</h4>
                                <span className={s.description}>
                                    当播放失败时允许通知,  当前{this.state.notify ? '已' : '未'}取得浏览器通知权限.
                                </span>
                            </div>
                            <div className={s.action}>
                                <Switche
                                    name="notfiy"
                                    checked={this.state.notify}
                                    onChange={v => {
                                        this.setState({ notify: v });
                                    }}
                                />
                            </div>
                        </li>
                    </ul>
                </Box>
            </>
        );
    }
}
