import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StckNavigation from "./src/navigation/StckNavigation";
import { PlayerContext } from "./src/components/Context";
import { ModalPortal } from "react-native-modals";

export default function App() {
  return (
    <>
      <PlayerContext>
        <StckNavigation />
        <ModalPortal />
      </PlayerContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
