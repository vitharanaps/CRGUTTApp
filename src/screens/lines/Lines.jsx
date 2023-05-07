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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../../component/navbar/Navbar";
import SideBar from "../../component/sideBar/SideBar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import * as yup from "yup";
import { Formik } from "formik";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const AddLineSchema = yup.object().shape({
  lineNo: yup.string().required("Line No is Required"),
  stPlace: yup.string().required("Start Place Required"),
  endPlace: yup.string().required("End is Required"),
  lineName: yup.string().required("Line Name is Required"),
});

const Lines = () => {
  //Modal

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loadingInsertLine, setLoadingInsertLine] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

const[loadValue, setLoadValue] =useState(2)

  const [filteredData, setFilteredData] = useState([]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // fetch Line And Filter

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "lines"));
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
              dt.lineName.toLowerCase().includes(search.toLowerCase())
            )
      );
    };
    filterSearch();
  }, [search]);

  //Fetch Line after submit
  const fetchData = async () => {
    let list = [];
    try {
      const querySnapshot = await getDocs(collection(db, "lines"));
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

  const addLine = async (values, resetForm) => {
    setLoadingInsertLine(true);
    const { lineNo, lineName, stPlace, endPlace } = values;

    //check Line No is Unique
    const qLineNo = query(
      collection(db, "lines"),
      where("lineNo", "==", lineNo)
    );
    const querySnapshotLineNo = await getDocs(qLineNo);
    const countLineNo = querySnapshotLineNo.size;

    if (countLineNo === 0) {
      try {
        const docRef = await addDoc(collection(db, "lines"), {
          lineNo: lineNo,
          lineName: lineName,
          stPlace: stPlace,
          endPlace: endPlace,
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
      alert("Line Exists, Please Check line No");
    }

    setLoadingInsertLine(false);
  };
  //Snack bar
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleView = (id) => {
    // navigate("/", { state: { id: id} });
    navigate(`/lines/${id}`);
  };

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
                Manage Lines
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
                  placeholder="Search By Line Name"
                  onChange={handleSearchChange}
                />
                {/*   Pending
                  <Select
                    size="small"
                    value={pending}
                    onChange={handleChangePending}
                  >
                    <MenuItem value="">Select Status</MenuItem>
  
                    <MenuItem value={true}>Yes</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
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
                  </Select> */}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="contained"
                  endIcon={<AddCircleIcon />}
                  onClick={handleOpen}
                >
                  Add Line
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
                        <TableCell align="center">Start At</TableCell>
                        <TableCell align="center">End</TableCell>

                        <TableCell align="center">Operations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.slice(0, loadValue).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="center">{row?.lineNo}</TableCell>
                          <TableCell align="center">{row?.lineName}</TableCell>

                          <TableCell align="center">{row?.stPlace}</TableCell>
                          <TableCell align="center">{row?.endPlace}</TableCell>

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
          {filteredData.length > 0 &&
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
          lineNo: "",
          LineName: "",
          stPlace: "",
          endPlace: "",
        }}
        validateOnMount={true}
        // onSubmit={(values, {resetForm})=>{
        //   addTrain(values);
        //   resetForm(values= "")
        // }}
        onSubmit={(values, { resetForm }) => addLine(values, resetForm)}
        validationSchema={AddLineSchema}
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
                Add Line
              </Typography>

              <Box sx={style.textInputWrapper}>
                <Box sx={style.leftSide}>
                  <div>
                    <TextField
                      label="Line No"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("lineNo")}
                      onBlur={handleBlur("lineNo")}
                      value={values.lineNo}
                    />
                    {errors.lineNo && touched.lineNo ? (
                      <Typography style={style.errorMsg}>
                        {errors.lineNo}
                      </Typography>
                    ) : null}
                  </div>
                  <div>
                    <TextField
                      label="Line Name"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("lineName")}
                      onBlur={handleBlur("lineName")}
                      value={values.lineName}
                    />
                    {errors.lineName && touched.lineName ? (
                      <Typography style={style.errorMsg}>
                        {errors.lineName}
                      </Typography>
                    ) : null}
                  </div>
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
                      label="End Place"
                      id="outlined-size-small"
                      size="small"
                      onChange={handleChange("endPlace")}
                      onBlur={handleBlur("endPlace")}
                      value={values.endPlace}
                    />
                    {errors.endPlace && touched.endPlace ? (
                      <Typography style={style.errorMsg}>
                        {errors.endPlace}
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
                {loadingInsertLine ? (
                  <CircularProgress color="success" />
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Add Line
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
          Successfully Added Line to our database !
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
    width: "30%",
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
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
};
export default Lines;
