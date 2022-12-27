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
  useWindowDimensions,
} from "react-native";
import { useRecoilValue } from "recoil";
import { FISH, FISHING_RODS, FISH_DIFFICULTY } from "../../constants";
import { fishingEquipment } from "../../recoil";
import { randInt, useComponentSize } from "../../utils/index";
import styles from "./styles";

LogBox.ignoreLogs(["onAnimatedValueUpdate"]);

const AnimatedPressable = new Animated.createAnimatedComponent(Pressable);

const canCatchDifficultFish = false;

const FishinBar = ({ caughtFishCB, lostFishCB }) => {
  const { height: winHeight, width: winWidth } = useWindowDimensions();
  const fishingEq = useRecoilValue(fishingEquipment);
  const [_, checkIfFishLost] = useReducer((x) => x + 1, 0);
  const [catchZonesLeft, setCatchZonesLeft] = useState(undefined);
  const [catchZone, setCatchZone] = useState({ width: 0, x: 0 });
  const [difficulty, setDifficulty] = useState(undefined);
  // Boolean, the line that has hit the catch zone to "catch" the fish
  const [lureCast, setLureCast] = useState(false);
  const [chances, setChances] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [countdownDone, setCountdownDone] = useState(false);
  const [titleText, setTitleText] = useState(undefined);
  const [fishLost, setFishLost] = useState(false);
  const [fishCaught, setFishCaught] = useState(false);
  const [fishToCatch, setFishToCatch] = useState(undefined);
  const currentRod = FISHING_RODS.find((e) => e.id === fishingEq.rod) || {
    modifier: 0,
  };
  const chancesWhenFishCaught = useRef(undefined);

  const [fishinBarSize, onFishinBarLayout] = useComponentSize();
  const [catchZoneSize, onCatchZoneLayout] = useComponentSize();
  const [lureSize, onLureLayout] = useComponentSize();

  const lureX = useRef(new Animated.Value(0)).current;
  const lureY = useRef(new Animated.Value(0)).current;
  const catchFlashOpac = useRef(new Animated.Value(0)).current;

  const countdownScale = useRef(new Animated.Value(0)).current;
  const countdownRotateInterpolate = countdownScale.interpolate({
    inputRange: [0, 1],
    outputRange: ["-45deg", "45deg"],
  });

  const countdownOpacInterpolate = countdownScale.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

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

    let int;
    int = setInterval(
      () => setCountdown((prevState) => (prevState -= 1)),
      1000
    );

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

    const fishId = difficulty.fish[randInt(0, difficulty.fish.length - 1)];

    setDifficulty(difficulty);
    setCatchZonesLeft(difficulty.catchZones);
    setChances(difficulty.chances);
    setFishToCatch(FISH.find((e) => e.id === fishId));

    return () => {
      clearInterval(int);
      lureX.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (countdown > 0 && countdown < 4) {
      Animated.sequence([
        Animated.timing(countdownScale, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(countdownScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => countdownScale.setValue(0));
    } else if (countdown === 0) {
      setCountdownDone(true);
    }
  }, [countdown]);

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
    if (
      !!catchZoneSize &&
      !!lureSize &&
      !!fishinBarSize &&
      countdownDone &&
      !lureCast
    ) {
      setLureCast(true);
      startLure();
    }
  }, [catchZoneSize, lureSize, lureCast, countdownDone]);

  const lostFish = () => {
    setFishLost(true);
    setTitleText("Fish lost :(");

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
      duration: 1250 + currentRod.modifier * 100,
      toValue: fishinBarSize.width - lureSize.width,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // This logic depends on previous state, which isn't accessible through a callback
      checkIfFishLost();

      Animated.timing(lureX, {
        duration: 1250 + currentRod.modifier * 100,
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
    if (fishCaught) return caughtFishCB(fishToCatch, chancesWhenFishCaught.current);

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
      chancesWhenFishCaught.current = chances;
      // Reset chances for each successful hit
      setChances(difficulty.chances);

      if (catchZonesLeft === 0) {
        setFishCaught(true);
        setTitleText(fishToCatch?.name);
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
              width: 25 - currentRod.modifier * 3,
              transform: [
                { translateX: lureX },
                { translateY: lureY },
                { rotateZ: lureRotateInterpolation },
              ],
            },
          ]}
        >
          <Image
            resizeMode="stretch"
            source={require("../../../assets/lure.png")}
            style={{ height: "100%", width: "100%" }}
          />
        </Animated.View>
      </Animated.View>
      <View
        style={{
          height: winWidth / 2,
          width: winHeight / 2,
          top: 25,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          style={{
            height: winWidth * 0.2,
            width: winHeight * 0.9,
            position: "absolute",
            top: 0,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
          resizeMode="stretch"
          source={require("../../../assets/combat_banner.png")}
        >
          <Text style={{ fontSize: 28, color: "gold", marginTop: 17 }}>
            {!!titleText ? titleText : chances}
          </Text>
        </ImageBackground>
        <Animated.View
          style={{
            height: winWidth * 0.4,
            width: winHeight * 1.5,
            left: 50,
            transform: [{ scale: resultsScale }],
          }}
        >
          <ImageBackground
            style={{
              height: "80%",
              width: "80%",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
            resizeMode="stretch"
            source={require("../../../assets/fade.png")}
          >
            {fishLost && !!difficulty ? (
              <Image
                style={{ height: "100%", width: "100%", left: -50, top: -50 }}
                resizeMode="stretch"
                source={require("../../../assets/snap.png")}
              />
            ) : (
              fishCaught && (
                <Image
                  style={{ height: 300, width: 300, left: -winWidth * 0.1 }}
                  source={fishToCatch?.image}
                />
              )
            )}
          </ImageBackground>
        </Animated.View>
        <Animated.Text
          style={{
            color: "white",
            fontSize: 128,
            opacity: countdownOpacInterpolate,
            bottom: winHeight / 2,
            position: "absolute",
            transform: [
              { scale: countdownScale },
              { rotateZ: countdownRotateInterpolate },
            ],
          }}
        >
          {countdown}
        </Animated.Text>
      </View>
    </>
  );
};

export default FishinBar;
