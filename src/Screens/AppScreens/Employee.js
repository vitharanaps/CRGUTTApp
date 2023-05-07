import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import UserList from "../../compo/UserList";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useTheme } from "../../theme/ThemeProvider";

const Employee = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
const {colors} = useTheme();
  ///get data from database

  useEffect(() => {
    const fetchData = async () => {
      let list = [];

      try {
        const optionsRef = collection(db, "users");
        const q = query(optionsRef, where("isConfirm", "==", true));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });

          //    console.log(doc.id, " => ", doc.data());
        });
        setEmployers(list);
      } catch (err) {
        //    console.log(err);
      }
    };
    fetchData();
  }, [search]);


  const changeSearchText = (e) => {
    setSearch(e);
  };

  return (
  <View style={[styles.container, {backgroundColor :colors.primary}]}>
      <View
        style={{
          backgroundColor: colors.secondary,
          padding: 15,
          borderRadius: 10,
          marginVertical: 5,
          paddingTop: 50,
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
          Search Guard
        </Text>
        <View>
          <TextInput
            placeholder="XX Ranasinghe"
            onChangeText={changeSearchText}
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
      </View>
      <View style={{ marginBottom: 480 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            color: "#748c94",
            marginLeft: 15,
          }}
        >
          {/* Search results ({}) */}
        </Text>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          {employers.filter((emp) => {
              return search?.toLowerCase() === ""
                ? emp
                : emp?.nameWithIn.toLowerCase().includes(search?.toLowerCase())
              }).map((emp) => (
              <UserList empData={emp} key={emp?.id} />
            )
            )}
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {},
});
export default Employee;
