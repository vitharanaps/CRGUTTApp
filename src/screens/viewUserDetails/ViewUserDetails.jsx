import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../component/navbar/Navbar";
import SideBar from "../../component/sideBar/SideBar";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../../index.css";

const ViewUserDetails = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const navigate = useNavigate();

  //chnage User Status

  const fetchUser = async () => {
    setLoadingUser(true);

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setLoadingUser(false);
  };
  const DoApprove = async () => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isConfirm: true,
      });
      fetchUser();
      setOpenSnackBarPending(true);
    } catch (err) {
      console.log(err);
    }
  };

  const DoPending = async () => {
    fetchUser();
    try {
      await updateDoc(doc(db, "users", userId), {
        isConfirm: false,
      });
      setOpenSnackBarPending(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchUser = async () => {
      setLoadingUser(true);

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    setLoadingDelete(true);
    await deleteDoc(doc(db, "users", userId));
    navigate(-1);
    setLoadingDelete(false);
  };

  const [openDeleteDialogBox, setOpenDeleteDialogBox] = React.useState(false);

  const handleOpenDeleteDialogBox = () => {
    setOpenDeleteDialogBox(true);
  };

  const handleClose = () => {
    setOpenDeleteDialogBox(false);
  };

  //Snackbar for Pending status
  const [openSnackBarPending, setOpenSnackBarPending] = useState(false);

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBarPending(false);
  };

  return (
    <Box>
      <Navbar />
      <Box sx={style.container}>
        <Box sx={style.sideBar}>
          <SideBar />
        </Box>
        <Box sx={style.feeds}>
          {loadingUser && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress disableShrink />
            </Box>
          )}
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box sx={style.title}>
              <Typography variant="h6" color="gray">
                Mr {userData?.nameWithIn} 's Profile
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
            <Box sx={style.tableContainer}>
              <Box
                sx={{
                  width: "95%",
                  backgroundColor: "#eeeeee",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    height: 150,
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <img

                    src=
                    {                   userData?.profileImage ?
                      userData?.profileImage
                      :
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
                    }
                    
                 
                    alt="userImg"
                    className="imgClass"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      //  border:"1px solid #33ddde",
                      padding: 3,
                      borderRadius: 2,
                      //  backgroundColor:"#7ba6fc33"
                    }}
                  >
                    <Typography variant="h6" color="gray">
                      Operations
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      {loadingDelete ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CircularProgress disableShrink />
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleOpenDeleteDialogBox}
                        >
                          Delete
                        </Button>
                      )}

                      <Dialog
                        open={openDeleteDialogBox}
                        // TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                      >
                        <DialogTitle>{`Do You Want to Delete ${userData?.nameWithIn}?`}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-slide-description">
                            This is alert For Delete, {userData?.nameWithIn} ,
                            do You like It Press Agree or Do You Want to discard
                            Press Disagree, thank you
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Disagree</Button>
                          <Button onClick={handleDelete}>Agree</Button>
                        </DialogActions>
                      </Dialog>

                      <Button variant="outlined" color="success">
                        Edit
                      </Button>
                      {userData?.isConfirm ? (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={DoPending}
                        >
                          To Do Pending
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={DoApprove}
                        >
                          To Do Approved
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Snackbar
                  open={openSnackBarPending}
                  autoHideDuration={6000}
                  onClose={handleCloseSnack}
                >
                  <Alert
                    onClose={handleCloseSnack}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Successfully Changed User Status !
                  </Alert>
                </Snackbar>

                {/*                 
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Name With Initials
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.nameWithIn}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Email
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Address
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.address}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Id No
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.idNo}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Is Updated
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.isUpdated ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Mobile No1
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.mobileNo1}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Mobile No2
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.mobileNo2}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    Occupation
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.ocupation}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    backgroundColor: "#fff",
                    width: "95%",
                    padding: 2,
                    marginTop: 1,
                    marginBottom: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography varient="h7" color="gray">
                    User Role
                  </Typography>
                  <Typography varient="h7" color="gray">
                    {userData?.role}
                  </Typography>
                </Box> */}
              </Box>
            </Box>
          </Stack>
          <Stack
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box sx={style.details}>
              <Box sx={style.leftContainer}>
                <Typography variant="h7" color="gray" sx={{ paddingLeft: 2 }}>
                  Personal Details
                </Typography>
                <Box sx={style.detailsLeft}>
                  <Box sx={style.boxLeft}>
                    <table>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Name With Initials
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {userData?.nameWithIn}
                          </Typography>
                        </td>
                      </tr>
                      <tr height="40px" >
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                          ID no{" "}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={{ margin: 2 }}>
                          {" "}
                          {userData?.idNo}
                        </Typography>
                      </td>
                    </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Email
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {userData?.email}
                          </Typography>
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Address
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {userData?.address}
                          </Typography>
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Mobile No 1
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {userData?.mobileNo1}
                          </Typography>
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            MObile No 2
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {userData?.mobileNo2}
                          </Typography>
                        </td>
                      </tr>
                    </table>
                  </Box>
                </Box>
              </Box>

              <Box sx={style.rightContainer}>
                <Typography variant="h7" color="gray" sx={{ paddingLeft: 2 }}>
                  Professional Details
                </Typography>
                <Box sx={style.detailsRight}>
                  <table>

                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                          Occupation
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={{ margin: 2 }}>
                          {" "}
                          {userData?.ocupation}
                        </Typography>
                      </td>
                    </tr>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                          Home Station{" "}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={{ margin: 2 }}>
                          {" "}
                          {userData?.homeStation}
                        </Typography>
                      </td>
                    </tr>
                  </table>
                </Box>
              </Box>
              <Box sx={style.midContainer}>
                <Typography variant="h7" color="gray" sx={{ paddingLeft: 2 }}>
                  System Data
                </Typography>
                <Box sx={style.detailsRight}>
                  <table>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                          Pending
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={[ {margin: 2} , userData?.isConfirm ? {padding:1,background:"green",margin:1, color:"white" }:{padding:1,background:"red", margin:1, color:"white"} ]}>
                          {" "}
                          { userData?.isConfirm ? "Approved" :"Pending"}
                        </Typography>
                      </td>
                    </tr>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                        Updated 
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={[ {margin: 2} , userData?.isUpdated ? {padding:1,background:"green", color:"white", margin:1 }   :  {padding:1,margin:1, background:"red", color:"white"}]}>
                          {" "}
                          { userData?.isUpdated ? "Yes" : "No"}
                        </Typography>
                      </td>
                    </tr>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                        User Role
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={ {margin: 2}}>
                          {" "}
                          { userData?.role }
                        </Typography>
                      </td>
                    </tr>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                        Registed Date
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" sx={ {margin: 2}}>
                          {" "}
                         {/* { userData?.timeStamp } */}
                        </Typography>
                      </td>
                    </tr>
                  </table>
                </Box>
              </Box>
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

  title: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
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
  tableContainer: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",

    paddingTop: 2,
    paddingBottom: 2,
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
  },
  details: {
    display: "flex",
    justifyContent: "space-between",
    width: "95%",
    backgroundColor: "#fff",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    paddingTop: 2,
    paddingBottom: 2,
  },
  detailsLeft: {
    flex: 1,
    padding: 2,
    marginLeft: 1,
    marginRight: 1,
    justifyContent: "space-between",
    display: "flex",
    marginTop: 1,
  },
  detailsRight: {
    flex: 1,
    padding: 2,
    marginLeft: 1,
    marginRight: 1,
    display: "flex",
    marginTop: 1,
  },

  boxLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  boxRight: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  leftContainer: {
    flex: 1.5,
  },
  rightContainer: {
    flex: 1,
  },
  midContainer: {
    flex: 1,
  },
};
export default ViewUserDetails;
