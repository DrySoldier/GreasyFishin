import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Easing,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRecoilValue } from "recoil";
import ImageButton from "../../components/ImageButton";

import { FISH, winHeight } from "../../constants";
import { fishingEquipment } from "../../recoil";

const StatsDrawer = ({ navigation }) => {
  const { height: winHeight, width: winWidth } = useWindowDimensions();
  const fishingEq = useRecoilValue(fishingEquipment);
  const [selectedFish, setSelectedFish] = useState();
  const statsStartingPos = winHeight * 0.3;
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
          width: winHeight,
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
          <ScrollView
            style={{
              transform: [{ scaleX: -1 }],
              flexDirection: "row",
              marginTop: 15,
            }}
            contentContainerStyle={{
              paddingRight: 110,
              height: 0,
            }}
            horizontal
          >
            {FISH.map((e, i) => (
              <ImageButton
                style={{
                  height: winHeight * 0.2,
                  width: winHeight * 0.2,
                  borderColor: "black",
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderRadius: 1,
                  margin: 2,
                  backgroundColor: "rgba(0,0,0,.1)",
                }}
                key={i.toString()}
                onPress={() => setSelectedFish(FISH[i])}
                resizeMode="stretch"
                source={require("../../../assets/fade.png")}
              >
                {fishingEq?.caughtFish?.includes(i + 1) && (
                  <Image
                    resizeMode="stretch"
                    style={{ height: "100%", width: "100%" }}
                    source={e.image}
                  />
                )}
              </ImageButton>
            )).reverse()}
          </ScrollView>
          <View
            style={{
              flexGrow: 1,
              transform: [{ scaleX: -1 }],
              alignItems: "center",
              marginLeft: winHeight * 0.3,
              paddingTop: 12,
            }}
          >
            <ImageBackground
              style={{
                height: winHeight * 0.3,
                width: winHeight * 0.3,
                borderColor: "black",
                borderWidth: 2,
                borderStyle: "dashed",
                borderRadius: 1,
              }}
              source={require("../../../assets/fade.png")}
            >
              {fishingEq?.caughtFish?.includes(selectedFish?.id) && (
                <Image
                  style={{ height: "100%", width: "100%" }}
                  source={selectedFish?.image}
                />
              )}
            </ImageBackground>
            <Text
              style={{
                color: "white",
                fontSize: 14,
                marginTop: 5,
                textAlign: "center",
                width: 300,
              }}
            >
              {fishingEq?.caughtFish?.includes(selectedFish?.id)
                ? selectedFish?.description
                : "Not yet discovered"}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

export default StatsDrawer;
