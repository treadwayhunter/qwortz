import { Switch } from "react-native";
import { useThemeContext } from "./contexts/ThemeContext";

export default function ThemeSwitch() {
    const { theme, setTheme } = useThemeContext();
    
    // if light, then true, if dark then false

    function handleToggle() {
        if (theme === 'light') setTheme('dark');
        else setTheme('light');
    }

    return (
        <Switch
            trackColor={{false: '#094387', true: '#3a3a3a'}}
            ios_backgroundColor={theme === 'light' ? '#094387' : '#3a3a3a'}
            onValueChange={handleToggle}
            value={theme === 'light' ? false : true}
        />
    );
}