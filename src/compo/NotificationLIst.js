import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthContext } from "../context/AuthContext";
import { useNotificationContext } from "../context/NotificationContext";

const NotificationList = ({ notification }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { usersDoc, userInfo } = useAuthContext();
  const { onClickNotification } = useNotificationContext();
  dayjs.extend(relativeTime);

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp.toDate();
    //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };
  //check view
  const checkView = (viewArray) => {
    let status = false;
    viewArray.map((va) => {
      if (va === userInfo?.uid) {
        status = true;
      }
    });
    return status;
  };
  const  onClickNotificationInNotificationList = (notiId,stnId,trainNo) =>{
      navigation.navigate("viewStnDetails", {stnId : stnId , trainNo :trainNo})
      onClickNotification(notiId)
  }

  return (
    <TouchableOpacity
      style={[
        styles.container1,
        {
          backgroundColor: checkView(notification?.item?.view)
            ? colors.secondary
            : "#bcbcbc",
        },
      ]}
      onPress={() =>
        onClickNotificationInNotificationList(
          notification?.item?.id,
          notification?.item?.stnId,
          notification?.item?.title
        )
      }
    >
      <View style={[styles.Description]}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              width: 200,
              fontWeight: "600",
              letterSpacing: 0.5,
              marginVertical: 5,
              color: colors.text1,
            }}
          >
            {notification?.item?.title}
          </Text>
          <Text style={{ color: "gray", fontSize: 16 }}>
            {convertDate(notification?.item?.timeStamp)}{" "}
          </Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            marginRight: 10,
          }}
        >
          <Text style={{ color: colors.text2, fontSize: 16 }}>
            {notification?.item?.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container1: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    marginVertical: 2,
  },

  Description: {
    flex: 3,
    paddingVertical: 5,
  },
});
export default NotificationList;
