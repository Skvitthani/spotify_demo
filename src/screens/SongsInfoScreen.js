import {
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import PlayTrack from "../components/PlayTrack";
import { fetchSongs } from "../services/APIAction";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SongsInfoScreen = ({ route, navigation }) => {
  const item = route.params.item;
  const albumUrl = item?.track?.album?.uri;
  const albumId = albumUrl.split(":")[2];

  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const request = {
        token: accessToken,
        albumId: albumId,
      };

      const songs = await fetchSongs(request);
      setTracks(songs);
    })();
  }, []);
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ flexDirection: "row", padding: 12 }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="white"
          />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image
              style={{ width: 200, height: 200 }}
              source={{ uri: item?.track?.album?.images[0].url }}
            />
          </View>
        </View>
        <Text style={styles.trackName}>{item?.track?.name}</Text>
        <View style={styles.songsName}>
          {item?.track?.artists?.map((item, index) => (
            <Text style={styles.songTextStyle}>{item.name}</Text>
          ))}
        </View>
        <PlayTrack />
        <View>
          <View style={{ marginTop: 10, marginHorizontal: 12 }}>
            {tracks?.map((track, index) => (
              <Pressable style={styles.songListView}>
                <View>
                  <Text style={styles.trackName}>{track?.name}</Text>
                  <View style={styles.artistsNameView}>
                    {track?.artists?.map((item, index) => (
                      <Text style={styles.artistsNameText}>{item?.name}</Text>
                    ))}
                  </View>
                </View>
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default SongsInfoScreen;

const styles = StyleSheet.create({
  trackName: {
    fontSize: 22,
    marginTop: 10,
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  songsName: {
    gap: 7,
    marginTop: 10,
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 12,
  },
  songTextStyle: {
    fontSize: 13,
    color: "#909090",
    fontWeight: "500",
  },
  songListView: {
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trackName: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  artistsNameView: {
    gap: 8,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  artistsNameText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },
});
