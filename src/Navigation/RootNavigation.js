

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

const RootNavigation = () => {
  const { usersDoc, userInfo } = useAuthContext();

  const RootStack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown :false }}>
        {userInfo ?
          usersDoc?.isConfirm ?
            usersDoc?.isUpdated ?
              // <AppNavigation />
              <RootStack.Screen name="AppNavigation" component={AppNavigation} />
              :
              // <SettingsNavigation />
              <>
              <RootStack.Screen name="SettingNav" component={SettingsNavigation} />
              <RootStack.Screen name="AppNavigation" component={AppNavigation} />
              </>

            :
            <RootStack.Screen name="Permition" component={PermitionPage} />
          :
          // <AuthNavigation />
          <RootStack.Screen name="AuthNavigation" component={AuthNavigation} />

        }
      </RootStack.Navigator>

    </NavigationContainer>
  )
}

export default RootNavigation