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
import { db } from "../../firebase";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useNavigate } from "react-router-dom";

const AddTrainSchema = yup.object().shape({
  trainNo: yup.string().required("Train No is Required"),
  stTime: yup.string().required("Start Time Required"),
  stPlace: yup.string().required("Start Place Required"),
  destPlace: yup.string().required("Destination is Required"),
  destTiime: yup.string().required("Arriavl Time is Required"),
});

const Trains = () => {
  const navigate= useNavigate()
  const [line, setLine] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterByLine, setFilterByLine] = useState("");
  const [filterderData, setFilteredData] = useState([]);
  const [loadingInsertTrains, setLoadingInsertTrains] = useState(false);
  const [loadingLineToSelect, setLoadingLineToSelect] = useState(false);
  const [lineDetail, setLineDetail] = useState(null);
  const [linesFromDb, setLinesFromDb] = useState([]);



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
        const querySnapshot = await getDocs(collection(db, "trains"));
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
        const optionsRef = collection(db, "trains");
        const q = query(
          optionsRef,
          filterByLine !== "" && where("line", "==", filterByLine)
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
    filterByOptions();
  }, [filterByLine]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Fetch train after subimit
  const fetchData = async () => {
    let list = [];
    try {
      const querySnapshot = await getDocs(collection(db, "trains"));
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

  const addTrain = async (values, resetForm) => {
    setLoadingInsertTrains(true);
    const { trainNo, stTime, stPlace, destPlace, destTiime } = values;

    //check Train No is Unique
    const qTrainNo = query(
      collection(db, "trains"),
      where("trainNo", "==", trainNo)
    );
    const querySnapshotTrainNo = await getDocs(qTrainNo);
    const countTrainNo = querySnapshotTrainNo.size;

    if (line === "") {
      alert("Please Select Line");
    } else {
      if (countTrainNo === 0) {
        try {
          const docRef = await addDoc(collection(db, "trains"), {
            trainNo: trainNo,
            line: lineDetail.lineName,
            stTime: stTime,
            stPlace: stPlace,
            destPlace: destPlace,
            destTime: destTiime,
            lineNo : lineDetail.lineNo,
            timeStamp: serverTimestamp(),
          });
          resetForm((values = ""));
          handleClose();
          fetchData();
          setOpenSnackbar(true);
        } catch (err) {
          console.log(err);
        }
      } else {
        alert("Train No Exists, Please Check train No");
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



  dayjs.extend(relativeTime)


  const convertDate = (timeStamp)=>{
    const convertedDate = timeStamp.toDate();
 //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
return dayjs(convertedDate).fromNow(true)
  }

  const handleView = (id) => {
    // navigate("/", { state: { id: id} });
    navigate(`/trains/${id}`)
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
                Manage Trains
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
                  Add Train
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

                        <TableCell align="center">Line</TableCell>
                        <TableCell align="center">Start At</TableCell>
                        <TableCell align="center">Destination</TableCell>
                        <TableCell align="center">Date Of Updated</TableCell>

                        <TableCell align="center">Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterderData.slice(0, loadValue).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row?.trainNo}</TableCell>
                          <TableCell>{row?.line}</TableCell>

                          <TableCell align="center">
                            {row?.stTime} - {row?.stPlace}
                          </TableCell>
                          <TableCell align="center">
                            {row?.destTime} - {row?.destPlace}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={style.pending}>
                              {convertDate(row?.timeStamp)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Box>
                              <Button variant="contained" color="success" onClick={()=> handleView(row?.id)}>
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
          trainNo: "",
          stTime: "",
          stPlace: "",
          destPlace: "",
          destTiime: "",
        }}
        validateOnMount={true}
        // onSubmit={(values, {resetForm})=>{
        //   addTrain(values);
        //   resetForm(values= "")
        // }}
        onSubmit={(values, { resetForm }) => addTrain(values, resetForm)}
        validationSchema={AddTrainSchema}
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
                Add Train
              </Typography>

              <Box sx={style.textInputWrapper}>
                <Box sx={style.leftSide}>
                  <div>
                    <TextField
                      label="Train No"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("trainNo")}
                      onBlur={handleBlur("trainNo")}
                      value={values.trainNo}
                    />
                    {errors.trainNo && touched.trainNo ? (
                      <Typography style={style.errorMsg}>
                        {errors.trainNo}
                      </Typography>
                    ) : null}
                  </div>
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
                      label="Line"
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
                  <Box>
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
                  </Box>
                </Box>
                <Box sx={style.rightSide}>
                  <div>
                    <TextField
                      label="Start Place"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("stPlace")}
                      onBlur={handleBlur("stPlace")}
                      value={values.stPlace}
                    />
                    {errors.stPlace && touched.stPlace ? (
                      <Typography style={style.errorMsg}>
                        {errors.stPlace}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      label="Start Time"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("stTime")}
                      onBlur={handleBlur("stTime")}
                      value={values.stTime}
                    />
                    {errors.stTime && touched.stTime ? (
                      <Typography style={style.errorMsg}>
                        {errors.stTime}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      label="Destination"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("destPlace")}
                      onBlur={handleBlur("destPlace")}
                      value={values.destPlace}
                    />
                    {errors.destPlace && touched.destPlace ? (
                      <Typography style={style.errorMsg}>
                        {errors.destPlace}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      label="Arriaval Time"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("destTiime")}
                      onBlur={handleBlur("destTiime")}
                      value={values.destTiime}
                    />
                    {errors.destTiime && touched.destTiime ? (
                      <Typography style={style.errorMsg}>
                        {errors.destTiime}
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
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Add Train
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
          Successfully Added Trains to our database !
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
    paddingTop:2,
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
export default Trains;
