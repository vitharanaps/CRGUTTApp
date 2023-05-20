

import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import AppNavigation from './AppNavigation'
import AuthNavigation from './AuthNavigation'
import { auth } from '../firebase'
import { ActivityIndicator, View } from 'react-native'
import PermitionPage from '../Screens/AuthScreen/PermitionPage'
import SettingsNavigation from './SettingsNavigation'
import EditUser from '../Screens/AppScreens/EditUser'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar';

const RootNavigation = () => {
  const { usersDoc, userInfo } = useAuthContext();

  const RootStack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown :false }}>
        {userInfo ?
          usersDoc?.isConfirm ?
            usersDoc?.isUpdated ?
              <RootStack.Screen name="AppNavigation" component={AppNavigation} />
              :
              <>
              <RootStack.Screen name="SettingNav" component={SettingsNavigation} />
              <RootStack.Screen name="AppNavigation" component={AppNavigation} />
              </>

            :
            <RootStack.Screen name="Permition" component={PermitionPage} />
          :
          <RootStack.Screen name="AuthNavigation" component={AuthNavigation} />
        }
      </RootStack.Navigator>
      <StatusBar style="light" />

    </NavigationContainer>
    
  )
}

export default RootNavigation