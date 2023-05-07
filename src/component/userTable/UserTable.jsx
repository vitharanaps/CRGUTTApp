import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const columns = [
  { field: "idNo", headerName: "ID", width: 150 },
  {
    field: "nameWithIn",
    headerName: "Name With Initials",
    width: 150,
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt="Avatar"
            src={params.row.profileImage}
            sx={{ marginRight: "15px" }}
          />
          {params.row.nameWithIn}
        </Box>
      );
    },
  },
  {
    field: "mobileNo1",
    headerName: "Mobile No",
    type: "number",
    width: 150,
  },
  {
    field: "homeStation",
    headerName: "Home Station",
    width: 125,
    alignItems: "center",
  },
  {
    field: "isConfirm",
    headerName: "Status",
    width: 150,
    renderCell: (params) => {
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {params.row.isConfirm === true ? (
            <Typography variant="body2" sx={style.active}>
              {" "}
              Approved
            </Typography>
          ) : (
            <Typography variant="body2" sx={style.pending}>
              {" "}
              Pending
            </Typography>
          )}
        </Box>
      );
      // console.log(params.row.isConfirm)
    },
  },
  { field: "role", headerName: "User Role", width: 150 },
];

const UserTable = ( {userData}) => {



  const navigate = useNavigate();
  const actionColumn = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={() => handleView(params.row.id)}
            >
              {" "}
              View{" "}
            </Button>
            {/* <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              {" "}
              Delete{" "}
            </Button> */}
          </Box>
        );
      },
    },
  ];
  const handleView = (id) => {
   // navigate("/", { state: { id: id} });
   navigate(`/user/${id}`)
  };
  const handleDelete = (id)=>{

  }
  return (
    <Box sx={style.dataGrid}>
      <DataGrid
        rows={userData}
        columns={columns.concat(actionColumn)}
        pageSize={1}
        rowsPerPageOptions={[1]}
        // checkboxSelection
      />
    </Box>
  );
};

/** @type {import("@mui/material").SxProps}*/
const style = {
  dataGrid: {
    height: 500,
    width: "100%",
  },

  active: {
    backgroundColor: "#D7FBC8",
    padding: "2px",
    borderRadius: "5px",
    color: "#1f6c00f1",
  },
  pending: {
    backgroundColor: "#f4590628",
    padding: "2px",
    borderRadius: "5px",
    color: "#ee8411eb",
  },
};
export default UserTable;
