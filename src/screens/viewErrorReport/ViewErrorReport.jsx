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
  import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
  import { db } from "../../firebase";
  import "../../index.css";
  import dayjs from "dayjs";
  import relativeTime from 'dayjs/plugin/relativeTime'


  const ViewErrorReport = () => {

    dayjs.extend(relativeTime)
  
  
    const convertDate = (timeStamp)=>{
      const convertedDate = timeStamp.toDate();
   //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
  return dayjs(convertedDate).fromNow(true)
    }
  

    const location = useLocation();
    const errorId = location.pathname.split("/")[2];
    const [errorData, setErrorData] = useState(null);
    const [loadingError, setLoadingError] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
  
    const navigate = useNavigate();
  
  
    const fetchError = async () => {
      setLoadingError(true);
  
      const docRef = doc(db, "ErrorReport", errorId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setErrorData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoadingError(false);
    };
   
  
   
  
    useEffect(() => {
      if (!errorId) {
        return;
      }
      const fetchError = async () => {
        setLoadingError(true);
  
        const docRef = doc(db, "ErrorReport", errorId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setErrorData(docSnap.data());
        } else {
          console.log("No such document!");
        }
        setLoadingError(false);
        
      };
      fetchError();
    }, [errorId]);
  
    const handleDelete = async () => {
      setLoadingDelete(true);
      await deleteDoc(doc(db, "ErrorReport", errorId));
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
            {loadingError && (
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
                  Error Report
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
                      src="https://images.unsplash.com/photo-1598533463912-68adac0b8231?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1210&q=80"
                      alt="railTrack"
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
                          <DialogTitle>Do You Want to Delete ?</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                              This is alert For Delete,
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
                    Error Details
                  </Typography>
                  <Box sx={style.detailsLeft}>
                    <Box sx={style.boxLeft}>
                      <table>
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Error Type
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {errorData?.errorType}
                            </Typography>
                          </td>
                        </tr>
                        <tr height="40px" >
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Error Description {" "}
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {errorData?.errorDesc}
                          </Typography>
                        </td>
                      </tr>
                       
                        <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              User
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {errorData?.creator}
                            </Typography>
                          </td>
                        </tr>
                        {/* <tr height="40px">
                          <td>
                            {" "}
                            <Typography variant="body" sx={{ margin: 2 }}>
                              Date Of error
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="body" sx={{ margin: 2 }}>
                              {" "}
                              {
//convertDate(errorData?.timeStamp?.nt)
                              }
                            </Typography>
                          </td>
                        </tr> */}
                        
                     
                      </table>
                    </Box>
                  </Box>
                </Box>
  
                <Box sx={style.rightContainer}>
                  
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
  export default ViewErrorReport;
  