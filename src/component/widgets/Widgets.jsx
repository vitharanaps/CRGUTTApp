import { Box, CircularProgress,Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Person4Icon from "@mui/icons-material/Person4";
import { PersonOutline } from "@mui/icons-material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import ArticleIcon from "@mui/icons-material/Article";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import { Link } from "react-router-dom";

const Widgets = ({ type }) => {
  const [numOfUser, setNumOfUser] = useState(0);
  const [numOfStn, setNumOfStn] = useState(0);
  const [numOfLines, setNumOfLines] = useState(0);
  const [numOfPendingUsers, setNumOfPendingUsers] = useState(0);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const getUserCount = async () => {
      setloading(true);
      // const today = new Date();
      // const lastMonth = new Date(new Date().setMonth(today.getMonth()- 1))
      // const prevMonth = new Date(new Date().setMonth(today.getMonth()- 2))

      const qUser = query(collection(db, "users"));
      const querySnapshotUser = await getDocs(qUser);
      const countUser = querySnapshotUser.size;
      setNumOfUser(countUser);
      setloading(false);
    };
    getUserCount();
  }, []);

  useEffect(() => {
    const getStnCount = async () => {
      setloading(true);
      const qStns = query(collection(db, "stns"));
      const querySnapshotStns = await getDocs(qStns);
      const countStns = querySnapshotStns.size;
      setNumOfStn(countStns);
      setloading(false);
    };
    getStnCount();
  }, []);
  useEffect(() => {
    const getLinesCount = async () => {
      setloading(true);
      const qLines = query(collection(db, "lines"));
      const querySnapshotLines = await getDocs(qLines);
      //  console.log(querySnapshotUser.docs)
      const countLines = querySnapshotLines.size;
      setNumOfLines(countLines);
      setloading(false);
    };
    getLinesCount();
  }, []);

  useEffect(() => {
    const getPendingUsers = async () => {
      setloading(true);
      const q = query(collection(db, "users"), where("isConfirm", "==", false));

      const querySnapshotPendingUsers = await getDocs(q);
      const countPendingUsers = querySnapshotPendingUsers.size;
      setNumOfPendingUsers(countPendingUsers);
      setloading(false);
    };
    getPendingUsers();
  }, []);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        link: "see all users",
        linkLink: "user",
        count: numOfUser,
        icon: (
          <Person4Icon
            sx={{
              padding: "5px",
              backgroundColor: "#79E44E",
              borderRadius: 1,
              color: "green",
            }}
          />
        ),
      };
      break;
    case "stn":
      data = {
        title: "STNS",
        count: numOfStn,
        link: "see all stns",
        linkLink: "stn",

        icon: (
          <ArticleIcon
            sx={{
              padding: "5px",
              backgroundColor: "#79E44E",
              borderRadius: 1,
              color: "green",
            }}
          />
        ),
      };
      break;
    case "line":
      data = {
        title: "LINES",
        count: numOfLines,

        link: "see all lines",
        linkLink: "lines",

        icon: (
          <AddRoadIcon
            sx={{
              padding: "5px",
              backgroundColor: "#79E44E",
              borderRadius: 1,
              color: "green",
            }}
          />
        ),
      };
      break;
    case "pending":
      data = {
        title: "PENDING",
        count: numOfPendingUsers,

        link: "see all Pending",
        linkLink: "user",

        icon: (
          <Person4Icon
            sx={{
              padding: "5px",
              backgroundColor: "#79E44E",
              borderRadius: 1,
              color: "red",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <Box sx={style.widget}>
      <Box sx={{ padding: 1 }}>
        <Typography sx={{ fontSize: 18, color: "gray" }}>
          {data?.title.toUpperCase()}
        </Typography>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography sx={{ fontSize: 30 }}>
          {loading ? (
            <Box>
              <CircularProgress color="secondary" />{" "}
            </Box>
          ) : (
            data?.count
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
                <Link to={data?.linkLink} >
        <Typography
          sx={{
            fontSize: 13,
            borderBottom: "1px solid black",
            width: "max-content",
            color: "gray",
            cursor: "pointer",
          }}
        >
          {data?.link}
        </Typography>
        </Link>
        {data?.icon}
        {/* <Person4Icon
          sx={{
            padding: "5px",
            backgroundColor: "#79E44E",
            borderRadius: 1,
            color: "green",
          }}
        /> */}
      </Box>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps}*/
const style = {
  widget: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    margin: "10px",
    padding: "10px",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    height: 120,
    borderRadius: 2,
  },
};

export default Widgets;
