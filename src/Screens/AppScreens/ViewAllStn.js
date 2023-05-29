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
import { useStnContext } from "../../context/StnContext";
const ViewAllStn = () => {

  const scrHeight = Dimensions.get("screen").height;
  const {colors} = useTheme();
  const { search,setSearch,loading,filteredData} = useStnContext();

  // const route = useRoute();
  // setSearchText(route?.params?.searchText);

  return (
    <View style={[styles.container, {backgroundColor :colors.primary}]}>
      <View style={[styles.searchContainer,{backgroundColor :colors.secondary} , { ...styles.shadow }]}>
        <TextInput
          placeholder="Enter Train Number"
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
