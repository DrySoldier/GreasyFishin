import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { randInt, useComponentSize } from "../../utils/index";

const FISH_DIFFICULTY = {
  LEGENDARY: { modifier: 5, name: "Legendary" },
  EXTREME: { modifier: 4, name: "Extreme" },
  HARD: { modifier: 3, name: "Hard" },
  MEDIUM: { modifier: 2, name: "Medium" },
  EASY: { modifier: 1, name: "Easy" },
};

const FishinBar = ({ fishin, caughtFishCB }) => {
  if (!fishin) {
    return null;
  }

  const [catchZoneWidth, setCatchZoneWidth] = useState(0);
  const [bars, setBars] = useState(1);
  const [catchZoneX, setCatchZoneX] = useState(0);
  const [difficulty, setDifficulty] = useState(undefined);
  const [lureCast, setLureCast] = useState(false);
  const [fishStatus, setFishStatus] = useState('');
  const [fishinBarSize, onFishinBarLayout] = useComponentSize();
  const [catchZoneSize, onCatchZoneLayout] = useComponentSize();
  const [lureSize, onLureLayout] = useComponentSize();
  const lureX = useRef(new Animated.Value(0)).current;

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

    return () => lureX.removeAllListeners();
  }, []);

  // Catch zone setup, after
  useEffect(() => {
    if (!!difficulty && !!fishinBarSize) {
      const czWidth = 100 / difficulty.modifier + 5;
      setCatchZoneWidth(czWidth);

      let czX = randInt(0, fishinBarSize.width - czWidth);
      setCatchZoneX(czX);
    }
  }, [difficulty, fishinBarSize]);

  useEffect(() => {
    if (!!catchZoneWidth && !!catchZoneSize && !!lureSize && !lureCast) {
      setLureCast(true);
      Animated.loop(
        Animated.sequence([
          Animated.timing(lureX, {
            duration: 2500,
            toValue: fishinBarSize.width - lureSize.width,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(lureX, {
            duration: 2500,
            toValue: 0,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [catchZoneWidth, catchZoneSize, lureSize]);

  const attemptCatch = () => {
    const lureXValue = lureX.__getValue();

    if (
      lureXValue >= catchZoneX &&
      lureXValue + lureSize.width <= catchZoneX + catchZoneWidth
    ) {
      caughtFishCB();
      setFishStatus("FSH CAUGHT!!!!");
    } else {
      setFishStatus("FSH lost :(");
    }
  };

  return (
    <>
      <TouchableOpacity onPressIn={attemptCatch}>
        <Text style={{ fontSize: 24, color: "red" }}>Catch!</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 24, color: "red" }}>{fishStatus}</Text>
      <View
        onLayout={onFishinBarLayout}
        style={{
          width: "90%",
          height: 50,
          backgroundColor: "black",
          position: "absolute",
          bottom: 50,
        }}
      >
        <View
          onLayout={onCatchZoneLayout}
          style={{
            position: "absolute",
            height: "100%",
            width: catchZoneWidth || 0,
            left: catchZoneX,
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
          <Text style={{ color: "cyan", fontSize: 25 }}>{difficulty.name}</Text>
        )}
      </View>
    </>
  );
};

export default FishinBar;
