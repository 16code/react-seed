import { ThemeContext } from '@context/theme';
function ThemeTogglerButton() {
    return (
        <ThemeContext.Consumer>
            {({ theme, toggleTheme, onToggleAside }) => (
                <>
                    <button onClick={toggleTheme} style={{ color: theme.background }}>
                        Toggle Theme
                    </button>
                    <button onClick={onToggleAside}>Toggle Menu</button>
                </>
            )}
        </ThemeContext.Consumer>
    );
}

export default ThemeTogglerButton;
