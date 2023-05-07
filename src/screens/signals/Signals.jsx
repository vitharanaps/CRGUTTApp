import {
  Box,
  Typography,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../component/navbar/Navbar";
import SideBar from "../../component/sideBar/SideBar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as yup from "yup";
import { Formik } from "formik";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigate } from "react-router-dom";


const AddSignalSchema = yup.object().shape({
  signalName: yup.string().required("Start Place Required"),
});

const Signals = () => {
  const [line, setLine] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterByLine, setFilterByLine] = useState("");
  const [filterderData, setFilteredData] = useState([]);
  const [loadingInsertTrains, setLoadingInsertTrains] = useState(false);
  const [file, setFile] = useState(null);
  const [downloardableUrl, setDownloardableUrl] = useState(null);
  const [linesFromDb, setLinesFromDb] = useState([]);
  const [lineDetail, setLineDetail] = useState(null);
  const [uploadingPers, setUploadingPers] = useState(null);
  const [loadingLineToSelect, setLoadingLineToSelect] = useState(false);


  const navigate = useNavigate();

  const handleChangeLine = (e) => {
    setLine(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  console.log("search", search);
  const handleChangeFilterByLine = (event) => {
    setFilterByLine(event.target.value);
  };
  //fetch Trains

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "signals"));
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

  useEffect(() => {
    const filterSearch = () => {
      setFilteredData(
        search === ""
          ? data
          : data?.filter((dt) =>
              dt.signalName.toLowerCase().includes(search.toLowerCase())
            )
      );
    };
    filterSearch();
  }, [search]);

  //filter by Options
  useEffect(() => {
    const filterByOptions = async () => {
      let optionList = [];
      try {
        const optionsRef = collection(db, "signals");
        const q = query(
          optionsRef,
          filterByLine !== "" && where("lineNo", "==", filterByLine)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          optionList.push({ id: doc.id, ...doc.data() });
        });
        setData(optionList);
        setFilteredData(optionList);
      } catch (err) {
        console.log(err);
      }
    };
    filterByOptions();
  }, [filterByLine]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Fetch Signal after subimit
  const fetchData = async () => {
    let list = [];
    try {
      const querySnapshot = await getDocs(collection(db, "signals"));
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

  const addSignal = async (values, resetForm) => {
    setLoadingInsertTrains(true);
    const { signalName } = values;

    //check Train No is Unique
    const qSignalName = query(
      collection(db, "signals"),
      where("signalName", "==", signalName),
      where("lineNo", "==", lineDetail.lineNo)
    );
    const querySnapshotSignalName = await getDocs(qSignalName);
    const countSignalNo = querySnapshotSignalName.size;

    if (line === "") {
      alert("Please Select Line");
    } else if (file === null) {
      alert("Please Select Signal Image");
    } else {
      if (countSignalNo <= 0) {
        console.log("sig count", countSignalNo)

        try {
          const docRef = await addDoc(collection(db, "signals"), {
            signalName: signalName,
            line: lineDetail.lineName,
            lineNo: lineDetail.lineNo,
            signalImage: downloardableUrl,
            timeStamp: serverTimestamp(),
          });
          resetForm((values = ""));
          handleClose();
          fetchData();
          setOpenSnackbar(true);
          setDownloardableUrl(null)
          setLineDetail(null)
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("Signal Name Exists, Please Check Signal Name");
      }
    }
    setLoadingInsertTrains(false);
  };
  //Snack bar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  useEffect(() => {
    const uploadImage = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, `SignalImages/${name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setUploadingPers(progress);
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
        (err) => {
          console.log(err);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setDownloardableUrl(downloadURL);
          });
        }
      );
    };
    file && uploadImage();
  }, [file]);

  //Fetch Line

  useEffect(() => {
    const fetchLineToSelectBox = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "lines"));
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setLinesFromDb(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLineToSelectBox();
  }, []);
  console.log("select list", linesFromDb);
  //Fetch Line To select Box

  useEffect(() => {
    const fetchLineToSelect = async () => {
      setLoadingLineToSelect(true);
      if (line === "") {
        setLineDetail(null);
      } else {
        const docRef = doc(db, "lines", line);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLineDetail(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      setLoadingLineToSelect(false);
    };
    fetchLineToSelect();
  }, [line]);


  dayjs.extend(relativeTime)


  const convertDate = (timeStamp)=>{
    const convertedDate = timeStamp.toDate();
 //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
return dayjs(convertedDate).fromNow(true)
  }



  const handleView = (id) => {
    // navigate("/", { state: { id: id} });
    navigate(`/signals/${id}`)
   };

   const [loadValue, setLoadValue] = useState(3)

   const loadMore = () =>{
    setLoadValue((prevValue)=> prevValue + 3)
  }
  
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
                Manage Signals
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
                  placeholder="Search By Signal Name"
                  onChange={handleSearchChange}
                />
                Line
                <Select
                  size="small"
                  value={filterByLine}
                  onChange={handleChangeFilterByLine}
                >
                  <MenuItem value="">Select Line</MenuItem>
                  {linesFromDb.map((li) => (
                    <MenuItem value={li?.lineNo} key={li.id}>
                      {li?.lineName}
                    </MenuItem>
                  ))}
                </Select>
                {/*}  Home Station
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
                    </Select> */}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="contained"
                  endIcon={<AddCircleIcon />}
                  onClick={() => handleOpen()}
                >
                  Add Signals
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
              <Box sx={{ width: "100%" }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Line No</TableCell>
                        <TableCell align="center">Line Name</TableCell>
                        <TableCell align="center">Signal Name</TableCell>
                        <TableCell align="center">Date Of Updated</TableCell>
                        <TableCell align="center">Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterderData.slice(0,loadValue).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row?.lineNo}</TableCell>
                          <TableCell>{row?.line}</TableCell>

                          <TableCell align="center">
                            {row?.signalName}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={style.pending}>
                             {
                                   convertDate(row?.timeStamp)
                             }
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box>
                              <Button variant="contained" color="success" onClick={()=>handleView(row?.id)}>
                                {" "}
                                View
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </Stack>
          {filterderData.length > 0 &&
           <Stack
           sx={{
             justifyContent: "center",
             marginBottom: 2,
             alignItems: "center",
           }}
         >
           <Box sx={style.loadMoreContainer}>
             <Button variant="contained" color="secondary" onClick={loadMore} >
               Load More
             </Button>
           </Box>
         </Stack>
          
          }
        </Box>
      </Box>

      {/* Modal */}
      <Formik
        initialValues={{
          signalName: "",
        }}
        validateOnMount={true}
        // onSubmit={(values, {resetForm})=>{
        //   addTrain(values);
        //   resetForm(values= "")
        // }}
        onSubmit={(values, { resetForm }) => addSignal(values, resetForm)}
        validationSchema={AddSignalSchema}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          touched,
          errors,
          isValid,
        }) => (
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style.modalStyle}>
              <Typography variant="h6" component="h2">
                Add Signal
              </Typography>

              <Box sx={style.textInputWrapper}>
                <Box sx={style.leftSide}>
                  <Box sx={{ width: "150px", height: "150px" }}>
                    <img
                      src={
                        downloardableUrl
                          ? downloardableUrl
                          : "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
                      }
                      alt="text"
                      width="100%"
                      height="100%"
                    />
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </Box>
                </Box>
                <Box sx={style.rightSide}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 3,
                    }}
                  >
                    <InputLabel id="demo-simple-select-helper-label">
                      Select Line
                    </InputLabel>
                    <Select
                      value={line}
                      onChange={handleChangeLine}
                      label="Select Line"
                      inputProps={{ "aria-label": "Without label" }}
                      size="small"
                      autoWidth
                    >
                      <MenuItem value="">Select Line</MenuItem>
                      {linesFromDb.map((li) => (
                        <MenuItem value={li?.id} key={li.id}>
                          {li?.lineName}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  {loadingLineToSelect ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    lineDetail && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: 2,
                          border: "1px, solid gray",
                          backgroundColor: "#eeeeee",
                          padding: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            Line No - {lineDetail?.lineNo}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            Start At - {lineDetail?.stPlace}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            End At -{lineDetail?.endPlace}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  )}

                  <div>
                    <TextField
                      label="Signal Name"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("signalName")}
                      onBlur={handleBlur("signalName")}
                      value={values.signalName}
                    />
                    {errors.signalName && touched.signalName ? (
                      <Typography style={style.errorMsg}>
                        {errors.signalName}
                      </Typography>
                    ) : null}
                  </div>
                </Box>
              </Box>
              <Box
                sx={{
                  alignContent: "center",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 5,
                }}
              >
                {loadingInsertTrains ? (
                  <CircularProgress color="success" />
                ) : uploadingPers !== null && uploadingPers < 100 ? (
                  <CircularProgress color="success" />
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={uploadingPers !== null && uploadingPers < 100}
                    onClick={handleSubmit}
                  >
                    Add Signal
                  </Button>
                )}
              </Box>
            </Box>
          </Modal>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully Added Signal to database !
        </Alert>
      </Snackbar>
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
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
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
  loadMoreContainer: {
    width: "95%",
    display: "flex",
    backgroundColor: "#fff",
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    borderRadius: 1,
  },
  modalStyle: {
    position: "absolute",
    top: "300px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    //border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  },
  textInputWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
  },
  rightSide: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
  },
};
export default Signals;
