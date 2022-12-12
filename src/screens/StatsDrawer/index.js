import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Text,
} from "react-native";

import { FISH_DIFFICULTY, winWidth } from "../../constants";

const statsStartingPos = winWidth * 0.3;

const StatsDrawer = ({ navigation }) => {
  const storeX = useRef(new Animated.Value(statsStartingPos)).current;

  useEffect(() => {
    Animated.timing(storeX, {
      toValue: 100,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  const closeDrawer = () => {
    Animated.timing(storeX, {
      toValue: statsStartingPos,
      duration: 1000,
      useNativeDriver: true,
    }).start(navigation.goBack());
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,.3)",
      }}
    >
      <Pressable onPress={closeDrawer} style={{ flex: 1 }} />
      <Animated.View
        style={{
          width: winWidth * 0.5,
          height: "100%",
          transform: [{ translateX: storeX }],
        }}
      >
        <ImageBackground
          resizeMode="stretch"
          style={{
            height: "100%",
            width: "110%",
            transform: [{ scaleX: -1 }],
          }}
          source={require("../../../assets/sidebar_actions.png")}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              transform: [{ scaleX: -1 }],
              paddingRight: 100
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', flex: 1, width: '100%', paddingTop: 25 }}>
              {Object.values(FISH_DIFFICULTY).reverse().map((e) => (
                <Text style={{ fontSize: 12, color: "gold" }}>{e.name}</Text>
              ))}
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

export default StatsDrawer;
