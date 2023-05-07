import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Text,
  View,
  Dimensions,
  FlatList,
  Animated,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import LineFlatlist from "../../compo/LineFlatlist";
import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useLineModelContext } from "../../context/LineModelContext";
import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "../../theme/ThemeProvider";

const SignalsScreen = () => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const { colors } = useTheme();

  const { lineId, setLineId, setLine, line, lineName, setLineName } =
    useLineModelContext();
  const [loading, setLoading] = useState(false);
  const [loadingLine, setLoadingLine] = useState(false);

  const [signals, setSignals] = useState([]);
  const [signalType, setSignalType] = useState([]);
  const navigation = useNavigation();

  //get Signals For bottom Sheet
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let list = [];

      try {
        const optionsRef = collection(db, "signals");
        const q = query(optionsRef, where("lineNo", "==", lineId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });

          //    console.log(doc.id, " => ", doc.data());
        });
        setSignals(list);
      } catch (err) {
        //    console.log(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [lineId]);

  //get Lines For Signal Page
  useEffect(() => {
    const fetchData = async () => {
      setLoadingLine(true);

      let list = [];

      try {
        const optionsRef = collection(db, "lines");
        const q = query(optionsRef, orderBy("timeStamp"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });

          //    console.log(doc.id, " => ", doc.data());
        });
        setLine(list);
      } catch (err) {
        //    console.log(err);
      }
      setLoadingLine(false);
    };
    fetchData();
  }, []);

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["99%"];

  const handlePresentModal = (lineNo, lineName) => {
    setLineId(lineNo);
    setLineName(lineName);
    bottomSheetModalRef.current?.present();
  };

  //if navigate other page bottomtab will close
  useFocusEffect(
    React.useCallback(() => {
      return () => bottomSheetModalRef.current?.close();
    }, [])
  );
  return (
    <BottomSheetModalProvider>
      <View style={{ flex: 1 }}>
        {loadingLine ? (
          <View>
            <ActivityIndicator color="gray" size="large" />
          </View>
        ) : (
          <LinearGradient style={{ flex:1 }} colors={[colors.signalPageBack, "#fff"]}>
            <View
              style={{
                
                marginBottom: 120,
                marginHorizontal: 5,
                marginVertical: 10,
                alignItems: "center",
              }}
            >
              <FlatList
                data={line}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      handlePresentModal(item?.lineNo, item?.lineName)
                    }
                    style={{
                      width: (width * 46) / 100,
                      height: height / 4,
                      margin: 2,
                      borderColor: "white",
                      borderWidth: 5,
                      borderRadius: 15,
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                        marginTop: 20,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 50,
                          width: 80,
                          height: 80,
                          backgroundColor: "#fff",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 50,
                            alignSelf: "center",
                            fontWeight: "700",
                          }}
                        >
                          {item?.lineNo}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "700",
                          color: "#fff",
                        }}
                      >
                        {item?.lineName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                horizontal={false}
              />
            </View>
          </LinearGradient>
        )}
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        
      >
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
          <View
            style={{
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: StyleSheet.hairlineWidth,
              marginBottom: 15,
              borderColor: "gray",
              marginHorizontal: 15,
            }}
          >
            <FontAwesome5
              name="traffic-light"
              color="#748c94"
              size={25}
              style={{ marginBottom: 5 }}
            />
            <Text style={{ fontSize: 20, fontWeight: "700", marginLeft: 10 }}>
              {lineName}
            </Text>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 10,
            }}
          ></View>
          {loading ? (
            <View>
              <ActivityIndicator color="gray" size="large" />
            </View>
          ) : signals.length === 0 ? (
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 16, color: "red" }}>
                Signal Not Found
              </Text>
            </View>
          ) : (
            <FlatList
              data={signals}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 10,
                  }}
                  onPress={() =>
                    navigation.navigate("signalDetails", {
                      signalId: item?.id,
                      signalName: item?.signalName,
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      backgroundColor: colors.signalModelButton,
                      width: "80%",
                      borderRadius: 10,
                    }}
                  >
                    {/* <AntDesign name="caretup" size={25} color="#fff" /> */}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#fff",
                        marginLeft: 10,
                      }}
                    >
                      {item?.signalName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              horizontal={false}
            />
          )}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default SignalsScreen;
