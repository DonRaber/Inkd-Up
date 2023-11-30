import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext)
}

export const ThemeProvider = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState('teal');

    const toggleBackgroundColor = () => {
        setBackgroundColor((prevColor) => (prevColor === 'teal' ? 'orange' : 'teal'));
    }

    return (
        <ThemeContext.Provider value={{ backgroundColor, toggleBackgroundColor }}>
            {children}
        </ThemeContext.Provider>
    )
}