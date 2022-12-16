import { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Text,
} from "react-native";
import Background from "../../components/Background";
import FishinBar from "../../components/FishinBar";
import ImageButton from "../../components/ImageButton";
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
    } else if (fishin) {
      setDots([]);
      clearInterval(castingFeedback);
      clearInterval(int);
    }

    if (lureCast) {
      Animated.timing(castOpac, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (gameStarted) {
      Animated.timing(castOpac, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      clearInterval(castingFeedback);
      clearInterval(int);
    };
  }, [lureCast, fishin]);

  const MainButton = ({ onPress, label, style, imageStyle, textStyle }) => {
    return (
      <Animated.View
        style={{
          opacity: castOpac,
          top: height * 0.1,
          position: "absolute",
          ...style,
        }}
      >
        <ImageButton
          onPress={onPress}
          style={{
            justifyContent: "center",
            alignItems: "center",
            ...imageStyle,
          }}
          resizeMode="stretch"
          source={require("../../../assets/banner_new.png")}
          disabled={lureCast}
        >
          <Text
            style={{
              fontSize: 24,
              color: "gold",
              ...textStyle,
            }}
          >
            {label}
          </Text>
        </ImageButton>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Background gameStarted={gameStarted} setGameStarted={setGameStarted} />
      <Animated.View style={{ opacity: castOpac }}>
        <ImageButton
          source={require("../../../assets/red_button.png")}
          onPress={() => setLureCast(true)}
          disabled={lureCast}
        >
          <Text
            style={{
              fontSize: 24,
              color: "gold",
              padding: 25,
            }}
          >
            Cast{dots}
          </Text>
        </ImageButton>
      </Animated.View>

      <MainButton
        onPress={() => navigation.navigate(NavigableRoutes.StoreDrawer)}
        label="Store"
        imageStyle={{
          height: 50,
          width: 125,
          paddingRight: 25,
          paddingBottom: 5,
        }}
        style={{ left: -10 }}
      />
      <MainButton
        onPress={() => navigation.navigate(NavigableRoutes.StatsDrawer)}
        label="Fish-dex"
        imageStyle={{
          height: 50,
          width: 160,
          paddingRight: 35,
          transform: [{ rotateZ: "180deg" }],
        }}
        style={{ right: -15 }}
        textStyle={{ transform: [{ rotateZ: "180deg" }] }}
      />
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
