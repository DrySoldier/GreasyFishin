import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Easing,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Image,
  Text,
  FlatList,
  useWindowDimensions
} from "react-native";
import { useRecoilState } from "recoil";
import ImageButton from "../../components/ImageButton";

import { FISHING_RODS, FISH } from "../../constants";

import { fishingEquipment } from "../../recoil";


const StoreDrawer = ({ navigation }) => {
  const [selectedRod, setSelectedRod] = useState();
  const [fishingEq, setFishingEq] = useRecoilState(fishingEquipment);
  const { height: winHeight, width: winWidth } = useWindowDimensions();
  const [currentFish, setCurrentFish] = useState(
    FISH.find((e) => e.id === fishingEq.currentFish.id)
  );
  const storeStartingPos = -winWidth * 0.3;
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

  const getSecondaryButton = () => {
    let img = require("../../../assets/grey_button.png");
    let label = "";

    const ownsRod = fishingEq.rodsOwned.includes(selectedRod?.id);

    if (ownsRod) {
      img = require("../../../assets/green_button.png");
      label = "Equip";
    } else if (!ownsRod && !!selectedRod) {
      img = require("../../../assets/red_button.png");
      label = "Purchase";
    }

    return (
      <ImageButton
        resizeMode="stretch"
        source={img}
        style={{
          height: 50,
          width: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          if (ownsRod) {
            setFishingEq({
              ...fishingEq,
              rod: selectedRod.id,
            });
          } else if (fishingEq.money >= selectedRod?.price) {
            setFishingEq({
              ...fishingEq,
              money: Number(fishingEq.money) - Number(selectedRod.price),
              rodsOwned: [...fishingEq.rodsOwned, selectedRod.id],
            });
          }
        }}
      >
        <Text style={{ color: "white", fontSize: 22 }}>{label}</Text>
      </ImageButton>
    );
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
          width: winHeight * 1,
          height: "100%",
          transform: [{ translateX: storeX }],
        }}
      >
        <ImageBackground
          resizeMode="stretch"
          style={{
            height: "100%",
            width: "100%",
            paddingTop: 20,
            flexDirection: "row",
          }}
          source={require("../../../assets/sidebar_actions.png")}
        >
          <FlatList
            data={FISHING_RODS}
            extraData={selectedRod}
            contentContainerStyle={{ flexDirection: "column" }}
            renderItem={({ item: e, index: i }) => (
              <ImageButton
                style={{
                  height: 75,
                  width: 75,
                  marginLeft: winWidth * 0.1,
                  borderColor:
                    fishingEq?.rod === e.id
                      ? "red"
                      : FISHING_RODS[i].name === selectedRod?.name
                      ? "cyan"
                      : "black",
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderRadius: 1,
                  margin: 2,
                  backgroundColor: "rgba(0,0,0,.1)",
                }}
                onPress={() => setSelectedRod(FISHING_RODS[i])}
                resizeMode="stretch"
                source={require("../../../assets/fade.png")}
              >
                <Image
                  resizeMode="stretch"
                  style={{ height: "100%", width: "100%" }}
                  source={e.image}
                />
              </ImageButton>
            )}
          />
          <View
            style={{
              flexDirection: "column",
              height: "100%",
              marginRight: winWidth * 0.1,
              justifyContent: "space-evenly",
              alignItems: "center",
              paddingBottom: 15,
            }}
          >
            <ImageBackground
              style={{
                height: 100,
                width: 100,
                borderColor: "black",
                borderWidth: 2,
                borderStyle: "dashed",
                borderRadius: 1,
              }}
              source={require("../../../assets/fade.png")}
            >
              {!!currentFish && (
                <Image
                  style={{ height: 100, width: 100 }}
                  source={currentFish.image}
                />
              )}
            </ImageBackground>

            <ImageButton
              resizeMode="stretch"
              source={
                !!currentFish
                  ? require("../../../assets/red_button.png")
                  : require("../../../assets/grey_button.png")
              }
              onPress={() => {
                setFishingEq({
                  ...fishingEq,
                  currentFish: { id: undefined, cost: 0 },
                  money: fishingEq?.currentFish?.cost + fishingEq.money,
                });
              }}
              disabled={!!fishingEq?.d}
              style={{
                height: 50,
                width: 100,
                marginTop: 15,
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <Text style={{ color: "white", fontSize: 22 }}>
                {fishingEq.currentFish?.cost
                  ? `Sell: $${fishingEq.currentFish?.cost}`
                  : "Sell"}
              </Text>
            </ImageButton>
            <Text style={{ color: "white", fontSize: 14, textAlign: "center" }}>
              {selectedRod?.name}
            </Text>
            {selectedRod?.id && (
              <Text
                style={{ color: "white", fontSize: 24, textAlign: "center" }}
              >
                ${selectedRod?.price}
              </Text>
            )}
            {getSecondaryButton()}
          </View>
        </ImageBackground>
        <ImageBackground
          source={require("../../../assets/sidebar_actions.png")}
          resizeMode="stretch"
          style={{
            height: 50,
            width: 100,
            top: 15,
            right: -winWidth * 0.1,
            position: "absolute",
            zIndex: -100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Money</Text>
          <Text style={{ color: "white", fontSize: 22 }}>
            ${fishingEq.money}
          </Text>
        </ImageBackground>
      </Animated.View>
      <Pressable onPress={closeDrawer} style={{ flex: 1 }} />
    </SafeAreaView>
  );
};

export default StoreDrawer;
