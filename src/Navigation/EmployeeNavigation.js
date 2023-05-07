import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Employee from "../Screens/AppScreens/Employee";
import ProfilePage from "../Screens/AppScreens/ProfilePage";
import { useTheme } from "../theme/ThemeProvider";

const EmployeeNavigation = () => {
  const {colors} = useTheme();
  const EmployeeSt = createNativeStackNavigator();
  return (
    <EmployeeSt.Navigator 
    
    >
      <EmployeeSt.Screen
        options={{ headerShown: false, }}
        initialParams="EmpScreen"
        name="EmpScreen"
        component={Employee}
      />
      <EmployeeSt.Screen
        options={{
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: colors.header,
          },
        }}
        name="empDatails"
        component={ProfilePage}
      />
    </EmployeeSt.Navigator>
  );
};

export default EmployeeNavigation;
