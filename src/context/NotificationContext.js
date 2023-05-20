import React, { createContext, useState, useEffect, useContext } from "react";
import { arrayUnion, collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "./AuthContext";

const NotificationContext = createContext({});

const NotificationContextProvider = ({ children }) => {
  const { usersDoc, userInfo } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [numOfNewNotifications, setNumOfNewNotifications] = useState([]);

  //Get All Notifications
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const optionsRef = collection(db, "Notification");
        const q = query(optionsRef, orderBy("timeStamp", "desc"), limit(20));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  //new Notification count
  useEffect(() => {
    const getNewNotificationCount = async () => {
      let listOfNewNoti = [];

      notifications.map((nf) => {
        nf.view.map((vi) => {
          if (vi === userInfo?.uid) {
            listOfNewNoti.push(vi);
          } else {
           // console.log(" view");
          }
        });
      });

      setNumOfNewNotifications(notifications?.length - listOfNewNoti?.length);
    };
    if (notifications === null) {
      return;
    } else {
      getNewNotificationCount();
    }
  }, [notifications]);

   //pass Notification Id
   const onClickNotification = async (notificationId) => {

    const updateNotificationViewArray = doc(db, "Notification", notificationId);

    await updateDoc(updateNotificationViewArray, {
      view: arrayUnion(userInfo?.uid),
    });
   

    reFetchNotifications();
  };

  //refetch Notifications
  const reFetchNotifications = async () => {
    let list = [];
    try {
      const optionsRef = collection(db, "Notification");
      const q = query(optionsRef, orderBy("timeStamp", "desc"), limit(20));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(list);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <NotificationContext.Provider value={{ numOfNewNotifications, notifications, onClickNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationContextProvider;
export const useNotificationContext = () => useContext(NotificationContext);
