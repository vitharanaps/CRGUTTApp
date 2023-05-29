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
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
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
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const AddSignalSchema = yup.object().shape({
  stnNo: yup.string().required("Stn No Required"),
  formNo: yup.string().required("Form Train No Required"),
  stnReleasedDate: yup.string().required("Stn Released Date Required"),

});

const Stns = () => {
  const { currentUser } = useContext(AuthContext);

  const [line, setLine] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterByLine, setfilterByLine] = useState("");
  const [filterderData, setFilteredData] = useState([]);
  const [loadingInsertStns, setLoadingInsertStns] = useState(false);
  const [file, setFile] = useState(null);
  const [downloardableUrl, setDownloardableUrl] = useState(null);
  const [linesFromDb, setlinesFromDb] = useState([]);
  const [lineDetail, setLineDetail] = useState(null);
  const [uploadingPers, setUploadingPers] = useState(null);
  const [loadingLineToSelect, setLoadingLineToSelect] = useState(false);
  const [trainDetail, setTrainDetail] = useState(null);
  const [train, setTrain] = useState(null);
  const [trainFromDb, setTrainFromDb] = useState([]);
  const [loadingTrainToSelect, setLoadingTrainToSelect] = useState(false);


  const navigate = useNavigate();
  const handleChangeLine = (e) => {
    setLine(e.target.value);
  };
  const handleChangeTrain = (e) => {
    setTrain(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleChangefilterByLine = (event) => {
    setfilterByLine(event.target.value);
  };
  //fetch Trains

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "stns"));
        querySnapshot.forEach((doc) => {
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
              dt.trainNo.toLowerCase().includes(search.toLowerCase())
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
        const optionsRef = collection(db, "stns");
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
      const querySnapshot = await getDocs(collection(db, "stns"));
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
      setFilteredData(list);
    } catch (err) {
      console.log(err);
    }
  };

  const addStn = async (values, resetForm) => {
    setLoadingInsertStns(true);
    const { stnNo, formNo,stnReleasedDate } = values;

    //check Train No is Unique
    const qTrainNo = query(
      collection(db, "stns"),
      where("trainNo", "==", trainDetail?.trainNo)
    );
    const querySnapshotTrainNo = await getDocs(qTrainNo);
    const countTrain = querySnapshotTrainNo.size;
    if (train === "") {
      alert("Please Select Train");
    } else if (file === null) {
      alert("Please Select Stn Image");
    } else if (countTrain > 0) {
      alert("STN Available for This Train Number");
    }
    else {
      try {
        const docRef = await addDoc(collection(db, "stns"), {
          stnNo: stnNo,
          trainNo: trainDetail?.trainNo,
          stAt: trainDetail?.stPlace,
          stTime: trainDetail?.stTime,
          destPlace: trainDetail?.destPlace,
          destTime: trainDetail?.destTime,
          line: trainDetail.line,
          lineNo: trainDetail.lineNo,
          formTrainNo: formNo,
          stnReleasedDate : stnReleasedDate,
          stnImage: downloardableUrl,
          like:[],
          timeStamp: serverTimestamp(),
        });
        resetForm((values = ""));
        handleClose();
        fetchData();
        setOpenSnackbar(true);
        setDownloardableUrl(null);
        setTrainDetail(null);
        //create notification function stnNo pass to function
        createNotificationFunction(stnNo, docRef?.id);
      } catch (err) {
        console.log(err);
      }
    }
    setLoadingInsertStns(false);
  };

  //create Notification function

  const createNotificationFunction = async (stnNo,stnId) => {
    try {
     await addDoc(collection(db, "Notification"), {
        title: trainDetail?.trainNo ,
        description: `Created a New Stn for Train No ${trainDetail?.trainNo} From STN No ${stnNo}`,
        createdBy: currentUser?.nameWithIn,
        stnId : stnId,
        view: [],
        timeStamp: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    }
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
      const storageRef = ref(storage, `StnImages/${name}`);

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
        setlinesFromDb(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLineToSelectBox();
  }, []);

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

  //fetch tain to select box

  useEffect(() => {
    const fetchTrainToSelectBox = async () => {
      let list = [];
      try {
      //  const querySnapshot = await getDocs(collection(db, "trains"), orderBy("trainNo", "desc"));
       
      const optionsRef = collection(db, "trains");
      const q = query(optionsRef, orderBy("trainNo", "asc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setTrainFromDb(list);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrainToSelectBox();
  }, []);

  //Train details From Db
  useEffect(() => {
    const fetchTrainToSelect = async () => {
      setLoadingLineToSelect(true);
      if (train === "") {
        setTrainDetail(null);
      } else {
        const docRef = doc(db, "trains", train);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTrainDetail(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      setLoadingLineToSelect(false);
    };
    fetchTrainToSelect();
  }, [train]);

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp.toDate();
    //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  dayjs.extend(relativeTime);

  const handleView = (id) => {
    // navigate("/", { state: { id: id} });
    navigate(`/stn/${id}`);
  };

  const [loadValue, setLoadValue] = useState(30);
  const loadMore = () => {
    setLoadValue((prevValue) => prevValue + 30);
  };
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
                Manage Stns
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
                  placeholder="Search By Train No"
                  onChange={handleSearchChange}
                />
                Line
                <Select
                  size="small"
                  value={filterByLine}
                  onChange={handleChangefilterByLine}
                >
                  <MenuItem value="">Select Line</MenuItem>
                  {linesFromDb.map((li) => (
                    <MenuItem value={li?.lineNo} key={li.id}>
                      {li?.lineName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="contained"
                  endIcon={<AddCircleIcon />}
                  onClick={() => handleOpen()}
                >
                  Add Stns
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
                        <TableCell align="center">Train No</TableCell>
                        <TableCell align="center">Stn No</TableCell>
                        <TableCell align="center">Line</TableCell>
                        <TableCell align="center">Start At</TableCell>
                        <TableCell align="center">Destination</TableCell>
                        <TableCell align="center">Updated At</TableCell>
                        <TableCell align="center">Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterderData.slice(0, loadValue).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row?.trainNo}</TableCell>
                          <TableCell>{row?.stnNo}</TableCell>

                          <TableCell align="center">{row?.line}</TableCell>
                          <TableCell align="center">
                            {row?.stTime} -{row?.stAt}
                          </TableCell>
                          <TableCell align="center">
                            {row?.destTime} -{row?.destPlace}{" "}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={style.pending}>
                              {convertDate(row?.timeStamp)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box>
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleView(row?.id)}
                              >
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
          {filterderData.length > 0 && (
            <Stack
              sx={{
                justifyContent: "center",
                marginBottom: 2,
                alignItems: "center",
              }}
            >
              <Box sx={style.loadMoreContainer}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={loadMore}
                >
                  Load More
                </Button>
              </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Formik
        initialValues={{
          stnNo: "",
          formNo: "",
          stnReleasedDate : ""
        }}
        validateOnMount={true}
        // onSubmit={(values, {resetForm})=>{
        //   addTrain(values);
        //   resetForm(values= "")
        // }}
        onSubmit={(values, { resetForm }) => addStn(values, resetForm)}
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
                Add Stn
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
                      Select Train
                    </InputLabel>
                    <Select
                      value={train}
                      onChange={handleChangeTrain}
                      label="Select Train"
                      inputProps={{ "aria-label": "Without label" }}
                      size="small"
                      autoWidth
                    >
                      <MenuItem value="">Select Line</MenuItem>
                      {trainFromDb.map((tr) => (
                        <MenuItem value={tr?.id} key={tr.id}>
                          {tr?.trainNo}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  {loadingTrainToSelect ? (
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
                    trainDetail && (
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
                            Line No - {trainDetail?.lineNo}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            Line Name - {trainDetail?.line}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            Start At - {trainDetail?.stPlace}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            Destination At -{trainDetail?.destPlace}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  )}

                  <div>
                    <TextField
                      label="Form Train No"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("formNo")}
                      onBlur={handleBlur("formNo")}
                      value={values.formNo}
                    />
                    {errors.formNo && touched.formNo ? (
                      <Typography style={style.errorMsg}>
                        {errors.formNo}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      label="Stn No"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("stnNo")}
                      onBlur={handleBlur("stnNo")}
                      value={values.stnNo}
                    />
                    {errors.stnNo && touched.stnNo ? (
                      <Typography style={style.errorMsg}>
                        {errors.stnNo}
                      </Typography>
                    ) : null}
                  </div>
                  <div className="stn-released-date">
                      <Box>

                      </Box>
                    
                   
                    <TextField
                      label="STN Released Date"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("stnReleasedDate")}
                      onBlur={handleBlur("stnReleasedDate")}
                      value={values.stnReleasedDate}
                    />
                    {errors.stnReleasedDate && touched.stnReleasedDate ? (
                      <Typography style={style.errorMsg}>
                        {errors.stnReleasedDate}
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
                {loadingInsertStns ? (
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
                    Add stn
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
          Successfully Added STN to database !
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
    justifyContent: "center",
  },
};
export default Stns;
