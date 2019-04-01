export const themes = {
    light: {
        background: 'red'
    },
    dark: {
        background: 'yellow'
    },
    siderVisible: false
};

export const ThemeContext = React.createContext({ theme: themes.dark, siderVisible: themes.siderVisible });
