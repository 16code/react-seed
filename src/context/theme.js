export const themes = {
    light: 'light',
    dark: 'dark',
    siderVisible: false
};

export const ThemeContext = React.createContext({ theme: themes.dark, siderVisible: themes.siderVisible });
