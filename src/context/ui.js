import { isMobileDevice } from '@helper';

const s = window.localStorage.getItem('ASIDE_COLLAPSED');
export const themes = {
    light: 'light',
    dark: 'dark',
    collapsed: !isMobileDevice && s === 'true'
};
function onToggleAside(state) {
    window.localStorage.setItem('ASIDE_COLLAPSED', JSON.stringify(state));
}
export const UiContext = React.createContext({ theme: themes.dark, collapsed: themes.collapsed, onToggleAside });
