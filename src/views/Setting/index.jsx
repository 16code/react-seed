import Box from 'components/Box';
import Image from 'components/Image';

import autoMode from 'assets/auto-mode.png';
import lightMode from 'assets/light-mode.png';
import darkMode from 'assets/dark-mode.png';
import s from './styles.less';

const themes = [
    { src: lightMode, name: '浅色', key: 'light' },
    { src: darkMode, name: '深色', key: 'dark' },
    { src: autoMode, name: '自动', key: 'auto' }
];
@hot
export default class SettingPage extends React.PureComponent {
    handleChange = event => {
        document.documentElement.setAttribute('theme', event.target.value);
    }
    render() {
        return (
            <Box title="风格设置" >
                <div className={s.themes}>
                    {themes.map(item => (
                        <label key={item.key}>
                            <input type="radio" name="theme" value={item.key} onChange={this.handleChange} />
                            <div className={s.img}><Image size="117x80" src={item.src} /></div>
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </Box>
        );
    }
}
