import {
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRef } from "react";
import { Audio } from "expo-av";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import SongItem from "../components/SongItem";
import { AntDesign } from "@expo/vector-icons";
import { Player } from "../components/Context";
import PlayTrack from "../components/PlayTrack";
import { LinearGradient } from "expo-linear-gradient";
import { getSavedTracks } from "../services/APIAction";
import { Feather, FontAwesome } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { BottomModal, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LikedSongsScreen = ({ navigation }) => {
  const value = useRef(0);
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const [searchValue, setSearchValue] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSounds, setCurrentSounds] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const request = {
        token: accessToken,
      };

      const likedSongs = await getSavedTracks(request);
      setSavedTracks(likedSongs);
    })();
  }, []);

  const onPlayPress = async () => {
    if (savedTracks?.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
    await play(savedTracks[0]);
  };

  const play = async (nextTrack) => {
    const preview_url = nextTrack?.track?.preview_url;
    try {
      if (currentSounds) {
        await currentSounds.stopAsync();
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: preview_url,
        },
        { shouldPlay: true, isLooping: false },
        onPlayBackStatusUpdate
      );
      onPlayBackStatusUpdate(status);
      setCurrentSounds(sound);
      setIsPlaying(status.isLoaded);
    } catch (error) {
      console.log("error ::", error);
    }
  };
  const onPlayBackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      setProgress(progress);
      setCurrentTime(status.positionMillis);
      setTotalDuration(status.durationMillis);
    }
    if (status.didJustFinish === true) {
      setCurrentSounds(null);
      playNextTrack();
    }
  };

  const handlePlayPause = async () => {
    if (currentSounds) {
      if (isPlaying) {
        await currentSounds.pauseAsync();
      } else {
        await currentSounds.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const circleSize = 12;
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const playNextTrack = async () => {
    if (currentSounds) {
      await currentSounds.stopAsync();
      setCurrentSounds(null);
    }
    value.current += 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      //   extractColors();
      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };
  const playPreviosTrack = async () => {
    if (currentSounds) {
      await currentSounds.stopAsync();
      setCurrentSounds(null);
    }
    value.current -= 1;
    if (value.current < savedTracks.length) {
      const nextTrack = savedTracks[value.current];
      setCurrentTrack(nextTrack);
      await play(nextTrack);
    } else {
      console.log("end of playlist");
    }
  };
  return (
    <>
      <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, marginTop: 50 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.topMainView}>
            <TouchableOpacity style={styles.serachBarView}>
              <AntDesign name="search1" size={20} color="white" />
              <TextInput
                value={searchValue}
                placeholder="Find In Liked Songs"
                placeholderTextColor={"white"}
                onChangeText={(txt) => setSearchValue(txt)}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButtonView}>
              <Text style={{ color: "white" }}>Sort</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 50 }} />
          <Text style={styles.likedText}>Liked Songs</Text>
          <Text style={styles.songsCount}>430 Songs</Text>

          <PlayTrack onPlayPress={onPlayPress} />
          <FlatList
            data={savedTracks}
            renderItem={({ item }) => (
              <SongItem
                item={item}
                onPress={play}
                isPlaying={item === currentTrack}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={styles.bottomPressableView}
        >
          <View style={styles.imageAndTextView}>
            <Image
              source={{ uri: currentTrack?.track?.album?.images[0]?.url }}
              style={{ height: 40, width: 40 }}
            />
            <Text numberOfLines={1} style={styles.bottomTextView}>
              {currentTrack?.track?.name} •{" "}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>
          <View style={styles.bottomLikeButtomView}>
            <AntDesign name="heart" size={24} color="#1DB954 " />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
      >
        <ModalContent style={styles.modalContentstyle}>
          <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
            <Pressable style={styles.modalPressableStyle}>
              <AntDesign
                onPress={() => setModalVisible(!modalVisible)}
                name="down"
                size={24}
                color="white"
              />

              <Text style={styles.modalSongNameStyle}>
                {currentTrack?.track?.name}
              </Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>
            <View style={{ height: 70 }} />
            <View style={{ padding: 10 }}>
              <Image
                source={{ uri: currentTrack?.track?.album?.images[0]?.url }}
                style={{ height: 400, width: "100%" }}
              />
              <View style={styles.modelSongAndArtistStyle}>
                <View>
                  <Text style={[styles.modalSongNameStyle, { fontSize: 18 }]}>
                    {currentTrack?.track?.name}
                  </Text>
                  <Text style={styles.modelArtistName}>
                    {currentTrack?.track?.artists[0]?.name}
                  </Text>
                </View>
                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>
              <View style={{ marginTop: 10 }}>
                <View style={styles.progressBarMainView}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${progress * 100}%` },
                    ]}
                  />
                  <View
                    style={[
                      {
                        position: "absolute",
                        top: -5,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: "white",
                      },
                      {
                        left: `${progress * 100}%`,
                        marginLeft: -circleSize / 2,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.songsDurationCountViewStyle}>
                <Text style={styles.SongDurationCount}>
                  {formatTime(currentTime)}
                </Text>
                <Text style={styles.SongDurationCount}>
                  {" "}
                  {formatTime(totalDuration)}
                </Text>
              </View>
            </View>
            <View style={styles.playPauseContainerView}>
              <Pressable>
                <FontAwesome name="arrows" size={30} color="#03C03C" />
              </Pressable>
              <Pressable onPress={playPreviosTrack}>
                <Ionicons name="play-skip-back" size={30} color="white" />
              </Pressable>
              <Pressable>
                {isPlaying ? (
                  <AntDesign
                    name="pausecircle"
                    size={60}
                    color="white"
                    onPress={handlePlayPause}
                  />
                ) : (
                  <Pressable
                    style={styles.playButtonstyle}
                    onPress={handlePlayPause}
                  >
                    <Entypo name="controller-play" size={26} color="black" />
                  </Pressable>
                )}
              </Pressable>
              <Pressable onPress={playNextTrack}>
                <Ionicons name="play-skip-forward" size={30} color="white" />
              </Pressable>
              <Pressable>
                <Feather name="repeat" size={30} color="#03C03C" />
              </Pressable>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  topMainView: {
    marginTop: 9,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    justifyContent: "space-between",
  },
  serachBarView: {
    flex: 1,
    gap: 10,
    padding: 9,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#42275a",
  },
  sortButtonView: {
    padding: 9,
    height: 38,
    marginHorizontal: 10,
    justifyContent: "center",
    backgroundColor: "#42275a",
  },
  likedText: {
    fontSize: 20,
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
  },
  songsCount: {
    color: "white",
    marginLeft: 10,
    fontSize: 13,
  },
  bottomPressableView: {
    gap: 10,
    left: 20,
    bottom: 10,
    padding: 10,
    width: "90%",
    marginBottom: 15,
    marginLeft: "auto",
    marginRight: "auto",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5072A7",
    justifyContent: "space-between",
  },
  imageAndTextView: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomTextView: {
    width: 220,
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
  },
  bottomLikeButtomView: {
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  modalContentstyle: {
    height: "100%",
    width: "100%",
    backgroundColor: "#5072A7",
  },
  modalSongNameStyle: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  modalPressableStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modelSongAndArtistStyle: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modelArtistName: {
    marginTop: 4,
    fontWeight: "bold",
    color: "#D3D3D3",
  },
  playPauseContainerView: {
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButtonstyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  SongDurationCount: {
    fontSize: 15,
    color: "#D3D3D3",
  },
  songsDurationCountViewStyle: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
  progressBarMainView: {
    height: 3,
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: "gray",
  },
});
