import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { TouchableOpacity } from "react-native";

const UserList = ({ empData }) => {

  const navigation = useNavigation();
  const {colors} = useTheme();
  return (
    <TouchableOpacity
      style={[styles.container,{backgroundColor :colors.secondary}]}
      onPress={() =>
        navigation.navigate("empDatails", {
          uid: empData?.id,
          userName: empData?.nameWithIn,
        })
      }
    >
      <View style={styles.imageContainer}>
        {empData?.profileImage ? (
          <Image
            source={{ uri: empData?.profileImage }}
            style={{ height: 60, width: 60, borderRadius: 50 }}
          />
        ) : (
          <Image
            source={require("../../assets/avatar.png")}
            style={{ height: 60, width: 60, borderRadius: 50 }}
          />
        )}
      </View>
      <View style={styles.Description}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 18,
            fontWeight: "600",
            letterSpacing: 0.5,
            marginVertical: 5,
            color:colors.text1
          }}
        >
          {empData?.nameWithIn}
        </Text>

        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginRight: 10,
          }}
        >
          <Text style={{ color: colors.text2, fontSize: 16,  }}>
            {empData?.ocupation}
          </Text>
          <Text style={{ color: "gray", fontSize: 16 }}>
            {empData?.homeStation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    marginVertical: 2,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  Description: {
    flex: 3,
    paddingVertical: 5,
  },
});
export default UserList;
