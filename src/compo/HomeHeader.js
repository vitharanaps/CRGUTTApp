import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useNotificationContext } from "../context/NotificationContext";
import { useStnContext } from "../context/StnContext";

const HomeHeader = () => {
  const height = Dimensions.get("window").height;
  const { colors } = useTheme();
  const { usersDoc, userInfo } = useAuthContext();
  const navigation = useNavigation();
  const { numOfNewNotifications } = useNotificationContext();
  const { countFavorite } = useStnContext();

  return (
    <View
      style={[
        styles.container,
        height <= 665
          ? { paddingTop: 5, paddingBottom: 5 }
          : { paddingTop: 45 },
      ]}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            letterSpacing: 0.4,
            color: "#fff",
            marginBottom: 5,
          }}
        >
          CRGU TT App
        </Text>
        <Text style={{ fontSize: 16, color: "lightgray" }}>
          Welcome {usersDoc?.nameWithIn}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("favorite")}>
          <Ionicons
            name="heart"
            size={30}
            color="#fff"
            style={{ marginRight: 10, position: "relative" }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("notification")}>
          <Ionicons
            name="notifications"
            size={30}
            color="#fff"
            style={{ marginRight: 10, position: "relative" }}
          />
        </TouchableOpacity>

        <Image
          source={
            usersDoc?.profileImage
              ? { uri: usersDoc?.profileImage }
              : require("../../assets/avatar.png")
          }
          style={{ height: 40, width: 40, borderRadius: 50 }}
        />
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            position: "absolute",
            top: -5,
            right: 45,
          }}
        >
          <Text style={{ color: "#fff" }}>{numOfNewNotifications}</Text>
        </View>
        <View
          style={{
            width: 20,
            height: 20,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            position: "absolute",
            top: -5,
            right: 80,
          }}
        >
          <Text style={{ color: "#fff" }}>{countFavorite}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    // marginTop:45,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default HomeHeader;
