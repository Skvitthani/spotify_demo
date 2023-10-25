import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { getPlaylists, getProfile } from "../services/APIAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState(null);

  const [playlists, setPlaylists] = useState([]);
  console.log("playlists", playlists);

  useEffect(() => {
    (async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const request = {
        token: accessToken,
      };
      const profile = await getProfile(request);
      const playList = await getPlaylists(request);
      setPlaylists(playList);
      setUserProfile(profile);
    })();
  }, []);
  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View style={{ padding: 12 }}>
          <View style={styles.profileView}>
            <Image
              style={styles.profileImagestyle}
              source={{ uri: userProfile?.images[0]?.url }}
            />
            <View>
              <Text style={styles.userNameText}>
                {userProfile?.display_name}
              </Text>
              <Text style={[styles.userNameText, { color: "gray" }]}>
                {userProfile?.email}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.playListText}>Your Playlists</Text>
        <View style={{ padding: 15 }}>
          {playlists.map(
            (item, index) => (
              console.log("item", item),
              (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginVertical: 10,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        item?.images[0]?.url ||
                        "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=800",
                    }}
                    style={{ width: 50, height: 50, borderRadius: 4 }}
                  />
                  <View>
                    <Text style={{ color: "white" }}>{item?.name}</Text>
                    <Text style={{ color: "white", marginTop: 7 }}>
                      0 followers
                    </Text>
                  </View>
                </View>
              )
            )
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profileView: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImagestyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  userNameText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  playListText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    marginHorizontal: 12,
  },
});
