import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Pressable, ImageBackground, SafeAreaView } from "react-native";

import { winWidth } from "../../constants";

const storeStartingPos = -winWidth * 0.3;

const StoreDrawer = ({ navigation }) => {
  const storeX = useRef(new Animated.Value(storeStartingPos)).current;

  useEffect(() => {
    Animated.timing(storeX, {
      toValue: -100,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  const closeDrawer = () => {
    Animated.timing(storeX, {
      toValue: storeStartingPos,
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
      <Animated.View
        style={{
          width: winWidth * 0.4,
          height: "100%",
          transform: [{ translateX: storeX }],
        }}
      >
        <ImageBackground
          resizeMode="stretch"
          style={{ height: "100%", width: "100%" }}
          source={require("../../../assets/sidebar_actions.png")}
        ></ImageBackground>
      </Animated.View>
      <Pressable onPress={closeDrawer} style={{ flex: 1 }} />
    </SafeAreaView>
  );
};

export default StoreDrawer;
