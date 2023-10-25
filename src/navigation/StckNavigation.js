import { Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./TabNavigation";
import LoginScreen from "../screens/LoginScreen";
import LikedSongsScreen from "../screens/LikedSongsScreen";
import SongsInfoScreen from "../screens/SongsInfoScreen";

const Stack = createNativeStackNavigator();

const StckNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Like"
          component={LikedSongsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Info"
          component={SongsInfoScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StckNavigation;
