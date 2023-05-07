import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

const HomeHeader = () => {
  const height = Dimensions.get("window").height;
  const { colors } = useTheme();
  const { usersDoc } = useAuthContext();
  console.log(usersDoc);
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
        <Ionicons
          name="notifications"
          size={30}
          color="#fff"
          style={{ marginRight: 10, position: "relative" }}
        />
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
          <Text style={{ color: "#fff" }}>1</Text>
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
