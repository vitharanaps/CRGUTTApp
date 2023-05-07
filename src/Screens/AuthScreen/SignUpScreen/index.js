import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Button,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { Picker } from "@react-native-picker/picker";
import Feather from "@expo/vector-icons/Feather";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as yup from "yup";
import { db, auth } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please Enter Valid Email")
    .required("Email Address is Required"),
  name: yup.string().required("Name With Initial Must be Required"),
  idNo: yup.string().required("NIC Number Must be Required"),
  mobNum :yup.string().required("Mobile Number Must be Required"),
  password: yup
    .string()
    .required("Password is Required")
    .min(6, ({ min }) => `password must be at least ${min}`),
});

const SignUpScreen = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const navigation = useNavigation();

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const onRegister = async (values) => {
    setSignUpLoading(true);
    const { email, name, password, idNo, mobNum } = values;

    const qId = query(collection(db, "users"), where("idNo", "==", idNo));
    const querySnapshotId = await getDocs(qId);
    const countId = querySnapshotId.size;
    const qName = query(
      collection(db, "users"),
      where("nameWithIn", "==", name)
    );
    const querySnapshotName = await getDocs(qName);
    const countName = querySnapshotName.size;
    const qEmail = query(collection(db, "users"), where("email", "==", email));
    const querySnapshotEmail = await getDocs(qEmail);
    const countEmail = querySnapshotEmail.size;

    if (countId === 0 && countName === 0 && countEmail === 0) {
      try {
        //Get Id numbers from Db
        const res = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
          { displayName: name }
        );

        const res1 = await setDoc(doc(db, "users", res.user.uid), {
          email: email,
          nameWithIn: name,
          idNo: idNo,
          role: "user",
          mobileNo1: mobNum ,
          isDelete: false,
          isConfirm: false,
          ocupation: "GUARD",
          isUpdated: false,
          timeStamp: serverTimestamp(),
        });
        navigation.navigate("permition");

      } catch (err) {
        console.log(err);
      }
    } else {
      alert("User Details Exists, You Have an Account Please Sign in");
    }
    setSignUpLoading(false);
  };

  return (
    <Formik
      initialValues={{ email: "", name: "", mobNum : "", password: "" }}
      validateOnMount={true}
      onSubmit={(values) => onRegister(values)}
      validationSchema={SignUpSchema}
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
        <View style={styles.conatiner}>
          <View style={{ flex: 1 }}>
            <StatusBar backgroundColor="#009387" barStyle="dark-content" />
            <View style={styles.header}>
              <Text style={styles.text_header}>Register Now !</Text>
            </View>
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ paddingBottom: 50 }}>
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                      <FontAwesome name="user-o" color="#05375a" size={20} />
                      <TextInput
                        placeholder="user@gmail.com"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                      />

                      {/* <Animatable.View
                                                        animation="bounceIn"
                                                    >
                                                        <Feather
                                                            name="check-circle"
                                                            color="green"
                                                            size={20}

                                                        />

                                                    </Animatable.View> */}
                    </View>
                    {errors.email && touched.email ? (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{errors.email} </Text>
                      </Animatable.View>
                    ) : null}

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>
                      {" "}
                      Name With Initial
                    </Text>
                    <View style={styles.action}>
                      <Ionicons name="person" color="#05375a" size={20} />
                      <TextInput
                        placeholder="APC KAMAL"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                      />

                      {/* <Animatable.View
                                                        animation="bounceIn"
                                                    >
                                                        <Feather
                                                            name="check-circle"
                                                            color="green"
                                                            size={20}

                                                        />

                                                    </Animatable.View> */}
                    </View>
                    {errors.name && touched.name ? (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{errors.name} </Text>
                      </Animatable.View>
                    ) : null}

                    <Text style={(styles.text_footer, { marginTop: 35 })}>
                      ID Number
                    </Text>
                    <View style={styles.action}>
                      <AntDesign name="idcard" color="#05375a" size={20} />
                      <TextInput
                        placeholder="Enter Your ID Number"
                        style={styles.textInput}
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
                    

                    <Text style={(styles.text_footer, { marginTop: 35 })}>
                      Mobile Number
                    </Text>
                    <View style={styles.action}>
                      <AntDesign name="mobile1" color="#05375a" size={20} />
                      <TextInput
                        placeholder="Enter Your Mobile Number"
                        style={styles.textInput}
                        autoCapitalize="none"
                        keyboardType="numeric"
                        onChangeText={handleChange("mobNum")}
                        onBlur={handleBlur("mobNum")}
                        value={values.mobNum}
                      />
                    </View>
                    {errors.mobNum && touched.mobNum ? (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{errors.mobNum}</Text>
                      </Animatable.View>
                    ) : null}
                    

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>
                      Password
                    </Text>
                    <View style={styles.action}>
                      <FontAwesome name="lock" color="#05375a" size={20} />
                      <TextInput
                        placeholder="XXXXXXXX"
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={secureTextEntry}
                      />

                      <Feather
                        name={secureTextEntry ? "eye" : "eye-off"}
                        color="gray"
                        size={20}
                        onPress={() => updateSecureTextEntry()}
                      />
                    </View>
                    {errors.password && touched.password ? (
                      <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{errors.password} </Text>
                      </Animatable.View>
                    ) : null}

                    <View style={styles.button}>
                      {signUpLoading ? (
                        <View>
                          <ActivityIndicator size="large" color="gray" />
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={handleSubmit}
                          style={{ width: "100%" }}
                        >
                          <View
                            style={[
                              styles.signIn,
                              { backgroundColor: "#5171ff" },
                            ]}
                          >
                            <Text style={[styles.textSign, { color: "#fff" }]}>
                              Sign Up
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        style={[
                          styles.signIn,
                          {
                            borderColor: "#5171ff",
                            borderWidth: 1,
                            marginTop: 15,
                          },
                        ]}
                        onPress={() => navigation.navigate("signInScreen")}
                      >
                        <Text style={[styles.textSign, { color: "#5171ff" }]}>
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </Animatable.View>
            {/* </ImageBackground> */}
          </View>
        </View>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    backgroundColor: "#5171ff",
  },

  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 0,
  },
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
    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
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
export default SignUpScreen;
