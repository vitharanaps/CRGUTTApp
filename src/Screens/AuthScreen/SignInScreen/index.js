import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import { useAuthContext } from "../../../context/AuthContext";
import {
  signInWithEmailAndPassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as SecureStore from "expo-secure-store";

const SignInScreen = () => {
  const DEVICE_ID_KEY = "deviceId";

  const navigation = useNavigation();

  const { setUserInfo } = useAuthContext();

  const signUpSuccess = false;
  const [viewLoginError, setviewLoginError] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [getUserDetailsForSignin, setGetUserDetailsForSignin] = useState({});

  const [data, setData] = useState({
    Email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
  });

  const textInputChange = (val) => {
    setData({
      ...data,
      Email: val,
      check_textInputChange: true,
      isValidUser: true,
    });
    setviewLoginError(false);
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
      isValidPassword: true,
    });

    setviewLoginError(false);
  };

  const getUserDetails = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  const updateDeviceId = async (userId) => {
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    const updateDeviceIdRef = doc(db, "users", userId);

    await updateDoc(updateDeviceIdRef, {
      uniqueDeviceId: deviceId,
    });
  };

  const handleLogin = async (email, password) => {
    setSignInLoading(true);
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    console.log("d id", deviceId);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          const getUserDetailsForUniqueDeviceId = await getUserDetails(
            user.uid
          );
         

          if (getUserDetailsForUniqueDeviceId?.uniqueDeviceId) {
            if (getUserDetailsForUniqueDeviceId?.uniqueDeviceId == deviceId) {
              setUserInfo(user);
              AsyncStorage.setItem("userInfo", JSON.stringify(user));
            } else {
              alert("You can't Access this account using this Device");
            }
          } else {
            await updateDeviceId(user.uid);
            setUserInfo(user);
            AsyncStorage.setItem("userInfo", JSON.stringify(user));
          }
        } else {
          alert("Please verify Your Email Address");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginError(true);
      });
    setSignInLoading(false);
  };

  const viewSecureText = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  return (
    <View style={styles.conatiner}>
      {/* <ImageBackground 
                source={require("../../../../assets/bgimage.jpg") } 
                style={{flex: 1 }}> */}
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Sign In </Text>
        </View>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <ScrollView showsVerticalScrollIndicator={false}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <Text style={styles.text_footer}> Email</Text>
              <View style={styles.action}>
                <FontAwesome name="user-o" color="#05375a" size={20} />
                <TextInput
                  placeholder="Enter Your Email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(val)}
                />
              </View>

              {data.isValidUser ? null : (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}> </Text>
                </Animatable.View>
              )}

              <Text style={[styles.text_footer, { marginTop: 35 }]}>
                {" "}
                Password
              </Text>
              <View style={styles.action}>
                <FontAwesome name="lock" color="#05375a" size={20} />
                <TextInput
                  placeholder="Enter Your Password"
                  style={styles.textInput}
                  autoCapitalize="none"
                  secureTextEntry={data.secureTextEntry}
                  onChangeText={(val) => handlePasswordChange(val)}
                />

                <Feather
                  name={data.secureTextEntry ? "eye" : "eye-off"}
                  color="gray"
                  size={20}
                  onPress={(val) => viewSecureText(val)}
                />
              </View>

              <View style={styles.button}>
                {loginError && (
                  <Text style={[styles.errorMsg, { paddingBottom: 10 }]}>
                    Wrong Email Or Password{" "}
                  </Text>
                )}
                {signInLoading ? (
                  <View>
                    <ActivityIndicator size="large" color="gray" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleLogin(data.Email, data.password)}
                    style={[styles.signIn, { backgroundColor: "#5171ff" }]}
                  >
                    <Text style={[styles.textSign, { color: "#fff" }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                )}
                {signUpSuccess ? null : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("signUpScreen")}
                    style={[
                      styles.signIn,
                      {
                        borderColor: "#5171ff",
                        borderWidth: 1,
                        marginTop: 15,
                      },
                    ]}
                  >
                    <Text style={[styles.textSign, { color: "#5171ff" }]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </Animatable.View>

        {/* </ImageBackground> */}
      </View>
    </View>
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
    paddingBottom: 100,
  },
  footer: {
    flex: 2,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 30,
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
    marginBottom: 10,
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
export default SignInScreen;
