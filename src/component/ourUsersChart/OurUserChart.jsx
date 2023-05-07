import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { async } from "@firebase/util";
import { Box } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

function OurUserChart() {
  const [homeStationFromDb, setHomeStationFromDb] = useState([]);
  const [userCountByStation,setUserCountByStation] = useState([]);
  useEffect(() => {
    const getHomeStations = async () => {
      let listOfHomeStation = [];
      try {
        const querySnapshot = await getDocs(collection(db, "homeStation"));
        querySnapshot.forEach((doc) => {
          listOfHomeStation.push({ ...doc.data() });
        });
        setHomeStationFromDb(listOfHomeStation);
      } catch (err) {
        console.log(err);
      }
    };
    getHomeStations();
  }, []);

  // Count Of Home Station Users
  useEffect(() => {
    let count = [];
    const getUserCountByHomeStation = async (homeStation) => {
      const q = query(
        collection(db, "users"),
        where("homeStation", "==", homeStation)
      );
      const querySnapShotsUsersCount = await getDocs(q);
      count.push(querySnapShotsUsersCount.size);
    
     setUserCountByStation(count)
    };

    for (let index = 0; index < homeStationFromDb.length; index++) {
      getUserCountByHomeStation(homeStationFromDb[index].hStationName);
    }
  }, [homeStationFromDb]);
  const data = {
    labels: homeStationFromDb.map((homeSt) => homeSt?.hStationName),
    datasets: [
      {
        label: "# of Users",
        data: userCountByStation,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(142, 97, 51, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // //
  // for (let index = 0; index < homeStationFromDb.length; index++) {
  //   const element = homeStationFromDb[index]?.name;
  //  console.log(element)
  // }
  return(
  <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
  <Doughnut data={data} />;

  </Box> 
  )
}

export default OurUserChart;
