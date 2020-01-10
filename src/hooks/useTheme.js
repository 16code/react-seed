import autoMode from 'assets/auto-mode.png';
import lightMode from 'assets/light-mode.png';
import darkMode from 'assets/dark-mode.png';

const themes = [
    { src: lightMode, name: '浅色', key: 'light' },
    { src: darkMode, name: '深色', key: 'dark' },
    { src: autoMode, name: '自动', key: 'auto' }
];
const savedTheme = localStorage.getItem('theme') || 'auto';

function changeTheme(value) {
    document.documentElement.setAttribute('theme', value); 
    window.localStorage.setItem('theme', value);
}

export const ThemeContext = React.createContext({ themes, theme: savedTheme, changeTheme });
