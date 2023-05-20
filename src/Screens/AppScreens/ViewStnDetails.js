import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ImageViewer from "react-native-image-zoom-viewer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Feather } from "react-native-vector-icons";
import { useTheme } from "../../theme/ThemeProvider";

const ViewStnDetails = () => {
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const stnId = route?.params?.stnId;
  const trainNo = route?.params?.trainNo;
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stnDetails, setStnDetails] = useState([]);

  useEffect(() => {
    navigation.setOptions({ title: "Train No" + " " + trainNo });
  }, [stnId]);

  //get stn details by stnId

  useEffect(() => {
    setLoading(true);

    if (stnId) {
      async function fetchData() {
        const docRef = doc(db, "stns", stnId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStnDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      fetchData();
      setLoading(false);
    }
  }, [stnId]);

  const convertDate = (timeStamp) => {
    const convertedDate = timeStamp?.toDate();
    // const formatedDate = format(convertedDate, 'yyyy/MM/dd')
    return dayjs(convertedDate).fromNow(true);
  };

  dayjs.extend(relativeTime);

  const images = [
    {
      url: stnDetails?.stnImage,
      props: {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <View
        style={{
          backgroundColor: colors.secondary,
          padding: 15,
          borderRadius: 10,
          gap: 5,

          //  height: scrHeight*0.60,
          marginVertical: 18,
          ...styles.shadow,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            // justifyContent: "",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>Start At </Text>
          <Text style={styles.stnDetailsTextRight}>
            {" "}
            {stnDetails?.stAt} - {stnDetails?.stTime}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            // justifyContent: "space-around",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>Destination </Text>
          <Text style={styles.stnDetailsTextRight}>
            {stnDetails?.destPlace} - {stnDetails?.destTime}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            // justifyContent: "space-around",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>STN No</Text>
          <Text style={styles.stnDetailsTextRight}> {stnDetails?.stnNo}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            //     justifyContent: "space-around",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>STN Date </Text>
          <Text style={styles.stnDetailsTextRight}>
            {" "}
            {
            stnDetails?.stnReleasedDate
            }
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            //     justifyContent: "space-around",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>Form No </Text>
          <Text style={styles.stnDetailsTextRight}>
            {" "}
            {stnDetails?.formTrainNo  }
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            //     justifyContent: "space-around",
            paddingVertical: 5,
          }}
        >
          <Text style={styles.stnDetailsText}>Updated At </Text>
          <Text style={styles.stnDetailsTextRight}>
            {" "}
            {convertDate(stnDetails?.timeStamp)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setModalOpen(true)}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          gap: 5,

          //  height: scrHeight*0.60,
          ...styles.shadow,
        }}
      >
        <Image
          source={{
            uri: stnDetails?.stnImage,
          }}
          style={{ width: "100%", aspectRatio: 4 / 3 }}
        />
      </TouchableOpacity>
      <Modal 
      visible={modalOpen}
       transparent={true}
       onRequestClose={()=>setModalOpen(false)}>
        <TouchableOpacity
          onPress={() => setModalOpen(false)}
          style={{
            backgroundColor: "white",
            width: 50,
            height: 50,
            borderRadius: 50,
            position: "absolute",
            left: 30,
            top: 40,
            zIndex: 500,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name="arrow-left"
            style={{ fontSize: 30, fontWeight: "500" }}
          />
        </TouchableOpacity>
        <ImageViewer imageUrls={images} />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  shadow: {
    shadowColor: "#7F5Df0",
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  },
  stnDetailsText: {
    fontSize: 16,
    color: "gray",
  },
  stnDetailsTextRight: {
    marginLeft: "auto",
    fontSize: 16,
    color: "gray",
  },
});
export default ViewStnDetails;
