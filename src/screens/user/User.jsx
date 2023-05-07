import {
  Alert,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../component/navbar/Navbar";
import SideBar from "../../component/sideBar/SideBar";
import UserTable from "../../component/userTable/UserTable";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UserTableBasic from "../../component/userTable/UserTableBasic";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

const User = () => {
  const [pending, setPending] = useState("");
  const [homeStation, setHomeStation] = useState("");
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterderData, setFilteredData] = useState([]);

  const handleChangePending = (event) => {
    setPending(event.target.value);
  };

  const handleChangeHomeStation = (event) => {
    setHomeStation(event.target.value);
  };
  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  ///get data from database

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const optionsRef = collection(db, "users");
        const q = query(optionsRef, orderBy("isConfirm", "asc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          console.log(doc.data);
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
        setFilteredData(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  console.log("data", data);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const filterSearch = () => {
      setFilteredData(
        search === ""
          ? data
          : data?.filter((dt) =>
              dt.nameWithIn.toLowerCase().includes(search.toLowerCase())
            )
      );
    };
    filterSearch();
  }, [search]);

  //filter by Options
  const filterByOptions = async () => {
    let optionList = [];
    try {
      const optionsRef = collection(db, "users");
      const q = query(
        optionsRef,
        (pending !== "" && where("isConfirm", "==", pending)) ||
          (homeStation !== "" && where("homeStation", "==", homeStation)) ||
          (role !== "" && where("role", "==", role))
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        optionList.push({ id: doc.id, ...doc.data() });

        console.log(doc.id, " => ", doc.data());
      });
      setData(optionList);
      setFilteredData(optionList);
    } catch (err) {
      console.log(err);
    }
  };
  console.log(data);
  return (
    <Box>
      <Navbar />
      <Box sx={style.container}>
        <Box sx={style.sideBar}>
          <SideBar />
        </Box>
        <Box sx={style.feeds}>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box sx={style.title}>
              <Typography varient="h7" color="gray">
                Manage User Details
              </Typography>
            </Box>
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box sx={style.filterContainer}>
              <Box
                sx={{
                  display: "flex",
                  flex: 5,
                  marginRight: 2,
                  paddingLeft: 5,
                  paddingTop: 2,
                  paddingBottom: 2,
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search Here"
                  onChange={handleSearchChange}
                />
                Pending
                <Select
                  size="small"
                  value={pending}
                  onChange={handleChangePending}
                >
                  <MenuItem value="">Select Status</MenuItem>

                  <MenuItem value={false}>Pending</MenuItem>
                  <MenuItem value={true}>Approved</MenuItem>
                </Select>
                Home Station
                <Select
                  size="small"
                  value={homeStation}
                  onChange={handleChangeHomeStation}
                >
                  <MenuItem value="">Select Home Station</MenuItem>

                  <MenuItem value="GLE">GLE</MenuItem>
                  <MenuItem value="MTR">MTR</MenuItem>
                </Select>
                User Role
                <Select size="small" value={role} onChange={handleChangeRole}>
                  <MenuItem value="">Select Role</MenuItem>

                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={filterByOptions}
                >
                  Search
                </Button>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button variant="contained" endIcon={<AddCircleIcon />}>
                  Add User
                </Button>
              </Box>
            </Box>
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              marginBottom: 2,
              alignItems: "center",
            }}
          >
            <Box sx={style.dataTable}>
              <UserTable userData={filterderData} />
              {/* <UserTableBasic /> */}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps}*/
const style = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
  },
  sideBar: {
    flex: 1,
    height: 500,
  },
  feeds: {
    flex: 4,
    height: 500,
    paddingTop: 10,
  },
  title: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
  },
  dataTable: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
  },
  filterContainer: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    borderRadius: 1,
  },
};
export default User;
