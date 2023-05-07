import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignalsScreen from '../Screens/AppScreens/SignalsScreen';
import ViewSignalDetails from '../Screens/AppScreens/ViewSignalDetails';
import { useTheme } from '../theme/ThemeProvider';

const SignalNavigation = () => {
    const SignalSt= createNativeStackNavigator();
    const {colors} = useTheme();

  return (
<SignalSt.Navigator>
<SignalSt.Screen 
options={{
  headerStyle: {
    backgroundColor: colors.signalPageBack,
  },
  headerTitle: "Signals",
 headerTitleAlign: "center",
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontSize: 20,
  },}}
name="signalHome" component={SignalsScreen} />
    <SignalSt.Screen
                                options={{
                                  title: "Signal Details",
                                  headerTintColor: "#fff",
                                  headerTitleStyle: {
                                      fontSize: 20
                                  },
                                  headerStyle: {
                                      backgroundColor: colors.header,
  
                                  }
  
                              }}
    name="signalDetails" component={ViewSignalDetails} 
    
    
    />
</SignalSt.Navigator>
  )
}

export default SignalNavigation