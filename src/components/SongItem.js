import React from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Player } from "./Context";
import { useContext } from "react";

const SongItem = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);

  const onSongsPress = () => {
    setCurrentTrack(item);
    onPress(item);
  };
  return (
    <Pressable style={styles.mainPressableStyle} onPress={onSongsPress}>
      <Image
        source={{ uri: item?.track?.album?.images[0]?.url }}
        style={styles.songImageStyle}
      />
      <View style={styles.textViewStyle}>
        <Text
          numberOfLines={1}
          style={[
            styles.trackNameStyle,
            { color: isPlaying ? "#3FFF00" : "white" },
          ]}
        >
          {item?.track?.name}
        </Text>
        <Text style={styles.artistsNameStyle}>
          {item?.track?.artists[0]?.name}
        </Text>
      </View>
      <View style={styles.imageViewStyle}>
        <AntDesign name="heart" size={24} color="#1DB954" />
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({
  songImageStyle: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  mainPressableStyle: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textViewStyle: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  trackNameStyle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  artistsNameStyle: {
    marginTop: 4,
    color: "#989898",
  },
  imageViewStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
});
