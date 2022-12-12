import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  attemptCatchScreenPressable: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    zIndex: 100,
  },
  fishinBarContainer: {
    width: "90%",
    height: 50,
    backgroundColor: "cyan",
    position: "absolute",
    bottom: 50,
  },
  catchZone: {
    position: "absolute",
    height: "100%",
    backgroundColor: "yellow",
  },
  lure: {
    position: "absolute",
    height: "100%",
    backgroundColor: "red",
  },
});

export default styles;
