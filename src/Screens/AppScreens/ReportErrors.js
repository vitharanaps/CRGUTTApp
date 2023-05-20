import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";
import * as yup from "yup";
import * as Animatable from "react-native-animatable";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../../context/AuthContext";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

const ErrorSchema = yup.object().shape({
  errorDesc: yup.string().required("Error Description Must be Required"),
});

const ReportErrors = () => {
  const navigation = useNavigation();
  const [selectedValue, setSelectedValue] = useState("");
  const [errorTypesFromDb, setErrorTypesFromDb] = useState([]);
  const [errorLoading, setErrorLoading] = useState(false);
  const { colors } = useTheme();
  const { usersDoc, userInfo } = useAuthContext();

  const addError = async (values) => {
    setErrorLoading(true);
    const { errorDesc } = values;

    try {
      if (selectedValue === "") {
        alert("Please Select Error Types");
        setErrorLoading(false);
        return;
      }
      const docRef = await addDoc(collection(db, "ErrorReport"), {
        errorDesc: errorDesc,
        errorType: selectedValue,
        creator: usersDoc?.nameWithIn,
        creatorId: userInfo?.uid,
        timeStamp: serverTimestamp(),
      });
      navigation.navigate("SettingsScreen");
      alert("Success");
    } catch (err) {
      console.log(err);
    }
    setErrorLoading(false);
  };

  useEffect(() => {
    const fetchErrorTypesToSelectBox = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "ErrorTypes"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setErrorTypesFromDb(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchErrorTypesToSelectBox();
  }, []);

  return (
    <Formik
      initialValues={{
        errType: "",
        errorDesc: "",
      }}
      validateOnMount={true}
      onSubmit={(values) => addError(values)}
      validationSchema={ErrorSchema}
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
        <ScrollView style={{ backgroundColor: colors.primary }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 15,
              alignItems: "center",
              backgroundColor: colors.primary,
              paddingTop: 15,
            }}
          >
            <View
              style={{
                marginHorizontal: 15,
                backgroundColor: colors.secondary,
                width: "98%",
                paddingHorizontal: 5,
                borderRadius: 10,
              }}
            >
              <Text
                style={[
                  styles.text_footer,
                  { marginTop: 35, color: colors.text1 },
                ]}
              >
                Select Error Type
              </Text>
              <View style={styles.action}>
                <Picker
                  style={[styles.textInput, { color: colors.text2 }]}
                  selectedValue={selectedValue}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedValue(itemValue)
                  }
                >
                  <Picker.Item
                    style={{ color: colors.secondary }}
                    label="Select Error Type"
                    value=""
                  />
                  {errorTypesFromDb.map((errType) => (
                    <Picker.Item
                      key={errType.type}
                      color={colors.text2}
                      label={errType?.type}
                      value={errType?.type}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={[styles.text_footer, { color: colors.text1 }]}>
                Error Description
              </Text>
              <View style={styles.action}>
                <TextInput
                  numberOfLines={50}
                  placeholder="Enter Error Description"
                  multiline
                  style={[
                    styles.textInput,
                    { height: 200, color: colors.text2, fontSize: 16 },
                  ]}
                  autoCapitalize="none"
                  onChangeText={handleChange("errorDesc")}
                  onBlur={handleBlur("errorDesc")}
                  value={values.errorDesc}
                />
              </View>
              {errors.errorDesc && touched.errorDesc ? (
                <Animatable.View animation="fadeInLeft" duration={500}>
                  <Text style={styles.errorMsg}>{errors.errorDesc}</Text>
                </Animatable.View>
              ) : null}

               
                <TouchableOpacity
                  style={{ width: "100%" }}
                  disabled={errorLoading}
                  onPress={handleSubmit}
                >
                  <View style={[styles.signIn, { backgroundColor: "#5171ff" }]}>
                    <Text style={[styles.textSign, { color: "#fff" }]}>
                      Submit
                    </Text>
                  </View>
                </TouchableOpacity>
              
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};
const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    //  color: "#05375a",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    // paddingBottom: 20,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
});
export default ReportErrors;
