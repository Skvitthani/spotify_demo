import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const RecentPlayCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("Info", { item: item })}
    >
      <Image
        style={styles.songImageStyle}
        source={{ uri: item?.track?.album?.images[0]?.url }}
      />
      <Text numberOfLines={1} style={styles.songName}>
        {item?.track?.name}
      </Text>
    </TouchableOpacity>
  );
};

export default RecentPlayCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  songName: {
    fontSize: 13,
    marginTop: 10,
    color: "white",
    fontWeight: "500",
  },
  songImageStyle: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
});
