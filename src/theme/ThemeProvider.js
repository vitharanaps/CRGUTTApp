import { Form } from "formik";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
const ThemeContext = createContext({
  dark: false,
  colors: lightColors,
  setScheme: () => {},
});

const ThemeContextProvider = ({ children }) => {
 // const colorScheme = useColorScheme();
 // const colorScheme = "dark"



  const [colorScheme, setColorScheme] = useState("light" || AsyncStorage.getItem("valueOfDark"))

  const setColorSchemeToAsync = async () => {
    await AsyncStorage.setItem("valueOfDark", colorScheme);
   const getColorFromAsync = await AsyncStorage.getItem("valueOfDark");
   console.log("xxx", getColorFromAsync);
  };
  setColorSchemeToAsync();

  const [isDark, setIsDark] = useState(colorScheme == "dark");
 // const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(colorScheme == "dark");
  }, [colorScheme]);

  const defaultTheme = {
    dark: isDark,
    colors: isDark ? darkColors : lightColors,
    setScheme: (scheme) => setIsDark(scheme === "dark"),
  };

  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContextProvider;
export const useTheme = () => useContext(ThemeContext);
