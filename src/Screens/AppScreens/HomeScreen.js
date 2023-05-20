import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  useColorScheme,
} from "react-native";
import HomeHeader from "../../compo/HomeHeader";
import { FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import HomePageStn from "../../compo/HomePageStn";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeProvider";
import { StatusBar } from "expo-status-bar";
import { useAuthContext } from "../../context/AuthContext";

const HomeScreen = () => {
  const scrHeight = Dimensions.get("window").height;

  const [newStns, setNewStns] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  //get new 5Stn

  const {dark,colors} = useTheme();
const { loading } =useAuthContext()

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setNewStns(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  
  return (
    <View style={[styles.container, dark ? {backgroundColor: colors.primary} : {backgroundColor : "#5171ff"}]}>
      <View style={styles.header}>
        <HomeHeader />
      </View>
      <View style={[styles.footer,{backgroundColor : colors.primary } ]}>
        <Animatable.View
          animation="bounceIn"
          style={{
            backgroundColor: colors.secondary,
            padding: 15,
            borderRadius: 10,
            ...styles.shadow,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#748c94",
            }}
          >
            Search STNs
          </Text>
          <View>
            <TextInput
              placeholder="Enter Train Number"
              onChangeText={(text) => setSearch(text)}
              style={{
                width: "100%",
                backgroundColor: "#f3f6f4",
                height: 40,
                fontSize: 18,
                borderRadius: 10,
                padding: 10,
                marginVertical: 15,
                color: "gray",
              }}
            />
            <TouchableOpacity
              disabled={search === "" ? true : false}
              onPress={() =>
                navigation.navigate("viewAll", { searchText: search })
              }
              style={[
                styles.findStnButton,
                search === ""
                  ? { backgroundColor: "gray" }
                  : { backgroundColor: "#5171ff" },
              ]}
            >
              <FontAwesome
                name="search"
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "600",
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "600",
                  marginRight: 10,
                }}
              >
                Find STN
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <View
          style={{
            backgroundColor: colors.secondary,
            padding: 15,
            borderRadius: 10,
            height: scrHeight * 0.6,
            marginVertical: 18,
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
              }}
            >
              Special Notifications
            </Text>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("viewAll",{ searchText: "" } )}
              style={{}}
            >
              <Text style={{ textDecorationLine: "underline" }}>View All</Text>
            </TouchableOpacity> */}
          </View>
          {/* <ScrollView showsVerticalScrollIndicator={false} > */}

          <View
            style={[
              {
                alignItems: "center",
                justifyContent: "center",
                marginVertical: 5,
              },
              scrHeight <= 665 ? { paddingBottom: 120 } : {paddingBottom :70},
            ]}
          >
            {/* Flat List Component */}

            <FlatList
              data={newStns}
              renderItem={({ item }) => <HomePageStn stn={item} />}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={{ width: "99%", height: "95%" }}
            />
          </View>
          {/* </ScrollView> */}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: "#5171ff",
    opacity: 60,
  },
  header: {
    flex: 2,
  },
  footer: {
    flex: 11,
  //  backgroundColor: "#f3f6f4",
  // backgroundColor : colors.primary,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
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
  findStnButton: {
     backgroundColor: "#5171ff",
    width: "100%",
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
export default HomeScreen;
