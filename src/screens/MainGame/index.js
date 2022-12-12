import { useEffect, useState, useRef } from "react";
import { View, TouchableOpacity, Animated, Dimensions } from "react-native";
import Background from "../../components/Background";
import FishinBar from "../../components/FishinBar";
import { NavigableRoutes } from "../../navigation";
import { randInt } from "../../utils";
import styles from "./styles";

const { width, height } = Dimensions.get("screen");

const MainGame = ({ navigation }) => {
  // Set this to true to skip intro
  const [gameStarted, setGameStarted] = useState(false);
  const [lureCast, setLureCast] = useState(false);
  const [fishin, setFishin] = useState(false);
  const [dots, setDots] = useState([]);

  const castOpac = useRef(new Animated.Value(0)).current;

  const caughtFishCB = (fish) => {
    setFishin(false);
    setLureCast(false);
    // Add fish to inventory, fish-dex (If they have journal)
  };

  const lostFishCB = () => {
    setFishin(false);
    setLureCast(false);
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
      // For testing, the fish is found immediately if right argument is 0
      int = setInterval(() => setFishin(true), 0);
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
      <TouchableOpacity
        onPress={() => navigation.navigate(NavigableRoutes.StoreDrawer)}
        disabled={lureCast}
      >
        <Animated.Text
          style={{
            fontSize: 24,
            color: "gold",
            opacity: castOpac,
            right: width * 0.29,
            top: height * 0.05,
          }}
        >
          Store
        </Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate(NavigableRoutes.StatsDrawer)}
        disabled={lureCast}
      >
        <Animated.Text
          style={{
            fontSize: 24,
            color: "gold",
            opacity: castOpac,
            right: width * 0.29,
            top: height * 0.05,
          }}
        >
          Pokedex
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

export default MainGame;
