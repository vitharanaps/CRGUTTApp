import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RootNavigation from "./src/Navigation/RootNavigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";

//for bottomshet working properly
import "react-native-gesture-handler";
import LineModelContextProvider from "./src/context/LineModelContext";
import AuthContextProvider from "./src/context/AuthContext";
import ThemeContextProvider from "./src/theme/ThemeProvider";


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContextProvider>
        <LineModelContextProvider>
          <ThemeContextProvider>
          <RootNavigation />
          </ThemeContextProvider>
        </LineModelContextProvider>
      </AuthContextProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
