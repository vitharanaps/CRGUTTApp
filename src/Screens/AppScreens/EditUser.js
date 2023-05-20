import {
  View,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { Ionicons, FontAwesome, Entypo, EvilIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Formik } from "formik";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../../theme/ThemeProvider";

const editeUserSchema = yup.object().shape({
  name: yup.string().required("Name With Initial Must be Required"),
  idNo: yup.number().required("ID Number Must be Required"),
  mobileNo1: yup.number().required("ID Number Must be Reauired"),
  address: yup.string().required("Address Must be Required"),
});

const EditUser = () => {
  const navigation = useNavigation();
  const { userInfo, isUpdated, usersDoc } = useAuthContext();
  const [selectedValue, setSelectedValue] = useState(
    usersDoc?.homeStation || ""
  );
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [data, setData] = useState([]);

  const { colors } = useTheme();

  //update isUpdated

  const editUserDetails = async (values) => {
    setEditUserLoading(true);
    const { idNo, name, mobileNo1, mobileNo2, address } = values;

    try {
      if (selectedValue === "") {
        alert("Please Select Home Station");
        setEditUserLoading(false);
        return;
      }
      await updateDoc(doc(db, "users", userInfo?.uid), {
        idNo: idNo,
        nameWithIn: name.trim(),
        mobileNo1: mobileNo1,
        mobileNo2: mobileNo2,
        address: address,
        homeStation: selectedValue,
      });
      //confirm
      await isUpdated();
      navigation.navigate("AppNavigation");
      alert("Success");
    } catch (err) {
      console.log(err);
    }
    setEditUserLoading(false);
  };

  //fetch Home Station for select
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "homeStation"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Formik
      initialValues={{
        idNo: usersDoc?.idNo || null,
        name: usersDoc?.nameWithIn || null,
        mobileNo1: usersDoc?.mobileNo1 || null,
        mobileNo2: usersDoc?.mobileNo2 || null,
        address: usersDoc?.address || null,
      }}
      validateOnMount={true}
      onSubmit={(values) => editUserDetails(values)}
      validationSchema={editeUserSchema}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
      }) => (
        <View
          style={[
            { flex: 1, backgroundColor: colors.primary },
            usersDoc?.isUpdated
              ? { marginTop: 0, paddingBottom: 120 }
              : { marginTop: 50, paddingBottom: 50 },
          ]}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            {/* <View style={{ alignItems:"center", marginTop:20 }}>
          <Image source={require("../../../assets/Avatar.webp")} 
          style={{width:150, height :150, borderRadius:"100%"}}  />
      </View> */}
            <ScrollView>
              <View
                style={{
                  marginTop: 15,
                  backgroundColor: colors.primary,
                  marginHorizontal: 15,
                }}
              >
                <View>
                  <Text style={[styles.text_footer, { color: colors.text1 }]}>
                    ID Number
                  </Text>
                  <View style={styles.action}>
                    <FontAwesome name="user-o" color={colors.text2} size={20} />
                    <TextInput
                      placeholder="Enter Your ID Number"
                      editable={false}
                      style={[styles.textInput, { color: colors.text2 }]}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      onChangeText={handleChange("idNo")}
                      onBlur={handleBlur("idNo")}
                      value={values.idNo}
                    />
                  </View>
                  {errors.idNo && touched.idNo ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.idNo}</Text>
                    </Animatable.View>
                  ) : null}

                  <Text
                    style={[
                      styles.text_footer,
                      { marginTop: 35, color: colors.text1 },
                    ]}
                  >
                    {" "}
                    Name With Initial
                  </Text>
                  <View style={styles.action}>
                    <Ionicons name="person" color={colors.text2} size={20} />
                    <TextInput
                      placeholder="X X Gamage"
                      style={[styles.textInput, { color: colors.text2 }]}
                      autoCapitalize="none"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />
                  </View>
                  {errors.name && touched.name ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.name}</Text>
                    </Animatable.View>
                  ) : null}

                  <Text
                    style={[
                      styles.text_footer,
                      { marginTop: 35, color: colors.text1 },
                    ]}
                  >
                    {" "}
                    Mobile No1
                  </Text>
                  <View style={styles.action}>
                    <Entypo name="mobile" color={colors.text2} size={20} />
                    <TextInput
                      placeholder="Enter Your Mobile Number 1"
                      style={[styles.textInput, { color: colors.text2 }]}
                      keyboardType="numeric"
                      onChangeText={handleChange("mobileNo1")}
                      onBlur={handleBlur("mobileNo1")}
                      value={values.mobileNo1}
                    />
                  </View>
                  {errors.mobileNo1 && touched.mobileNo1 ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.mobileNo1}</Text>
                    </Animatable.View>
                  ) : null}

                  <Text  style={[
                      styles.text_footer,
                      { marginTop: 35, color: colors.text1 },
                    ]}>
                    {" "}
                    Mobile No 2
                  </Text>
                  <View style={styles.action}>
                    <Entypo name="mobile" color={colors.text2} size={20} />
                    <TextInput
                      placeholder="Enter Your Mobile Number 2"
                      style={[styles.textInput, { color: colors.text2 }]}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      onChangeText={handleChange("mobileNo2")}
                      onBlur={handleBlur("mobileNo2")}
                      value={values.mobileNo2}
                      //secureTextEntry={data.secureTextEntry}
                    />
                  </View>

                  <Text  style={[
                      styles.text_footer,
                      { marginTop: 35, color: colors.text1 },
                    ]}>
                    {" "}
                    Address
                  </Text>
                  <View style={styles.action}>
                    <EvilIcons name="envelope" color={colors.text2} size={25} />
                    <TextInput
                      placeholder="Enter Your Address"
                      style={[styles.textInput, { color: colors.text2 }]}
                      autoCapitalize="none"
                      onChangeText={handleChange("address")}
                      onBlur={handleBlur("address")}
                      value={values.address}
                    />
                  </View>
                  {errors.address && touched.address ? (
                    <Animatable.View animation="fadeInLeft" duration={500}>
                      <Text style={styles.errorMsg}>{errors.address}</Text>
                    </Animatable.View>
                  ) : null}
                  <Text  style={[
                      styles.text_footer,
                      { marginTop: 35, color: colors.text1 },
                    ]}>
                    Home Station
                  </Text>
                  <View style={styles.action}>
                    <Entypo name="home" color={colors.text2} size={20} />

                    <Picker
                      style={[styles.textInput, { color: colors.secondary }]}                      selectedValue={selectedValue}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedValue(itemValue)
                      }
                    >
                      <Picker.Item color={colors.secondary} label="Select Your Home Station" value="" />
                      {data.map((hs) => (
                        <Picker.Item
                        color={colors.text2}
                          label={hs.hStationName}
                          key={hs.id}
                          value={hs.hStationName}
                        />
                      ))}
                    </Picker>
                  </View>
                

                  <View style={styles.button}>
                    {editUserLoading ? (
                      <View>
                        <ActivityIndicator size="large" color="gray" />
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={{ width: "100%" }}
                        onPress={handleSubmit}
                      >
                        <View
                          style={[
                            styles.signIn,
                            { backgroundColor: "#5171ff" },
                          ]}
                        >
                          <Text style={[styles.textSign, { color: "#fff" }]}>
                            Submit
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* <Pressable style={{ width: 100, height: 50, backgroundColor: "red" }} onPress={editUserDetails}>
                            <Text>Test</Text>
                        </Pressable> */}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    paddingTop: 50,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 20,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
  //  color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditUser;
