import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import { Ionicons, FontAwesome, Entypo, EvilIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Formik } from "formik";

const ReportErrors = () => {
  const [selectedValue, setSelectedValue] = useState(
    ""
    // usersDoc?.homeStation || ""
  );

  const { colors } = useTheme();
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
        }}
      >
        <Text
          style={[styles.text_footer, { marginTop: 35, color: colors.text1 }]}
        >
          Select Error Type
        </Text>
        <View style={styles.action}>
          <Entypo name="home" color={colors.text2} size={20} />

          <Picker
            style={[styles.textInput, { color: colors.text2 }]}
            selectedValue={selectedValue}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item
              color={colors.text1}
              label="Select Error Type"
              value=""
            />
            {/* {data.map((hs) => (
                        <Picker.Item
                        color={colors.text1}
                          label={hs.hStationName}
                          key={hs.id}
                          value={hs.hStationName}
                        />
                      ))} */}
            <Picker.Item
              color={colors.text1}
              label="SystemError"
              value="SystemError"
            />
            <Picker.Item
              color={colors.text1}
              label="STN Error"
              value="STN Error"
            />
            <Picker.Item color={colors.text1} label="Other" value="Other" />
          </Picker>
          <Text style={[styles.text_footer, { color: colors.text1 }]}>
            Error Description
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text2} size={20} />
            <TextInput
              placeholder="Enter Error Description"
              style={[styles.textInput, { color: colors.text2 }]}
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={handleChange("errorDesc")}
              onBlur={handleBlur("errorDesc")}
              value={values.errorDesc}
            />
          </View>
          {errors.idNo && touched.idNo ? (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>{errors.idNo}</Text>
            </Animatable.View>
          ) : null}
        </View>
      </View>
    </View>
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
});
export default ReportErrors;
