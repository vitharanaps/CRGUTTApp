import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignalImage from "../Screens/AppScreens/SignalImage";
import SignalsScreen from "../Screens/AppScreens/SignalsScreen";
import SettingsScreen from "../Screens/AppScreens/SettingsScreen";
import EditUser from "../Screens/AppScreens/EditUser";
import { useAuthContext } from "../context/AuthContext";
import ProfilePage from "../Screens/AppScreens/ProfilePage";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import ReportErrors from "../Screens/AppScreens/ReportErrors";

const SettingsNavigation = () => {
  const { colors } = useTheme();
  const { usersDoc } = useAuthContext();
  const SettingSt = createNativeStackNavigator();
  const route = useRoute();

  return (
    <SettingSt.Navigator screenOptions={{}}>
      {usersDoc?.isUpdated ? (
        <>
          <SettingSt.Screen
            options={{ headerShown: false }}
            name="SettingsScreen"
            component={SettingsScreen}
          />
          <SettingSt.Screen
            options={{
              title: "Edit Profile",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontSize: 20,
              },
              headerStyle: {
                backgroundColor: colors.header,
              },
            }}
            name="editeUser"
            component={EditUser}
          />
          <SettingSt.Screen
            options={{
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontSize: 20,
              },
              headerStyle: {
                backgroundColor: colors.header,
              },
            }}
            name="ProfileScreen"
            component={ProfilePage}
          />
          <SettingSt.Screen
            options={{
              headerTintColor: "#fff",
              headerTitle: "Report Error",
              headerTitleStyle: {
                fontSize: 20,
              },
              headerStyle: {
                backgroundColor: colors.header,
              },
            }}
            name="reportError"
            component={ReportErrors}
          />
        </>
      ) : (
        <SettingSt.Screen
          options={{ headerShown: false }}
          name="editeUser"
          component={EditUser}
        />
      )}
    </SettingSt.Navigator>
  );
};

export default SettingsNavigation;
