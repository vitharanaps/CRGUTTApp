import { View, Text, TouchableOpacity, Touchable } from "react-native";
import React, { useState } from "react";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Button, Switch } from "react-native-paper";
import { useTheme } from "../theme/ThemeProvider";

const SettingsMenu = () => {
  const navigation = useNavigation();
  const { logout } = useAuthContext();
  const { dark, colors, setScheme } = useTheme();
  // const [dark, setDark] = useState(false)

  const Handlelogout = () => {
    logout();
  };
  const { usersDoc, userInfo } = useAuthContext();

  const toggleMode = () => {
    dark ? setScheme("light") : setScheme("dark");
  };

  return (
    <View style={{ marginHorizontal: 15 }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProfileScreen", {
            uid: userInfo?.uid,
            userName: usersDoc?.nameWithIn,
          })
        }
        style={{
          backgroundColor: colors.secondary,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name="user" size={25} color="gray" />
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontWeight: "600",
              color: "gray",
            }}
          >
            View Your Profile
          </Text>
        </View>
        <View>
          <MaterialIcons name="keyboard-arrow-right" color="gray" size={35} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("editeUser")}
        style={{
          backgroundColor: colors.secondary,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name="pencil" size={25} color="gray" />
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontWeight: "600",
              color: "gray",
            }}
          >
            Edit Profile
          </Text>
        </View>
        <View>
          <MaterialIcons name="keyboard-arrow-right" color="gray" size={35} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>navigation.navigate("reportError")}
        style={{
          backgroundColor: colors.secondary,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name="mail" size={25} color="gray" />
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontWeight: "600",
              color: "gray",
            }}
          >
            Report Errors
          </Text>
        </View>
        <View>
          <MaterialIcons name="keyboard-arrow-right" color="gray" size={35} />
        </View>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: colors.secondary,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="moon" size={25} color="gray" />
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontWeight: "600",
              color: "gray",
            }}
          >
            Dark Mode
          </Text>
        </View>
        <View>
          <Switch value={dark} onValueChange={toggleMode} />
        </View>
      </View>

      <TouchableOpacity
        onPress={Handlelogout}
        style={{
          backgroundColor: colors.secondary,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginVertical: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Entypo name="log-out" size={25} color="red" />
          <Text
            style={{
              fontSize: 17,
              marginLeft: 10,
              fontWeight: "600",
              color: "red",
            }}
          >
            Logout
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsMenu;
