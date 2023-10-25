import {
  Text,
  View,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  // useEffect(() => {
  //   const checkTokenValidity = async () => {
  //     const accessToken = await AsyncStorage.getItem("token");
  //     console.log("accessToken", accessToken);
  //     const expirationDate = await AsyncStorage.getItem("expirationDate");

  //     if (accessToken && expirationDate) {
  //       const currentTime = Date.now();
  //       if (currentTime < parseInt(expirationDate)) {
  //         navigation.replace("Main");
  //       } else {
  //         AsyncStorage.removeItem("token");
  //         AsyncStorage.removeItem("expirationDate");
  //       }
  //     }
  //   };

  //   checkTokenValidity();
  // }, []);
  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      responseType: AuthSession.ResponseType.Token,
      clientId: "5863845100bc43d29fd35105b1558a8a",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.24.107:19000",
    },
    discovery
  );

  useEffect(() => {
    if (result?.type === "success") {
      const { access_token, expires_in } = result.params;
      const expirationDate = new Date(expires_in).getTime();
      AsyncStorage.setItem("expirationDate", expirationDate.toString());
      AsyncStorage.setItem("token", access_token);
      navigation.navigate("Main");
    }
  }, [result]);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          name="spotify"
          size={80}
          color="white"
          style={{ alignSelf: "center" }}
        />
        <Text style={styles.spotifyText}>
          Millions of songs Free on spotify!{" "}
        </Text>
        <View style={{ height: 80 }} />
        <TouchableOpacity
          style={styles.signWithSpotify}
          onPress={() => promptAsync()}
        >
          <Text>Sign In With Spotify</Text>
        </TouchableOpacity>
        <Pressable style={styles.otherSignButton}>
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text style={styles.signText}>Continue With Phone Number</Text>
        </Pressable>
        <Pressable style={styles.otherSignButton}>
          <AntDesign name="google" size={24} color="red" />
          <Text style={styles.signText}>Continue With Google</Text>
        </Pressable>
        <Pressable style={styles.otherSignButton}>
          <Entypo name="facebook" size={24} color="blue" />
          <Text style={styles.signText}>Continue With facebook</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  spotifyText: {
    fontSize: 40,
    marginTop: 40,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  signWithSpotify: {
    width: 300,
    padding: 10,
    borderRadius: 25,
    marginVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1D8954",
  },
  otherSignButton: {
    width: 300,
    padding: 10,
    borderRadius: 25,
    borderWidth: 0.8,
    marginVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#C0C0C0",
    justifyContent: "center",
    backgroundColor: "#131624",
  },
  signText: {
    flex: 1,
    color: "white",
    fontWeight: "500",
    textAlign: "center",
  },
});
