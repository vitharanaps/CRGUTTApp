import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, width } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
// import { NotificationsIcon, SettingsIcon, LogoutIcon } from '@mui/icons-material';

import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/AuthContext";
import {
  Stack,
  Select,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  FormControl,
  MenuItem,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [numOfNewNotifications, setNumOfNewNotifications] = useState(0);

  dayjs.extend(relativeTime);

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp.toDate();
    //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  const toggleNotifications = () => {
    setOpenNotification(!openNotification);
  };
  //getNotifications

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
  //pass Notification Id
  const onClickNotification = async (notificationId ,stnId) => {
    navigate(`/stn/${stnId}`);
    const updateNotificationViewArray = doc(db, "Notification", notificationId);

    await updateDoc(updateNotificationViewArray, {
      view: arrayUnion(currentUser.id),
    });
   

    reFetchNotifications();
  };
  //check view
  const checkView = (viewArray) => {
    let status = false;
    viewArray.map((va) => {
      if (va === currentUser.id) {
        status = true;
      }
    });
    return status;
  };
  //new Notification count
  useEffect(() => {
    const getNewNotificationCount = async () => {
      let listOfNewNoti = [];

      notifications.map((nf) => {
        nf.view.map((vi) => {
          if (vi === currentUser.id) {
            listOfNewNoti.push(vi);
          } else {
            console.log(" view");
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

  return (
    <AppBar>
      <Toolbar>
        <Box sx={style.leftContainer}>
          <Typography variant="h6" color="#fff">
            CRGU TT Management System
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={style.rightContainer}>
          <IconButton title="NOtifictions" onClick={toggleNotifications}>
            <Badge badgeContent={numOfNewNotifications} color="error">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>
          <IconButton
            title="Notifictions"
            sx={{ color: "#fff", position: "relative" }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton title="NOtifictions" sx={{ color: "#fff" }}>
            <Avatar
              alt="Travis Howard"
              src={
                currentUser?.profileImage
                  ? currentUser?.profileImage
                  : "/assests/avatar.png"
              }
            />
          </IconButton>
        </Box>
        {/* Notification list */}
        <List
          sx={[
            {
              //  width: "100%",
              maxHeight: "500px",
              overflow: "auto",
              maxWidth: 360,
              bgcolor: "background.paper",
              backgroundColor: "#e2e4e4",
              position: "absolute",
              top: "60px",
              right: "50px",
              boxShadow: "0px 23px 17px -14px rgba(11, 10, 10, 0.1)",
              cursor: "pointer",
            },
            openNotification ? null : { display: "none" },
          ]}
        >
          {notifications?.map((nf) => (
            <>
              <ListItem
                alignItems="flex-start"
                sx={[
                  style.listButtonStyle,
                  checkView(nf?.view) ? null : { backgroundColor: "darkgray" },
                ]}
                onClick={() => onClickNotification(nf?.id, nf?.stnId)}
              >
                <ListItemText
                  primary={nf?.title}
                  secondary={
                    <React.Fragment>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ display: "inline" }}
                          component="span"
                          color="#161515"
                        >
                          {" "}
                          {nf?.description}
                        </Typography>
                        <Typography variant="title" color="inherit" noWrap>
                          &nbsp;
                        </Typography>

                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="#553434"
                        >
                          {" "}
                          {convertDate(nf?.timeStamp)}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </>
          ))}
        </List>
      </Toolbar>
    </AppBar>
  );
};

/** @type {import("@mui/material").SxProps}*/
const style = {
  rightContainer: {},

  listButtonStyle: {
    borderRadius: 1,
    "&:hover": {
      color: "#fff",
      backgroundColor: "#a0a0a2",
    },
  },
};

export default Navbar;
