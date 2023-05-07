import { Box, Stack, Typography } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxix,
  YAxis,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../../component/navbar/Navbar";
import OurUserChart from "../../component/ourUsersChart/OurUserChart";
import SideBar from "../../component/sideBar/SideBar";
import Widgets from "../../component/widgets/Widgets";
import { db } from "../../firebase";



const Home = () => {

  
  return (
    <Box>
      <Navbar />
      <Box sx={style.container}>
        <Box sx={style.sideBar}>
          <SideBar />
        </Box>
        <Box sx={style.feeds}>
          <Stack>
            <Box sx={style.widgets}>
              <Widgets type ="user"/>
              <Widgets type ="stn"/>
              <Widgets type ="line"/>
              <Widgets type ="pending"/>
            </Box>
          </Stack>
          <Stack>
            <Box sx={style.widgets}>
              <Box sx={style.userChart}><OurUserChart /></Box>
              <Box sx={style.stnChart}></Box>
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
  sideBar: {
    flex: 1,
    height: 500,
  },
  feeds: {
    flex: 4,
    height: 500,
    paddingTop: 10,
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  widgets: {
    display: "flex",
    justifyContent: "space-between",
  },
  charts: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    gap: 1,
  },
  userChart: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 1,
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
    padding:3,
    alignItems:"center",
    justifyContent:"center"
  },
  stnChart: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 1,
    height: 400,
    boxShadow: "0px 23px 17px -14px rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
  },
};
export default Home;
