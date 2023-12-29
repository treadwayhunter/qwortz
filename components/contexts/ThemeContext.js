import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, createContext, useState, useReducer, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        AsyncStorage.getItem('theme')
            .then((value) => {
                if (value) {
                    setTheme(value);
                }
                else {
                    AsyncStorage.setItem('theme', 'light');
                }
            });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('Theme context must be used within a ThemeContextProvider');
    }
    return context;
}