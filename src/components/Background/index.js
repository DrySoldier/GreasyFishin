import { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  Pressable,
} from "react-native";

const { width, height } = Dimensions.get("screen");
const easOutQuart = Easing.bezier(0.45, 0, 0.55, 1);

const Background = ({ gameStarted, setGameStarted }) => {
  const [disabled, setDisabled] = useState(true);
  const descendY = useRef(new Animated.Value(0)).current;
  const titleOpac = useRef(new Animated.Value(0)).current;
  const blinkingText = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(descendY, {
          duration: 3000,
          toValue: height,
          easing: easOutQuart,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpac, {
          duration: 500,
          toValue: 1,
          delay: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setDisabled(false);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(blinkingText, {
              duration: 1000,
              toValue: 1,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(blinkingText, {
              duration: 1000,
              toValue: 0.1,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 5000);
    });
  }, []);

  const startGame = () => {
    blinkingText.stopAnimation();
    setDisabled(true);
    Animated.parallel([
      Animated.timing(descendY, {
        duration: 3000,
        toValue: -height * 1.95,
        easing: easOutQuart,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpac, {
        duration: 2500,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(blinkingText, {
        duration: 500,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: -height,
        duration: 1000,
        easing: easOutQuart,
        useNativeDriver: true,
      }),
    ]).start(() => setGameStarted(true));
  };

  useEffect(() => {
    // This is for testing/skipping the intro
    // Comment or delete this when releasing
    if (gameStarted) {
      startGame();
    }
  }, [gameStarted]);

  return (
    <>
      <Animated.Image
        resizeMode="stretch"
        style={{
          position: "absolute",
          width: width * 1.4,
          height: height * 4,
          top: -height,
          left: -150,
          zIndex: 0,
          transform: [{ translateY: descendY }],
        }}
        source={require("../../../assets/background.png")}
      />
      {!gameStarted && (
        <>
          <Pressable
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              zIndex: 100,
            }}
            disabled={disabled}
            onPressIn={startGame}
          />
          <Animated.View style={{ transform: [{ translateY: titleY }] }}>
            <Animated.Text
              style={{
                fontSize: 42,
                color: "gold",
                opacity: titleOpac,
                textAlign: "center",
              }}
            >
              {"Greasy\n Fishin'"}
            </Animated.Text>
            <TouchableOpacity>
              <Animated.Text
                style={{
                  fontSize: 24,
                  color: "rgb(230, 230, 230)",
                  opacity: blinkingText,
                }}
              >
                Press anywhere to start
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </>
  );
};

export default Background;
