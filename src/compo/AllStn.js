import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";

const AllStn = ({ stn }) => {
  const navigation = useNavigation();

  const {colors} = useTheme();

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp.toDate();
    //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  dayjs.extend(relativeTime);

  return (
    <TouchableOpacity
        onPress={()=>navigation.navigate("viewStnDetails", {stnId : stn.id , trainNo :stn.trainNo})}
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
          <Text style={[{ fontSize: 17, fontWeight: "600", letterSpacing: 0.5 }, {color : colors.text1}]}>
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
        <Text
          style={{ marginLeft: "auto", color: "darkgray", marginVertical: 3 }}
        >
          {convertDate(stn?.timeStamp)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AllStn;
