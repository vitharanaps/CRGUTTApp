import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from '../Screens/AuthScreen/SplashScreen'
import SignInScreen from '../Screens/AuthScreen/SignInScreen'
import SignUpScreen from '../Screens/AuthScreen/SignUpScreen'
import Test1 from '../Screens/AuthScreen/Test1';
import PermitionPage from  "../Screens/AuthScreen/PermitionPage"
const AuthStack = createNativeStackNavigator();
const AuthNavigation = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown : false }}>
            <AuthStack.Screen name="splashScreen" component={SplashScreen} /> 
             <AuthStack.Screen name="signInScreen" component={SignInScreen} />
            <AuthStack.Screen name="signUpScreen" component={SignUpScreen} />
            <AuthStack.Screen name="permition" component={PermitionPage} />
            
       </AuthStack.Navigator> 
    )
}

export default AuthNavigation