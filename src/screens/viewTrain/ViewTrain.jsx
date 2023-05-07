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
  
  const ViewTrain = () => {
    const location = useLocation();
    const trainId = location.pathname.split("/")[2];
    const [trainData, setTrainData] = useState(null);
    const [loadingTrain, setLoadingTrain] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
  
    const navigate = useNavigate();
  
    //chnage User Status
  
    const fetchTrain = async () => {
      setLoadingTrain(true);
  
      const docRef = doc(db, "trains", trainId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setTrainData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoadingTrain(false);
    };
    const DoApprove = async () => {
      try {
        await updateDoc(doc(db, "users", trainId), {
          isConfirm: true,
        });
        fetchTrain();
        setOpenSnackBarPending(true);
      } catch (err) {
        console.log(err);
      }
    };
  
    const DoPending = async () => {
      fetchTrain();
      try {
        await updateDoc(doc(db, "users", trainId), {
          isConfirm: false,
        });
        setOpenSnackBarPending(true);
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      if (!trainId) {
        return;
      }
      const fetchTrain = async () => {
        setLoadingTrain(true);
  
        const docRef = doc(db, "trains", trainId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setTrainData(docSnap.data());
        } else {
          console.log("No such document!");
        }
        setLoadingTrain(false);
      };
      fetchTrain();
    }, [trainId]);
  
    const handleDelete = async () => {
      setLoadingDelete(true);
      await deleteDoc(doc(db, "trains", trainId));
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
            {loadingTrain && (
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
                  Train No {trainData?.trainNo}
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
                      src="https://images.unsplash.com/photo-1601999007938-f584b47324ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
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
                          <DialogTitle>{`Do You Want to Delete ${trainData?.trainNo}?`}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                              This is alert For Delete, {trainData?.trainNo} ,
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
                      </Box>
                    </Box>
                  </Box>
                
  
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
                      {trainData?.nameWithIn}
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
                      {trainData?.email}
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
                      {trainData?.address}
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
                      {trainData?.idNo}
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
                      {trainData?.isUpdated ? "Yes" : "No"}
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
                      {trainData?.mobileNo1}
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
                      {trainData?.mobileNo2}
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
                      {trainData?.ocupation}
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
                      {trainData?.role}
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
                    Train Details
                  </Typography>
                  <Box sx={style.detailsLeft}>
                    <Box sx={style.boxLeft}>
                      <table>
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Train No
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {trainData?.trainNo}
                            </Typography>
                          </td>
                        </tr>
                        <tr height="40px" >
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Start At{" "}
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {trainData?.stPlace}
                          </Typography>
                        </td>
                      </tr>
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Start Time
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {trainData?.stTime}
                            </Typography>
                          </td>
                        </tr>
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Destination
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {trainData?.destPlace}
                            </Typography>
                          </td>
                        </tr>
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Arrival Time
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {trainData?.destTime}
                            </Typography>
                          </td>
                        </tr>
                     
                      </table>
                    </Box>
                  </Box>
                </Box>
  
                <Box sx={style.rightContainer}>
                  <Typography variant="h7" color="gray" sx={{ paddingLeft: 2 }}>
                    Line Details
                  </Typography>
                  <Box sx={style.detailsRight}>
                    <table>
  
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Line Name
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {trainData?.line}
                          </Typography>
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                             Line No{" "}
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {trainData?.lineNo}
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
  export default ViewTrain;
  