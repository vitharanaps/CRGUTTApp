import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import AllStn from "../../compo/AllStn";
import { useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "../../theme/ThemeProvider";
const ViewAllStn = () => {

  const scrHeight = Dimensions.get("screen").height;
  const {colors} = useTheme();

  // console.log(scrWidth)
  //get new 5Stn
  const [allStn, setNewStn] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const route = useRoute();
  const searchText = route?.params?.searchText;
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState(searchText || "");


  
  useEffect(() => {
    const fetchData = async () => {

      let list = [];
      try {
        setLoading(true);

        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          console.log(doc.data);
          list.push({ id: doc.id, ...doc.data() });
        });
        setNewStn(list);
        setLoading(false);

        // setFilteredData(list)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  //Filter Stn

  useEffect(() => {
    if (!searchText) {
      return;
    }
    const filterSearch = () => {
      setLoading(true);

      setFilteredData(
        search === ""
          ? allStn
          : allStn?.filter((dt) =>
              dt.trainNo.toLowerCase().includes(search.toLowerCase())
            )
      );
      setLoading(false);
    };
    filterSearch();
  }, [allStn]);

  useEffect(() => {
    const filterSearch = () => {
      setLoading(true);
      setFilteredData(
        search === ""
          ? allStn
          : allStn?.filter((dt) =>
              dt.trainNo.toLowerCase().includes(search.toLowerCase())
            )
      );
      setLoading(false);
    };
    filterSearch();
  }, [search]);


  return (
    <View style={[styles.container, {backgroundColor :colors.primary}]}>
      <View style={[styles.searchContainer,{backgroundColor :colors.secondary} , { ...styles.shadow }]}>
        <TextInput
          placeholder={search}
          value={search}
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
      </View>
      <View style={[styles.searchResults, {backgroundColor : colors.secondary}, { height: scrHeight * 0.63 }]}>
        <Text
          style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            color: "gray",
            fontSize: 15,
          }}
        >

          {loading ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <ActivityIndicator size="large" color="gray" />
            </View>
          ) : filteredData.length === 0 ? null : (
            `Search Result ${filteredData.length}`
          )}
        </Text>
        {filteredData.length === 0 ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ color: "red", fontSize: 16, fontWeight: "600" }}>
              STN Not Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <AllStn stn={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    //    justifyContent:"center"
  },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
   // backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResults: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 10,
    marginVertical: 10,
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
});

export default ViewAllStn;
