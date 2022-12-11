import { useEffect, useState, useRef } from "react";
import { Text, View, Animated, Easing, Pressable } from "react-native";
import { randInt, useComponentSize } from "../../utils/index";

const FISH_DIFFICULTY = {
  LEGENDARY: { modifier: 5, name: "Legendary", chances: 2 },
  EXTREME: { modifier: 4, name: "Extreme", chances: 2 },
  HARD: { modifier: 3, name: "Hard", chances: 3 },
  MEDIUM: { modifier: 2, name: "Medium", chances: 4 },
  EASY: { modifier: 1, name: "Easy", chances: 5 },
};

const AnimatedPressable = new Animated.createAnimatedComponent(Pressable);

const FishinBar = ({ caughtFishCB, lostFishCB }) => {
  const [catchZonesLeft, setCatchZonesLeft] = useState(undefined);
  const [catchZone, setCatchZone] = useState({ width: 0, x: 0 });
  const [difficulty, setDifficulty] = useState(undefined);
  // Boolean, the line that has hit the catch zone to "catch" the fish
  const [lureCast, setLureCast] = useState(false);
  const [chances, setChances] = useState(0);

  const [fishinBarSize, onFishinBarLayout] = useComponentSize();
  const [catchZoneSize, onCatchZoneLayout] = useComponentSize();
  const [lureSize, onLureLayout] = useComponentSize();

  const lureX = useRef(new Animated.Value(0)).current;
  const catchFlashOpac = useRef(new Animated.Value(0)).current;

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
        difficulty = FISH_DIFFICULTY.EXTREME;
        break;

      case 2:
      case 12:
        difficulty = FISH_DIFFICULTY.LEGENDARY;
        break;
      default:
        console.log("... what?", diceTotal, dice1, dice2);
        break;
    }

    setDifficulty(difficulty);
    setCatchZonesLeft(difficulty.modifier);
    setChances(difficulty.chances);

    return () => lureX.removeAllListeners();
  }, []);

  // Catch zone setup, after difficulty is calculated
  useEffect(() => {
    if (!!difficulty && !!fishinBarSize && catchZonesLeft) {
      const czWidth = 100 / difficulty.modifier + 5;
      let czX = randInt(0, fishinBarSize.width - czWidth);

      setCatchZone({ x: czX, width: czWidth });
    }
  }, [difficulty, fishinBarSize, catchZonesLeft]);

  // Lure animation setup, after catchzone setup
  useEffect(() => {
    if (!!catchZoneSize && !!lureSize && !!fishinBarSize && !lureCast) {
      setLureCast(true);
      startLure();
    }
  }, [catchZoneSize, lureSize, lureCast]);

  const startLure = () => {
    Animated.timing(lureX, {
      duration: 2500,
      toValue: fishinBarSize.width - lureSize.width,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setChances((prevState) => (prevState < 2 ? lostFishCB() : prevState - 1));

      Animated.timing(lureX, {
        duration: 2500,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => {
        setChances((prevState) =>
          prevState < 2 ? lostFishCB() : prevState - 1
        );
        startLure();
      });
    });
  };

  const attemptCatch = () => {
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

    if (
      lureXValue >= catchZone.x &&
      lureXValue + lureSize.width <= catchZone.x + catchZone.width
    ) {
      setChances(difficulty.chances);
      if (catchZonesLeft === 0 && difficulty.name !== FISH_DIFFICULTY.EASY.name) {
        caughtFishCB();
      } else {
        setCatchZonesLeft((prevState) => prevState - 1);
      }
    } else {
      setChances((prevState) => (prevState < 2 ? lostFishCB() : prevState - 1));
    }
  };

  return (
    <>
      <AnimatedPressable
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          backgroundColor: "white",
          opacity: catchFlashOpac,
          zIndex: 100,
        }}
        onPressIn={attemptCatch}
      />
      <Text style={{ fontSize: 24, color: "blue" }}>{chances}</Text>
      <View
        onLayout={onFishinBarLayout}
        style={{
          width: "90%",
          height: 50,
          backgroundColor: "cyan",
          position: "absolute",
          bottom: 50,
        }}
      >
        <View
          onLayout={onCatchZoneLayout}
          style={{
            position: "absolute",
            height: "100%",
            width: catchZone.width || 0,
            left: catchZone.x,
            backgroundColor: "yellow",
          }}
        />
        <Animated.View
          onLayout={onLureLayout}
          style={{
            position: "absolute",
            width: 25,
            height: "100%",
            backgroundColor: "red",
            transform: [{ translateX: lureX }],
          }}
        />
        {!!difficulty && (
          <Text style={{ color: "red", fontSize: 25 }}>{difficulty.name}</Text>
        )}
      </View>
    </>
  );
};

export default FishinBar;
