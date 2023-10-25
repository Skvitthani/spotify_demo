import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const ArtistCard = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item?.images[0]?.url }}
        style={styles.artistImageStyle}
      />
      <Text style={styles.artistName}>{item?.name}</Text>
    </View>
  );
};

export default ArtistCard;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  artistName: {
    fontSize: 13,
    marginTop: 10,
    color: "white",
    fontWeight: "500",
  },
  artistImageStyle: {
    width: 130,
    height: 130,
    borderRadius: 5,
  },
});
