import { View, Text, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useStnContext } from "../context/StnContext";

const AllStn = ({ stn }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { userInfo } = useAuthContext();
  const {onLikePress} = useStnContext();
  const [onLikeClick, setOnLikeClick] = useState(false);
  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp.toDate();
    //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  dayjs.extend(relativeTime);
  
const handlePressLikeStn = async(item)=>{
 await onLikePress(item);

}

const getLikeStatus = (like) => {
  let status = false;
  like?.map((item) => {
    if (item === userInfo?.uid) {
      status = true;
    } else {
      status = false;
    }
  });
  return status;
};
 
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("viewStnDetails", {
          stnId: stn.id,
          trainNo: stn.trainNo,
        })
      }
      style={{
        height: 130,
        // width: "100%",
        borderRadius: 10,
        borderColor: "gray",
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        marginVertical: 3,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1.5,
          padding: 5,
        }}
      >
        <Image
          source={{
            uri: stn?.stnImage,
          }}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <View style={{ flex: 3, margin: 5 }}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            marginVertical: 5,
          }}
        >
          <Text
            style={[
              { fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
              { color: colors.text1 },
            ]}
          >
            Train No {stn?.trainNo.slice(0, 20)}
          </Text>
        </View>
        <Text
          numberOfLines={3}
          style={{
            justifyContent: "center",
            paddingVertical: 3,
            color: "#999999",
          }}
        >
          Train Number {stn?.trainNo} changed, please Consider this stn, STN No{" "}
          {stn?.stnNo}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "darkgray", marginVertical: 3 }}>
            {convertDate(stn?.timeStamp)} ago
          </Text>
          <TouchableOpacity onPress={() => handlePressLikeStn(stn)}>
            {getLikeStatus(stn?.like) ? (
              <Ionicons
                name="heart"
                size={30}
                color="red"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Ionicons
                name="heart"
                size={30}
                color="gray"
                style={{ marginRight: 10 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AllStn;
