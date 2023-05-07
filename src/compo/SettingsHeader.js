import {
  View,
  Text,
  Dimensions,
  Image,
  ImagePickerIOS,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { ActivityIndicator, Button } from "react-native-paper";
import { doc, updateDoc } from "firebase/firestore";
import { useTheme } from "../theme/ThemeProvider";

const SettingsHeader = () => {
  const {colors} = useTheme();

  const navigation = useNavigation();
  const height = Dimensions.get("screen").height;
  const { usersDoc, userInfo, reFetchUserDoc } = useAuthContext();
  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(null);
  const [percentage, setpercentage] = useState(null);

  useEffect(() => {
    const uploardImage = async () => {
      const blobImage = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        //xhr.timeout = 1000 * 60;
        xhr.send(null);
      });
      const metadata = {
        contentType: "image/jpeg",
      };

      const storageRef = ref(storage, "userImage/" + Date.now());

      const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setpercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPicture(downloadURL);

            const userImageUpdateRef = doc(db, "users", userInfo?.uid);
            updateDoc(userImageUpdateRef, {
              profileImage: downloadURL,
            });
          });
        }
      );
    };
    // image && uploardImage();
    if (image != null) {
      uploardImage();
      setImage(null);
    }
  }, [image]);

  useEffect(() => {
    //reFetchUserDoc
    if (picture != null) {
      reFetchUserDoc();
      setPicture(null);
    }
  }, [picture]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 1,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });


    if (!result.canceled) {
      // setImage(result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf("/") +  1));
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View
      style={{
        height: (height * 20) / 100,
        backgroundColor: colors.signalPageBack,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingtop: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => pickImage()}>
          {percentage !== null && percentage < 100 ? (
            <View>
              <ActivityIndicator color="gray" size="large" />
            </View>
          ) : (
            <Image
              source={
                usersDoc?.profileImage
                  ? picture
                    ? picture
                    : { uri: usersDoc?.profileImage }
                  : require("../../assets/avatar.png")
              }
              style={{ height: 70, width: 70, borderRadius: 50 }}
            />
          ) }
        </TouchableOpacity>

        <View style={{ marginHorizontal: 15 }}>
          <Text
            onPress={() =>
              navigation.navigate("ProfileScreen", {
                uid: userInfo?.uid,
                userName: usersDoc?.nameWithIn,
              })
            }
            numberOfLines={1}
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "600",
              paddingVertical: 5,
            }}
          >
            {usersDoc?.nameWithIn}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "lightgray",
            }}
          >
            {usersDoc?.ocupation}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SettingsHeader;
