import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getProfile,
  getTopItem,
  getRecentlyPlayedSongs,
} from "../services/APIAction";
import { AntDesign } from "@expo/vector-icons";
import ArtistCard from "../components/ArtistCard";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import RecentPlayCard from "../components/RecentPlayCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const request = {
        token: accessToken,
      };
      const profile = await getProfile(request);
      const getTopData = await getTopItem(request);
      const recentPlay = await getRecentlyPlayedSongs(request);
      setUserProfile(profile);
      setTopArtists(getTopData);
      setRecentlyPlayed(recentPlay);
    })();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.flatListMainView}>
        <Image
          style={{ height: 55, width: 55 }}
          source={{ uri: item?.track?.album?.images[0]?.url }}
        />
        <View style={styles.flatListTextView}>
          <Text numberOfLines={2} style={styles.flatListText}>
            {item?.track?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={styles.mainHeaderView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={styles.profileImageStyle}
              source={{ uri: userProfile?.images[0].url }}
            />
            <Text style={styles.messageText}>{greetingMessage()}</Text>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>
        <View style={styles.secondMainView}>
          <Pressable style={styles.musicButton}>
            <Text style={styles.buttontext}>Music</Text>
          </Pressable>

          <Pressable style={styles.musicButton}>
            <Text style={styles.buttontext}>Podcasts & Shows</Text>
          </Pressable>
        </View>
        <View style={{ height: 10 }} />
        <View style={styles.likeAndHiphopContainerView}>
          <TouchableOpacity
            style={styles.likeButtonMainView}
            onPress={() => navigation.navigate("Like")}
          >
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <TouchableOpacity style={styles.likeButtonView}>
                <AntDesign name="heart" size={24} color="white" />
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.hiphopText}>Liked Songs</Text>
          </TouchableOpacity>
          <View style={styles.hiphopMainView}>
            <Image
              style={{ width: 55, height: 55 }}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <View style={styles.randomArtist}>
              <Text style={styles.hiphopText}>Hiphop Tamhiza</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={recentlyplayed}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={renderItem}
        />
        <Text style={styles.topArtistText}>Your Top Artists</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {topArtists.map((item, index) => (
            <ArtistCard item={item} key={index} />
          ))}
        </ScrollView>
        <View style={{ height: 10 }} />
        <Text style={styles.topArtistText}>Recently Played</Text>
        <FlatList
          data={recentlyplayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecentPlayCard item={item} key={index} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainHeaderView: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileImageStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  messageText: {
    fontSize: 20,
    color: "white",
    marginLeft: 10,
    fontWeight: "bold",
  },
  secondMainView: {
    gap: 10,
    marginVertical: 5,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  musicButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#282828",
  },
  buttontext: {
    fontSize: 15,
    color: "white",
  },
  likeButtonMainView: {
    gap: 10,
    flex: 1,
    elevation: 3,
    borderRadius: 4,
    marginBottom: 10,
    marginVertical: 8,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "#202020",
  },
  likeButtonView: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  hiphopMainView: {
    gap: 10,
    flex: 1,
    elevation: 3,
    borderRadius: 4,
    marginBottom: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202020",
  },
  hiphopText: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
  },
  likeAndHiphopContainerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flatListMainView: {
    flex: 1,
    borderRadius: 4,
    marginVertical: 8,
    flexDirection: "row",
    marginHorizontal: 10,
    backgroundColor: "#282828",
    justifyContent: "space-between",
  },
  flatListText: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
  },
  flatListTextView: {
    flex: 1,
    marginHorizontal: 15,
    justifyContent: "center",
  },
  topArtistText: {
    fontSize: 19,
    marginTop: 10,
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
