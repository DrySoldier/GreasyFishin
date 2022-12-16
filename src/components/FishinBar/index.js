import { useEffect, useState, useRef, useReducer } from "react";
import {
  Text,
  View,
  Animated,
  Easing,
  Pressable,
  LogBox,
  ImageBackground,
  Image,
} from "react-native";
import { FISH_DIFFICULTY, winHeight, winWidth } from "../../constants";
import { randInt, useComponentSize } from "../../utils/index";
import styles from "./styles";

LogBox.ignoreLogs(["onAnimatedValueUpdate"]);

const AnimatedPressable = new Animated.createAnimatedComponent(Pressable);

const canCatchDifficultFish = false;

const FishinBar = ({ caughtFishCB, lostFishCB }) => {
  const [_, checkIfFishLost] = useReducer((x) => x + 1, 0);
  const [catchZonesLeft, setCatchZonesLeft] = useState(undefined);
  const [catchZone, setCatchZone] = useState({ width: 0, x: 0 });
  const [difficulty, setDifficulty] = useState(undefined);
  // Boolean, the line that has hit the catch zone to "catch" the fish
  const [lureCast, setLureCast] = useState(false);
  const [chances, setChances] = useState(0);
  const [fishLost, setFishLost] = useState(false);
  const [fishCaught, setFishCaught] = useState(false);

  const [fishinBarSize, onFishinBarLayout] = useComponentSize();
  const [catchZoneSize, onCatchZoneLayout] = useComponentSize();
  const [lureSize, onLureLayout] = useComponentSize();

  const lureX = useRef(new Animated.Value(0)).current;
  const lureY = useRef(new Animated.Value(0)).current;
  const catchFlashOpac = useRef(new Animated.Value(0)).current;

  const resultsScale = useRef(new Animated.Value(0)).current;
  const fishinBarScale = useRef(new Animated.Value(1)).current;

  const lureRotate = useRef(new Animated.Value(0)).current;
  const lureRotateInterpolation = lureRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const fishinBarRotate = useRef(new Animated.Value(0)).current;
  const fishinBarRotateInterpolation = fishinBarRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "7deg"],
  });

  // Initial setup for difficulty and lure
  useEffect(() => {
    lureX.addListener(() => {});

    var dice1 = randInt(1, 6);
    var dice2 = randInt(1, 6);

    let difficulty;

    const diceTotal = dice1 + dice2;

    // https://cs.stanford.edu/people/nick/settlers/DiceOddsSettlers.html
    switch (diceTotal) {
      case 6:
      case 7:
      case 8:
        difficulty = FISH_DIFFICULTY.EASY;
        break;

      case 5:
      case 9:
        difficulty = FISH_DIFFICULTY.MEDIUM;
        break;

      case 4:
      case 10:
        difficulty = FISH_DIFFICULTY.HARD;
        break;

      case 3:
      case 11:
        difficulty = canCatchDifficultFish
          ? FISH_DIFFICULTY.EXTREME
          : FISH_DIFFICULTY.EASY;
        break;

      case 2:
      case 12:
        difficulty = canCatchDifficultFish
          ? FISH_DIFFICULTY.LEGENDARY
          : FISH_DIFFICULTY.EASY;
        break;
      default:
        console.log("... what?", diceTotal, dice1, dice2);
        break;
    }

    setDifficulty(difficulty);
    setCatchZonesLeft(difficulty.catchZones);
    setChances(difficulty.chances);

    return () => lureX.removeAllListeners();
  }, []);

  // Generate new catchzone
  useEffect(() => {
    if (
      !!difficulty &&
      !!fishinBarSize &&
      (catchZonesLeft || catchZonesLeft === 0)
    ) {
      const czX = randInt(0, fishinBarSize.width - difficulty.width);

      setCatchZone({ x: czX, width: difficulty.width });
    }
  }, [difficulty, fishinBarSize, catchZonesLeft]);

  // Lure animation setup, after catchzone setup
  useEffect(() => {
    if (!!catchZoneSize && !!lureSize && !!fishinBarSize && !lureCast) {
      setLureCast(true);
      startLure();
    }
  }, [catchZoneSize, lureSize, lureCast]);

  const lostFish = () => {
    setFishLost(true);
    setChances("Fish lost :(");

    // Fishin bar broke animation
    Animated.parallel([
      Animated.timing(fishinBarRotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(lureRotate, {
        toValue: 1,
        duration: 1000,
        delay: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(lureY, {
        toValue: 200,
        duration: 1000,
        delay: 400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(resultsScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // This logic is effect-based to get updated state, rather than stale state from callbacks
  useEffect(() => {
    if (lureCast && !fishCaught && !fishLost) {
      if (chances < 2) {
        lostFish();
      } else {
        setChances((prevState) => prevState - 1);
      }
    }
  }, [_, checkIfFishLost]);

  const startLure = () => {
    Animated.timing(lureX, {
      duration: 1500,
      toValue: fishinBarSize.width - lureSize.width,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // This logic depends on previous state, which isn't accessible through a callback
      checkIfFishLost();

      Animated.timing(lureX, {
        duration: 1500,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        // This logic depends on previous state, which isn't accessible through a callback
        checkIfFishLost();

        startLure();
      });
    });
  };

  const attemptCatch = () => {
    // Reset fishin bar on press
    if (fishLost) return lostFishCB();
    if (fishCaught) return caughtFishCB();

    // Otherwise, attempt to catch fish
    const lureXValue = lureX.__getValue();

    const easOutQuart = Easing.bezier(0.42, 0, 0.58, 1);

    Animated.sequence([
      Animated.timing(catchFlashOpac, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
        easing: easOutQuart,
      }),
      Animated.timing(catchFlashOpac, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
        easing: easOutQuart,
      }),
    ]).start();

    // Check to see if lure is fully in catchzone
    if (
      lureXValue >= catchZone.x &&
      lureXValue + lureSize.width <= catchZone.x + catchZone.width
    ) {
      // Reset chances for each successful hit
      setChances(difficulty.chances);

      if (catchZonesLeft === 0) {
        setFishCaught(true);
        setChances("Fish caught!")
        lureX.stopAnimation();
        lureX.removeAllListeners();
        Animated.parallel([
          Animated.timing(resultsScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fishinBarScale, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        setCatchZonesLeft((prevState) => prevState - 1);
      }
    } else {
      checkIfFishLost();
    }
  };

  return (
    <>
      <AnimatedPressable
        style={[
          styles.attemptCatchScreenPressable,
          { opacity: catchFlashOpac },
        ]}
        onPressIn={attemptCatch}
      />
      <View
        style={{
          height: winHeight / 2,
          width: winWidth / 2,
          top: 25,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          resizeMode="stretch"
          source={require("../../../assets/combat_banner.png")}
        >
          <Text style={{ fontSize: 28, color: "gold", marginTop: 17 }}>
            {chances}
          </Text>
        </ImageBackground>
        <Animated.View
          style={{
            height: "100%",
            width: "100%",
            left: 50,
            transform: [{ scale: resultsScale }],
          }}
        >
          <ImageBackground
            style={{
              height: "80%",
              width: "80%",
              position: "absolute",
              top: 75,
            }}
            resizeMode="stretch"
            source={require("../../../assets/fade.png")}
          >
            {fishLost ? (
              <Image
                style={{ height: "90%", width: "125%", left: -50 }}
                resizeMode="stretch"
                source={require("../../../assets/snap.png")}
              />
            ) : (
              <Text>insert fish here</Text>
            )}
          </ImageBackground>
        </Animated.View>
      </View>
      <Animated.View
        onLayout={onFishinBarLayout}
        style={[
          styles.fishinBarContainer,
          {
            transform: [
              { rotateZ: fishinBarRotateInterpolation },
              { scale: fishinBarScale },
            ],
          },
        ]}
      >
        <View
          onLayout={onCatchZoneLayout}
          style={[
            styles.catchZone,
            { width: catchZone.width || 0, left: catchZone.x },
          ]}
        />
        <Animated.View
          onLayout={onLureLayout}
          style={[
            styles.lure,
            {
              width: 25,
              transform: [
                { translateX: lureX },
                { translateY: lureY },
                { rotateZ: lureRotateInterpolation },
              ],
            },
          ]}
        />
        {!!difficulty && (
          <Text style={{ color: "red", fontSize: 25 }}>{difficulty.name}</Text>
        )}
      </Animated.View>
    </>
  );
};

export default FishinBar;
