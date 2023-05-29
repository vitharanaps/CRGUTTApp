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
  
  const ErrorReport = () => {
    const navigate= useNavigate()
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterByErrorType, setFilterByErrorType] = useState("");
    const [filterderData, setFilteredData] = useState([]);
  const [errorTypesFromDb,setErrorTypesFromDb] = useState([])
  
    const handleChangeLine = (e) => {
     // setLine(e.target.value);
    };
  
    const handleSearchChange = (e) => {
      setSearch(e.target.value);
    };

    const handleChangeFilterByErrorType = (event) => {
      setFilterByErrorType(event.target.value);
    };
    //fetch Trains
  
    useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
          const querySnapshot = await getDocs(collection(db, "ErrorReport"));
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
                dt.errorDesc.toLowerCase().includes(search.toLowerCase())
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
          const optionsRef = collection(db, "ErrorReport");
          const q = query(
            optionsRef,
            filterByErrorType !== "" && where("errorType", "==", filterByErrorType)
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
    }, [filterByErrorType]);
  
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
  
  
  
    useEffect(() => {
      const fetchErrorTypesToSelectBox = async () => {
        let list = [];
        try {
          const querySnapshot = await getDocs(collection(db, "ErrorTypes"));
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setErrorTypesFromDb(list);
        } catch (err) {
          console.log(err);
        }
      };
      fetchErrorTypesToSelectBox();
    }, []);
  
  
  
    dayjs.extend(relativeTime)
  
  
    const convertDate = (timeStamp)=>{
      const convertedDate = timeStamp.toDate();
   //   const formatedDate = format(convertedDate, 'yyyy/MM/dd')
  return dayjs(convertedDate).fromNow(true)
    }
  
    const handleView = (id) => {
      // navigate("/", { state: { id: id} });
      navigate(`/error/${id}`)
     };
     const [loadValue, setLoadValue] = useState(30)
     const loadMore = () =>{
      setLoadValue((prevValue)=> prevValue + 30)
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
                  Manage Errors
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
                  Error Types
                  <Select
                    size="small"
                    value={filterByErrorType}
                    onChange={handleChangeFilterByErrorType}
                  >
                  <MenuItem value="">Select Line</MenuItem>
                    {errorTypesFromDb.map((er) => (
                      <MenuItem value={er?.type} key={er.type}>
                       {er?.type} 
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
                          <TableCell align="center">Error Type</TableCell>
  
                          <TableCell align="center">Error Description</TableCell>
                          <TableCell align="center">User Name</TableCell>
                          <TableCell align="center">Date Of Updated</TableCell>
  
                          <TableCell align="center">Operations</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filterderData.slice(0, loadValue).map((row) => (
                          <TableRow key={row.id}>
                            <TableCell align="center">{row?.errorType}</TableCell>
                            <TableCell>{row?.errorDesc}</TableCell>
  
                            <TableCell align="center">
                               {row?.creator}
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
  export default ErrorReport;
  