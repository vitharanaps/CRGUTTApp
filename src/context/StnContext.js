import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const StnContext = createContext({});

const StnContextProvider = ({ children }) => {
  const { userInfo } = useAuthContext();
const [onLikeClicked, setOnLikeClicked] = useState(false);
const [countFavorite, setCountFavorite]= useState(0);
 
  const [allStn, setNewStn] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [countSaved, setCountSaved] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        setLoading(true);

        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setNewStn(list);
        setLoading(false);

        // setFilteredData(list)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      try {
        setLoading(true);

        const optionsRef = collection(db, "stns");
        const q = query(optionsRef, orderBy("timeStamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setNewStn(list);
        setLoading(false);

        // setFilteredData(list)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [onLikeClicked]);
  //Filter Stn

  useEffect(() => {
    // if (!searchText) {
    //   return;
    // }
    const filterSearch = () => {
      setLoading(true);

      setFilteredData(
        search === ""
          ? allStn
          : allStn?.filter((dt) =>
              dt.trainNo.toLowerCase().includes(search.toLowerCase())
            )
      );
      setLoading(false);
    };
    filterSearch();
  }, [allStn, onLikeClicked]);

  useEffect(() => {
    const filterSearch = () => {
      setLoading(true);
      setFilteredData(
        search === ""
          ? allStn
          : allStn?.filter((dt) =>
              dt.trainNo.toLowerCase().includes(search.toLowerCase())
            )
      );
      setLoading(false);
    };
    filterSearch();
  }, [search]);

  //end of page stn

  const onLikePress = async (item) => {
    let tempLike = item.like;
    if (tempLike.length > 0) {
      tempLike.map((item1) => {
        if (item1 == userInfo.uid) {
          const index = tempLike.indexOf(item1);
          if (index > -1) {
            tempLike.splice(index, 1);
          }
        } else {
          tempLike.push(userInfo.uid);
        }
      });
    } else {
      tempLike.push(userInfo.uid);
    }
    const stnRef = doc(db, "stns", item?.id);
    await updateDoc(stnRef, {
      like: tempLike,
    })
      .then(() => {
        console.log("added to favorite");
      })
      .catch((err) => {
        console.log(err);
      });
      //Refetch data after clicking on like
      setOnLikeClicked(!onLikeClicked);
  };

//get favorite count

useEffect(() => {
  const fetchData = async () => {
    let list = [];
    try {
      setLoading(true);

      const optionsRef = collection(db, "stns");
      const q = query(optionsRef, orderBy("timeStamp", "desc"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        doc.data().like.map((item) => {
          if (item === userInfo?.uid) {
            list.push({ id: doc.id, ...doc.data() });
          }
        });
      });
      setCountSaved(list);
      setLoading(false);

      // setFilteredData(list)
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();
}, []);

useEffect(() => {
  const fetchData = async () => {
    let list = [];
    try {
      setLoading(true);

      const optionsRef = collection(db, "stns");
      const q = query(optionsRef, orderBy("timeStamp", "desc"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        doc.data().like.map((item) => {
          if (item === userInfo?.uid) {
            list.push({ id: doc.id, ...doc.data() });
          }
        });
      });
      setCountSaved(list);
      setLoading(false);

      // setFilteredData(list)
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();
}, [onLikeClicked]);

useEffect(() => {
setCountFavorite(countSaved.length)
}, [countSaved])


//get favorite  count end

  return (
    <StnContext.Provider
      value={{ onLikePress,onLikeClicked,countFavorite, setCountFavorite, search, setSearch,filteredData, loading }}
    >
      {children}
    </StnContext.Provider>
  );
};
export default StnContextProvider;
export const useStnContext = () => useContext(StnContext);
