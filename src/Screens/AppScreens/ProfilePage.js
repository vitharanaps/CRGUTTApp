import { View, Text, Dimensions, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import SettingsHeader from "../../compo/SettingsHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuthContext } from "../../context/AuthContext";
import {
  Ionicons,
  FontAwesome5,
  FontAwesome,
  AntDesign,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { ActivityIndicator } from "react-native-paper";
import call from "react-native-phone-call";
import { useTheme } from "../../theme/ThemeProvider";

const ProfilePage = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const height = Dimensions.get("screen").height;
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const userId = route?.params?.uid;
  const userName = route?.params?.userName;

  //get user details by uid

  useEffect(() => {
    setLoading(true);

    if (userId) {
      async function fetchData() {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      fetchData();
      setLoading(false);
    }
  }, [userId]);

  //Profile Header Text
  const s = userName;
  const splitArray = s.split(" ");
  useEffect(() => {
    navigation.setOptions({ title: splitArray[splitArray.length - 1] });
  }, [userName]);

  if (loading) {
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color="gray" />
    </View>;
  }

  const triggerCall = (number) => {
    const args = {
      number: number,
      prompt: true,
      skipCanOpen: true,
    };
    call(args).catch(console.error);
  };

  return (
    <View
      style={{ flex: 1, paddingBottom: 120, backgroundColor: colors.primary }}
    >
      {/* <View style={{
                height: height * 18 / 100,
                backgroundColor: "#5171ff",
                alignItems: "center",
                paddingHorizontal: 20,
            }} >
                <View style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent:"space-between",

                    flex: 1,
                    width: "100%",
                }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#fff",
                            borderRadius: 50,
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                        <AntDesign name="arrowleft" size={25} style={{ fontWeight: "bold" }} color="black" />
                    </TouchableOpacity>
                    <Text style={{ 
                        color:"#fff",
                        fontSize: 18,
                        fontWeight:"700"
                     }}>Vitharana's Profile</Text>
                    <Image source={{ uri: "https://images.unsplash.com/photo-1591258739299-5b65d5cbb235?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG1hbiUyMGZhY2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" }}
                        style={{ height: 70, width: 70, borderRadius: 50 }}
                    />
                </View>
            </View> */}

      <ScrollView>
        {/* User Information */}

        <View>
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: 15,
              borderRadius: 10,
              marginVertical: 18,
              marginHorizontal: 15,
              ...styles.shadow,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#748c94",
                  paddingBottom: 5,
                }}
              >
                Personal Details
              </Text>
            </View>
            {/* data */}
            <View
              style={{
                borderColor: "gray",
                borderWidth: StyleSheet.hairlineWidth,
                padding: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                }}
              >
                <Image
                  source={
                    userDetails?.profileImage ? (
                      { uri: userDetails?.profileImage }
                    ) : loading ? (
                      <View>
                        <ActivityIndicator color="gray" size="large" />
                      </View>
                    ) : (
                      require("../../../assets/avatar.png")
                    )
                  }
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <FontAwesome
                  name="user-o"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.nameWithIn}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <Entypo
                  name="email"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.email}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <EvilIcons
                  name="envelope"
                  color="#05375a"
                  size={25}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.address}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <AntDesign
                  name="idcard"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.idNo}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                  alignItems:"center"
                }}
              >
                <Entypo
                  name="mobile"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.mobileNo1}
                </Text>
                <TouchableOpacity
                  style={{ marginLeft: 50,
                    padding:8,
                    backgroundColor: "lightgray",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center", }}
                  onPress={() => triggerCall(userDetails?.mobileNo1)}
                >
                  <Entypo
                    name="phone"
                    color="#31c42a"
                    size={22}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  alignItems:"center",
                  justifyContent: "flex-start",
                }}
              >
                <Entypo
                  name="mobile"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.mobileNo2}
                </Text>
                <TouchableOpacity
                  style={{
                    marginLeft: 50,
                    padding:8,
                    backgroundColor: "lightgray",
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => triggerCall(userDetails?.mobileNo2)}
                >
                  <Entypo
                    name="phone"
                    color="#31c42a"
                    size={22}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        {/* Professional Details */}

        <View>
          <View
            style={{
              backgroundColor: colors.secondary,
              padding: 15,
              borderRadius: 10,
              marginVertical: 18,
              marginHorizontal: 15,
              ...styles.shadow,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#748c94",
                  paddingBottom: 5,
                }}
              >
                Professional Details
              </Text>
            </View>
            {/* data */}
            <View
              style={{
                borderColor: "gray",
                borderWidth: StyleSheet.hairlineWidth,
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <AntDesign
                  name="home"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.homeStation}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 5,
                  padding: 10,
                  justifyContent: "flex-start",
                }}
              >
                <FontAwesome5
                  name="running"
                  color="#05375a"
                  size={22}
                  style={{ paddingRight: 15, width: 40 }}
                />
                <Text style={{ fontSize: 15, color: colors.text2 }}>
                  {userDetails?.ocupation}
                </Text>
              </View>
            </View>
            {/* Professional Details */}
          </View>
        </View>
        <View></View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5Df0",
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  },
});
export default ProfilePage;
