import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { color } from "@mui/system";
import React from "react";
import "./userTableBasic.css";

const UserTableBasic = () => {
  const rows = [
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
      idNo: "1258458",
      nameWithIn: "P S Vitharana",
      HomeStation: "GLE",
      mobileNo: "0754668478",
      status: "Pending",
      userImg:
        "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
    },
    {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
      {
        idNo: "1258458",
        nameWithIn: "P S Vitharana",
        HomeStation: "GLE",
        mobileNo: "0754668478",
        status: "Pending",
        userImg:
          "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1752&q=80",
      },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell  align="center">ID No</TableCell>
              <TableCell sx={{width :"100px"}} align="center">Name With Initials</TableCell>
              <TableCell align="center">Home Station</TableCell>
              <TableCell align="center">Mobile Number</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.idNo}>
                <TableCell align="center">{row.idNo}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "150px",
                    }}
                  >
                    <img
                      src={row.userImg}
                      alt="userImage"
                      className="UserImage"
                    />{" "}
                    {row.nameWithIn}
                  </Box>
                </TableCell>

                <TableCell align="center">{row.HomeStation}</TableCell>
                <TableCell align="center">{row.mobileNo}</TableCell>
                <TableCell align="center">
                  <Typography variant="body2"  sx={style.pending}> {row?.status}</Typography>
                </TableCell>
                <TableCell align="center">

                    <Box>
                    <Button variant="contained" color="success"> View</Button>


                    </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
/** @type {import("@mui/material").SxProps}*/

const style = {
  active: {
    backgroundColor: "#D7FBC8",
    border: "1px solid #1f6c002f",
    padding: "2px",
    borderRadius:"5px",
    color:"#1f6c00f1",
  },
  pending: {
    backgroundColor: "#f4590628",
    border: "1px solid #ee8411eb",
    padding: "2px",
    borderRadius:"5px",
    color:"#ee8411eb",
  },
};

export default UserTableBasic;
