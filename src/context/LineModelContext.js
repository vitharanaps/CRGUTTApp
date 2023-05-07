import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../firebase";

const LineModelContext =createContext({});

const LineModelContextProvider =({children}) => {
    const [lineId, setLineId]= useState(null)
    const [line, setLine] = useState(null)
   // const [lineDetails, setLineDetails] = useState(null);

    const [lineName, setLineName]= useState(null)


return(
        <LineModelContext.Provider value={{ lineId, setLine,lineName, setLineName, line, setLineId }}>
            {children}
        </LineModelContext.Provider>
    )
}
export default LineModelContextProvider;
export const useLineModelContext = () =>useContext(LineModelContext)