import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { NavigableRoutes } from "./index.js";
import MainGame from "../screens/MainGame/index.js";
import StatsDrawer from "../screens/StatsDrawer/index.js";
import StoreDrawer from "../screens/StoreDrawer/index.js";

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={NavigableRoutes.MainGame}
      >
        <Stack.Screen name={NavigableRoutes.MainGame} component={MainGame} />
        <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
          <Stack.Screen
            name={NavigableRoutes.StoreDrawer}
            component={StoreDrawer}
          />
          <Stack.Screen
            name={NavigableRoutes.StatsDrawer}
            component={StatsDrawer}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
