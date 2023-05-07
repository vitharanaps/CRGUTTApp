import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useAuthContext } from '../../../context/AuthContext'
import { ActivityIndicator } from 'react-native-paper'

const PermitionPage = () => {
  const navigation = useNavigation();
  const { userInfo, logout, loading } = useAuthContext();


  const handleExit = ()=>{
    if(userInfo){
      logout()
    }else{
      navigation.navigate("splashScreen")
    }
  }
  if(loading){
    return(
      <View style={{ flex: 1, alignItems:"center", justifyContent:"center" }}>
        <ActivityIndicator color="gray" size="large" />
      </View>
    )
  }

  return (
    <View style={{
      flex: 1,
      alignItems: "center",
      backgroundColor: "#fff",
      justifyContent: "center",
      width: "100%"
    }}>
      <View style={{ marginBottom: 50 }}>
        <Image source={require("../../../../assets/stop.png")}
          style={{
            borderRadius: 50
          }}
        />
      </View>
      <Text style={{
        fontSize: 18,
        color: "red",
        fontWeight: "600"
      }}>
        You Haven't Access This Account Yet,

      </Text>
      <Text>
        Contact us For More Details
      </Text>
          
           <TouchableOpacity
            onPress={handleExit}
            style={{ backgroundColor: "red", width: 300, height: 50, borderRadius: 10, alignItems: "center", justifyContent: "center", marginVertical: 30 }} >
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                fontWeight: "600"
              }}
            >Exit</Text>
          </TouchableOpacity> 

    </View>
  )
}

export default PermitionPage