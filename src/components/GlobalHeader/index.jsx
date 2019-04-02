import { ThemeContext } from '@context/theme';
function ThemeTogglerButton() {
    return (
        <ThemeContext.Consumer>
            {({ toggleTheme, onToggleAside }) => (
                <>
                    <button onClick={toggleTheme}>Toggle Theme</button>
                    <button onClick={onToggleAside}>Toggle Menu</button>
                </>
            )}
        </ThemeContext.Consumer>
    );
}

export default ThemeTogglerButton;
