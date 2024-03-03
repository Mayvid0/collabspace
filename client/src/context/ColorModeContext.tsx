import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the shape of the context
interface ColorModeContextType {
  isDarkMode: boolean;
  toggleColorMode: () => void;
}

// Create the context
export const ColorModeContext = createContext<ColorModeContextType>({
  isDarkMode: false,
  toggleColorMode: () => {},
});

// Create a custom hook to access the context
export const useColorMode = () => useContext(ColorModeContext);

// Create the ColorModeProvider component
export const ColorModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleColorMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ColorModeContext.Provider value={{ isDarkMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
