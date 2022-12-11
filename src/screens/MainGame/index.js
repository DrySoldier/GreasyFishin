import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import Background from "../../components/Background";
import FishinBar from "../../components/FishinBar";
import { NavigableRoutes } from "../../navigation";
import { randInt } from "../../utils";

const { width, height } = Dimensions.get("screen");

const MainGame = ({ navigation }) => {
  // Set this to true to skip intro
  const [gameStarted, setGameStarted] = useState(false);
  const [lureCast, setLureCast] = useState(false);
  const [fishin, setFishin] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [dots, setDots] = useState([]);

  const castOpac = useRef(new Animated.Value(0)).current;

  const fishFound = () => {
    setFishin(true);
  };

  const caughtFishCB = (fish) => {
    setFishin(false);
    setLureCast(false);
    setAnnouncementText("You caught the fish! Gzzzz");
    // Add fish to inventory, fish-dex (If they have journal)
  };

  const lostFishCB = () => {
    setFishin(false);
    setLureCast(false);
    setAnnouncementText("You lost the fish!");
  };

  useEffect(() => {
    if (gameStarted) {
      Animated.timing(castOpac, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [gameStarted]);

  useEffect(() => {
    let int;
    let castingFeedback;
    if (lureCast && !fishin) {
      int = setInterval(fishFound, randInt(5000, 7500));
      castingFeedback = setInterval(() => {
        setDots((prevState) =>
          prevState.length < 3 ? [...prevState, ". "] : []
        );
      }, 1000);
    } else {
      setDots([]);
      clearInterval(castingFeedback);
      clearInterval(int);
    }

    return () => {
      clearInterval(castingFeedback);
      clearInterval(int);
    };
  }, [lureCast, fishin]);

  return (
    <View style={styles.container}>
      <Background gameStarted={gameStarted} setGameStarted={setGameStarted} />
      <Text
        style={{
          fontSize: 24,
          color: "gold",
        }}
      >
        {announcementText}
      </Text>
      <TouchableOpacity onPress={() => setLureCast(true)} disabled={lureCast}>
        <Animated.Text
          style={{
            fontSize: 24,
            color: "gold",
            opacity: castOpac,
            right: width * 0.29,
            top: height * 0.05,
          }}
        >
          Cast{dots}
        </Animated.Text>
      </TouchableOpacity>
      {fishin && (
        <FishinBar
          fishin={fishin}
          caughtFishCB={caughtFishCB}
          lostFishCB={lostFishCB}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MainGame;
