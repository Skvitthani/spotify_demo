import React from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
const PlayTrack = ({ onPlayPress }) => {
  return (
    <View style={styles.playButtonAndDwonArrowMainView}>
      <TouchableOpacity style={styles.downArrowView}>
        <AntDesign name="arrowdown" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.playButtonMainView}>
        <MaterialCommunityIcons
          name="cross-bolnisi"
          size={24}
          color="#1DB954"
        />
        <TouchableOpacity style={styles.playButtonView} onPress={onPlayPress}>
          <Entypo name="controller-play" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlayTrack;

const styles = StyleSheet.create({
  playButtonAndDwonArrowMainView: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  downArrowView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DB954",
  },
  playButtonMainView: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  playButtonView: {
    width: 60,
    height: 60,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1DB954",
  },
});
