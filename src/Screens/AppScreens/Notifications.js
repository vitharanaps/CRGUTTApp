import { View, Text, StyleSheet, FlatList } from 'react-native'
import React , {useState, useEffect}from 'react'
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import NotificationList from '../../compo/NotificationLIst';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';


const Notifications = () => {
  const { usersDoc, userInfo } = useAuthContext();
  const {dark,colors} = useTheme();
  const { notifications}= useNotificationContext();


  const navigation = useNavigation();

    
  return (
    <View style={[styles.container,  {backgroundColor: colors.primary} ]}>
        <FlatList 
       data={notifications}
       renderItem={(nf)=> <NotificationList notification={nf} />}  
        />
    </View>
  )
}
const styles = StyleSheet.create({
    container : {
        flex: 1,
        paddingTop:10,
        paddingHorizontal:15,
    }
});

export default Notifications