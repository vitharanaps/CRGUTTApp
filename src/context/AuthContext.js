import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import * as SecureStore from 'expo-secure-store';
import "react-native-get-random-values";
import {v4 as uuidv4} from 'uuid';

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {

    const DEVICE_ID_KEY ='deviceId';

  const [userInfo, setUserInfo] = useState(null);
  const [usersDoc, setUsersDoc] = useState(null);
  const [loading, setloading] = useState(false);

  const logout = () => {
    setUserInfo(null);
    AsyncStorage.removeItem("userInfo");
    setUsersDoc(null);
  };

  useEffect(() => {
    const getDeviceId =async ()=>{
        let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
        if(!deviceId) {
          deviceId =uuidv4();
          await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
        }
    
      }
      getDeviceId();

  }, [])
  

  const isUpdated = async () => {
    try {
      await updateDoc(doc(db, "users", userInfo?.uid), {
        isUpdated: true,
      });
      reFetchUserDoc();
    } catch (err) {
      console.log(err);
    }
  };
  const reFetchUserDoc = async () => {
    if (userInfo?.uid) {
      setloading(true);

      const docRef = doc(db, "users", userInfo?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsersDoc(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setloading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.uid) {
      async function fetchData() {
        setloading(true);

        const docRef = doc(db, "users", userInfo?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUsersDoc(docSnap.data());
        } else {
          console.log("No such document!");
        }
        setloading(false);
      }
      fetchData();
    }
  }, [userInfo]);

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem("userInfo");
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.log(`Loged in error ${error.message}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        setUserInfo,
        userInfo,
        loading,
        logout,
        usersDoc,
        isUpdated,
        reFetchUserDoc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
