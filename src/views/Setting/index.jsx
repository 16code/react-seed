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
        const permissions = {
            granted: '已同意',
            denied: '已拒绝',
            default: '未询问'
        };
        const permission = Notification.permission;
        console.log(`permission === ${permissions[permission]}`);
        if (permission === 'granted') {
            console.log('用户已同意浏览器通知');
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
                <Box title="风格设置" >
                    <div className={s.themes}>
                        {themes.map(item => (
                            <label key={item.key}>
                                <input
                                    type="radio"
                                    name="theme"
                                    checked={item.key === theme}
                                    value={item.key}
                                    onChange={() => {
                                        changeTheme(item.key);
                                    }}
                                />
                                <div className={s.img}><Image size="148x100" src={item.src} /></div>
                                <span>{item.name}</span>
                            </label>
                        ))}
                    </div>
                </Box>
                <Box>
                    <ul>
                        <li>
                            <span>允许通知</span>
                            <Switche
                                name="notfiy"
                                checked={this.state.notify}
                                onChange={v => {
                                    this.setState({ notify: v });
                                }}
                            />
                        </li>
                    </ul>
                </Box>
            </>
        );
    }
}
