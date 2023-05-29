import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthContext } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeProvider";
import { ActivityIndicator } from "react-native-paper";
import AllStn from "../../compo/AllStn";
import { useStnContext } from "../../context/StnContext";

const Favorite = () => {
  const [loading, setLoading] = useState(false);
  const [newStn, setNewStn] = useState([]);
  const { userInfo } = useAuthContext();
  const {colors} = useTheme();
  const scrHeight = Dimensions.get("screen").height;
  const {onLikeClicked ,countFavorite, setCountFavorite}= useStnContext();

  //get favorite stn

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        setLoading(true);

        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          doc.data().like.map((item) => {
            if (item === userInfo.uid) {
              list.push({ id: doc.id, ...doc.data() });
            }
          });
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

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        setLoading(true);

        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          doc.data().like.map((item) => {
            if (item === userInfo.uid) {
              list.push({ id: doc.id, ...doc.data() });
            }
          });
        });
        setNewStn(list);
        setLoading(false);

        // setFilteredData(list)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [onLikeClicked]);

  
  return (
    <View style={[styles.container, {backgroundColor :colors.primary}]}>
      <View style={[styles.searchResults, {backgroundColor : colors.secondary}, { height: scrHeight -220 }]}>
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
          ) : null}
        </Text>
        {newStn.length === 0 ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <Text style={{ color: "red", fontSize: 16, fontWeight: "600" }}>
              STN Not Found
            </Text>
          </View>
        ) : (
          <FlatList
            data={newStn}
            renderItem={({ item }) => <AllStn stn={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
  </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchContainer: {
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
export default Favorite;
