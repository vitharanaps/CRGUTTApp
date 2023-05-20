import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../Screens/AppScreens/HomeScreen';
import ViewAllStn from '../Screens/AppScreens/ViewAllStn';
import ViewStnDetails from '../Screens/AppScreens/ViewStnDetails';
import Notifications from '../Screens/AppScreens/Notifications';
import { useTheme } from '../theme/ThemeProvider';

const HomeNavigation = () => {
const {colors} = useTheme();
    const HomeNav = createNativeStackNavigator();
  return (
    <HomeNav.Navigator>
        <HomeNav.Screen 
        name="homeSc"
        
         component={HomeScreen}
         options={{
            headerShown:false,
            title : "home",
         }}
         />
        <HomeNav.Screen 
        name="viewAll"
         component={ViewAllStn}
         options={{
            title:"All STNs",
            headerTintColor:"#fff",
            headerTitleStyle:{
                fontSize:18
            },
            headerStyle:{
                backgroundColor:colors.header,
            },
            
         }}
         />
          <HomeNav.Screen 
        name="notification"
         component={Notifications}
         options={{
            title:"Notifications",
            headerTintColor:"#fff",
            headerTitleStyle:{
                fontSize:18
            },
            headerStyle:{
                backgroundColor:colors.header,
            },
            
         }}
         />
          <HomeNav.Screen 
        name="viewStnDetails"
         component={ViewStnDetails}
         options={{
//title:"t",
            headerTintColor:"#fff",
            //headerBackTitleVisible: false,
            headerTitleStyle:{
                fontSize:18
            },
            headerStyle:{
                backgroundColor:colors.header,
                
            },
            
         }}
         />

    </HomeNav.Navigator>
  )
}

export default HomeNavigation