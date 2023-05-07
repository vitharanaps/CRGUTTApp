import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import Person4Icon from "@mui/icons-material/Person4";
import TrainIcon from "@mui/icons-material/Train";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useLocation } from "react-router-dom";
import TrafficIcon from "@mui/icons-material/Traffic";
import { AuthContext } from "../../context/AuthContext";


const SideBar = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const { dispatch } = useContext(AuthContext);


  return (
    <Box sx={style.container} position="static">
      <Box sx={style.sideBarContainer}>
        <Typography color="#434242" sx={style.title}>
          Admin Panel
        </Typography>
        <Divider />

        <Typography
          variant="body2"
          color="lightgray"
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
            fontWeight: "500",
            color: "gray",
          }}
        >
          MAIN
        </Typography>
        <Divider />

        <List component="nav" aria-label="main mailbox folders">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === ""
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link to="/stn" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === "stn"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="STNs" />
            </ListItemButton>
          </Link>
          <Link
            to="/signals"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItemButton
              sx={
                path === "signals"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <TrafficIcon />
              </ListItemIcon>
              <ListItemText primary="Signals" />
            </ListItemButton>
          </Link>
          <Link to="/user" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === "user"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <Person4Icon />
              </ListItemIcon>
              <ListItemText primary="User" />
            </ListItemButton>
          </Link>
        </List>

        <Divider />
        <Box sx={{ flexGrow: 1 }} />

        <Divider />

        <Typography
          variant="body2"
          color="lightgray"
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
            fontWeight: "500",
            color: "gray",
          }}
        >
          SETTINGS
        </Typography>
        <Divider />
        <List>
          <Link to="/trains" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === "trains"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <TrainIcon />
              </ListItemIcon>
              <ListItemText primary="Train" />
            </ListItemButton>
          </Link>
          <Link to="/lines" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === "lines"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <AddRoadIcon />
              </ListItemIcon>
              <ListItemText primary="Lines" />
            </ListItemButton>
          </Link>
          <Link to="/homeStation" style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton
              sx={
                path === "homeStation"
                  ? style.listButtonStyleActive
                  : style.listButtonStyle
              }
            >
              <ListItemIcon>
                <AddRoadIcon />
              </ListItemIcon>
              <ListItemText primary="Home Station" />
            </ListItemButton>
          </Link>
        </List>

        <Divider />

        <Typography
          variant="body2"
          color="lightgray"
          sx={{
            paddingTop: 1,
            paddingBottom: 1,
            fontWeight: "500",
            color: "gray",
          }}
        >
          SYSTEM
        </Typography>
        <Divider />
        <List >
          <ListItemButton sx={style.listButtonStyle} onClick={()=> dispatch({ type: "LOGOUT" })} >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};

/** @type {import("@mui/material").SxProps}*/
const style = {
  container: {
    paddingTop: "5rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    borderRight: "1px solid #c9c8c8",
    minHeight: "100vh",
  },
  title: {
    fontSize: 20,
    paddingBottom: 3,
  },
  listButtonStyle: {
    borderRadius: 1,
    "&:hover": {
      color: "#fff",
      backgroundColor: "#7BA6FC",
    },
  },
  listButtonStyleActive: {
    color: "#fff",
    backgroundColor: "#7BA6FC",
    borderRadius: 1,
    "&:hover": {
      color: "#fff",
      backgroundColor: "#7BA6FC",
    },
  },
  sideBarContainer: {
    backgroundColor: "#fff",
    padding: 3,
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
  },
};

export default SideBar;
