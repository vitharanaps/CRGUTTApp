import { View, Text, FlatList, Dimensions, StyleSheet, Button } from "react-native";
import { useRef } from "react";
import { TouchableOpacity } from "@gorhom/bottom-sheet";


const LineFlatlist = () => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  
  return (

      <TouchableOpacity onPress={()=>handlePresentModal} style={{
        width: width * 46 / 100,
        height: height / 4,
        margin: 2,
        borderColor: "white",
        borderWidth: 5,
        borderRadius: 15
      }}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1, marginTop: 20 }} >
          <View style={{ borderRadius: 50, width: 80, height: 80, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 50, alignSelf: "center", fontWeight: "700" }}>{item?.id}</Text>

          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>{item?.name}</Text>
        </View>


        </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5Df0',
    shadowOffset: {
      height: 5,
      width: 0
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  }
})
export default LineFlatlist