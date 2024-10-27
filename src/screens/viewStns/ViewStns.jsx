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
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../component/navbar/Navbar";
import SideBar from "../../component/sideBar/SideBar";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db , storage} from "../../firebase";
import "../../index.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const ViewStns = () => {
  const location = useLocation();
  const stnId = location.pathname.split("/")[2];
  const [stnData, setStnData] = useState(null);
  const [loadingStn, setLoadingStn] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [existingFileUrl, setExistingFileUrl] = useState(null);  
  const [file, setFile] = useState(null); 
const [previewUrl,setPreviewUrl]= useState(null)
  const navigate = useNavigate();

  //chnage User Status

  const fetchStn = async () => {
    setLoadingStn(true);

    const docRef = doc(db, "stns", stnId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setStnData(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setLoadingStn(false);
  };

  useEffect(() => {
    if (!stnId) {
      return;
    }
    const fetchStn = async () => {
      setLoadingStn(true);

      const docRef = doc(db, "stns", stnId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStnData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setLoadingStn(false);
    };
    fetchStn();
  }, [stnId]);

  const handleDelete = async () => {
    setLoadingDelete(true);
    await deleteDoc(doc(db, "stns", stnId));
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
  //Modal Handler
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  //time converter

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp?.toDate();
    //const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  dayjs.extend(relativeTime);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);  // Set the selected file to state
      const previewUrl = URL.createObjectURL(file);  // Generate a preview URL for the image
      setPreviewUrl(previewUrl);
    }
  };
  
    const updateStn = async () => {
      const stnRef = doc(db, "stns", stnId);
    
      try {
        setLoadingUpdate(true);
    
        if (file) {
          const storageRef = ref(storage, `StnImages/${file.name}`);
    
          const snapshot = await uploadBytes(storageRef, file);
          const newFileUrl = await getDownloadURL(snapshot.ref);
    
          await updateDoc(stnRef, {
            ...data,
            stnImage: newFileUrl,
          });
    
          if (existingFileUrl) {
            const oldFileRef = ref(storage, existingFileUrl);
            await deleteObject(oldFileRef);
          }
    
          fetchStn(stnId);
          alert("Successfully Updated");
        } else {
          await updateDoc(stnRef, data);
          fetchStn(stnId);
          alert("Successfully Updated");
        }
      } catch (error) {
        console.log(error);
        alert("Failed to update");
      } finally {
        setLoadingUpdate(false);
      }
    };
  
    const [data, setData] = useState({
      destPlace: "",
      destTime: "",
      formTrainNo: "",
      line: "",
      lineNo: "",
      stAt: "",
      stTime: "",
      stnNo: "",
      stnReleasedDate: "",
      stnImage: "", 
    });
  
    const onChangeText = (e) => {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value,
      });
    };
    useEffect(() => {
      if (stnData) {
        setData((prevData) => ({
          ...prevData,
          destPlace: stnData.destPlace || "",
          destTime: stnData.destTime || "",
          formTrainNo: stnData.formTrainNo || "",
          line: stnData.line || "",
          lineNo: stnData.lineNo || "",
          stAt: stnData.stAt || "",
          stTime: stnData.stTime || "",
          stnNo: stnData.stnNo || "",
          stnReleasedDate: stnData.stnReleasedDate || "",
  stnImage : stnData.stnImage || "",
        }));
        setExistingFileUrl(stnData.stnImage);
      }
    }, [stnData]);
  
  return (
    <Box>
      <Navbar />
      <Box sx={style.container}>
        <Box sx={style.sideBar}>
          <SideBar />
        </Box>
        <Box sx={style.feeds}>
          {loadingStn && (
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
                Train No - {stnData?.trainNo}
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
                    src={
                      stnData?.stnImage
                        ? stnData?.stnImage
                        : "https://images.unsplash.com/photo-1619418602850-35ad20aa1700?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
                    }
                    alt="stnImage"
                    className="imgClass"
                    onClick={handleOpen}
                  />
                   <input
    type="file"
    onChange={handleFileChange}
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
                        <DialogTitle>{`Do You Want to Delete ${stnData?.trainNo}?`}</DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-slide-description">
                            This is alert For Delete, {stnData?.trainNo} , do
                            You like It Press Agree or Do You Want to discard
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
                        {stnData?.nameWithIn}
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
                        {stnData?.email}
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
                        {stnData?.address}
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
                        {stnData?.idNo}
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
                        {stnData?.isUpdated ? "Yes" : "No"}
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
                        {stnData?.mobileNo1}
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
                        {stnData?.mobileNo2}
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
                        {stnData?.ocupation}
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
                        {stnData?.role}
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
                            Stn No{" "}
                          </Typography>
                        </td>
                        <td>
                        <td>
                          <TextField
                            type="text"
                            name="stnNo"
                            size="small"
                            onChange={onChangeText}
                            value={data?.stnNo}
                            defaultValue={stnData?.stnNo}
                          />
                        </td>
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Start At{" "}
                          </Typography>
                        </td>
                        <td>
                            <TextField
                              type="text"
                              name="stTime"
                              size="small"
                              sx={{ width: 80 }}
                              onChange={onChangeText}
                              value={data?.stTime}
                              defaultValue={stnData?.stTime}
                            />{" "}
                            -{" "}
                            <TextField
                              type="text"
                              name="stAt"
                              size="small"
                              sx={{ width: 80 }}
                              onChange={onChangeText}
                              value={data?.stAt}
                              defaultValue={stnData?.stAt}
                            />                       
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Destination{" "}
                          </Typography>
                        </td>
                        <td>
                        <TextField
                            type="text"
                            name="destTime"
                            size="small"
                            sx={{ width: 80 }}
                            onChange={onChangeText}
                            value={data?.destTime}
                            defaultValue={stnData?.destTime}
                          />{" "}
                          -{" "}
                          <TextField
                            type="text"
                            name="destPlace"
                            size="small"
                            sx={{ width: 80 }}
                            onChange={onChangeText}
                            value={data?.destPlace}
                            defaultValue={stnData?.destPlace}
                          />
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Released Date{" "}
                          </Typography>
                        </td>
                        <td>
                        <TextField
                            type="text"
                            name="stnReleasedDate"
                            size="small"
                            sx={{ width: 120 }}
                            onChange={onChangeText}
                            value={data?.stnReleasedDate}
                            defaultValue={stnData?.stnReleasedDate}
                          />
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Form Train No{" "}
                          </Typography>
                        </td>
                        <td>
                        <TextField
                            type="text"
                            name="formTrainNo"
                            size="small"
                            sx={{ width: 120 }}
                            onChange={onChangeText}
                            value={data?.formTrainNo}
                            defaultValue={stnData?.formTrainNo}
                          />
                        </td>
                      </tr>
                      <tr height="40px">
                        <td>
                          {" "}
                          <Typography variant="body" sx={{ margin: 2 }}>
                            Updated At
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" sx={{ margin: 2 }}>
                            {" "}
                            {
//stnData?.timeStamp.toString()
                          stnData?.stnReleasedDate
                          }
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
                        <Typography variant="body" sx={{ margin: 2 }}>
                          Line No
                        </Typography>
                      </td>
                      <td>
                      <TextField
                            type="text"
                            name="lineNo"
                            size="small"
                            sx={{ width: 120 }}
                            onChange={onChangeText}
                            value={data?.lineNo}
                            defaultValue={stnData?.lineNo}
                          />
                       
                      </td>
                    </tr>
                    <tr height="40px">
                      <td>
                        {" "}
                        <Typography variant="body" sx={{ margin: 2 }}>
                          Line Name{" "}
                        </Typography>
                      </td>
                      <td>
                      <TextField
                            type="text"
                            name="line"
                            size="small"
                            sx={{ width: 120 }}
                            onChange={onChangeText}
                            value={data?.line}
                            defaultValue={stnData?.line}
                          />
                      </td>
                    </tr>
                  </table>
                </Box>
              </Box>
            </Box>
            <Box sx={{marginY:5}}>
              {loadingUpdate ? (
                <Box>
                  <CircularProgress color="secondary" />
                </Box>
              ) : (
                <Button variant="contained" color="primary" onClick={updateStn}>
                  Update STNs
                </Button>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={stnData?.stnImage}
              style={{ height: "80%", width: "80%", objectFit: "contain" }}
            />

            {/* <Zoom
    img={stnData?.signalImage}
    zoomScale={3}
    width="100%"
    height="100%"
  /> */}
          </Box>
          <Box sx={style.closeBtn} >
            <Button variant="contained" onClick={handleCloseModal} color="error">Close</Button>
          </Box>
        </Box>
      </Modal>
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
  modalStyle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    height: "90vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  closeBtn:{
    position:"absolute",
    top:10,
    left:10
  }
};
export default ViewStns;
