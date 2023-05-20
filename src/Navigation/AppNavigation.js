import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/AppScreens/HomeScreen';
import SignalsScreen from '../Screens/AppScreens/SignalsScreen';
import SettingsScreen from '../Screens/AppScreens/SettingsScreen';
import { Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Employee from '../Screens/AppScreens/Employee';
import SettingsNavigation from './SettingsNavigation';
import EmployeeNavigation from './EmployeeNavigation';
import HomeNavigation from './HomeNavigation';
import SignalNavigation from './SignalNavigation';
import { useTheme } from '../theme/ThemeProvider';

const AppNavigation = () => {
  const Tab = createBottomTabNavigator();
  const {dark,colors} = useTheme();

  return (
    <Tab.Navigator

      screenOptions={{
        title: "",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: colors.primary,
          bottom: 25,
          left: 15,
          right: 15,
          elevation: 0,
          borderRadius: 15,
          height: 90,
          ...styles.shadow
        },
      }}>
      <Tab.Screen
        name='Home'
        component={HomeNavigation}
        options={{
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: "center", top: 20 }} >
              <Entypo name="home" color={focused ? "#5171ff" : '#748c94'} size={25} style={{ marginBottom: 5 }} />
              <Text style={{ color: focused ? "#5171ff" : '#748c94', fontSize: 12 }} >HOME</Text>
            </View>
          )
        }}
      />
      <Tab.Screen name='Signals' component={SignalNavigation}

        options={{
        headerShown:false,

          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: "center", top: 20 }} >
              <FontAwesome5 name="traffic-light" color={focused ? "#5171ff" : '#748c94'} size={25} style={{ marginBottom: 5 }} />
              <Text style={{ color: focused ? "#5171ff" : '#748c94', fontSize: 12 }} >SIGNALS</Text>
            </View>
          )
        }}

      />
      <Tab.Screen name='EmployeeBot' component={EmployeeNavigation}
        options={{
          headerShown:false,
          headerStyle: {
            backgroundColor: "#5171ff",
            
          },
          headerTitle: "Guard",
          
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
            letterSpacing:0.8

          },

          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: "center", top: 20 }} >
              <FontAwesome5 name="user-alt" color={focused ? "#5171ff" : '#748c94'} size={25} style={{ marginBottom: 5 }} />
              <Text style={{ color: focused ? "#5171ff" : '#748c94', fontSize: 12 }} >EMPLOYEE</Text>
            </View>
          )
        }}


      />
      <Tab.Screen name='Settings' component={SettingsNavigation}
        

        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: "center", top: 20 }} >
              <Ionicons name="settings" color={focused ? "#5171ff" : '#748c94'} size={25} style={{ marginBottom: 5 }} />
              <Text style={{ color: focused ? "#5171ff" : '#748c94', fontSize: 12 }} >SETTINGS</Text>
            </View>
          )
        }}


      />
    </Tab.Navigator>
  )
}



const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5Df0',
    shadowOffset: {
      height: 10,
      width: 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})

export default AppNavigation