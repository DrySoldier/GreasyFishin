import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import { NavigableRoutes } from "./index.js";
import IntroModal from "../screens/IntroModal/index.js";
import MainGame from "../screens/MainGame/index.js";
import StatsDrawer from "../screens/StatsDrawer/index.js";
import StoreDrawer from "../screens/StoreDrawer/index.js";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerStack = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={NavigableRoutes.StatsDrawer}
        component={StatsDrawer}
      />
      <Drawer.Screen
        name={NavigableRoutes.StoreDrawer}
        component={StoreDrawer}
      />
    </Drawer.Navigator>
  );
};

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={NavigableRoutes.MainGame}>
        <Stack.Group>
          <Stack.Screen name={NavigableRoutes.MainGame} component={MainGame} />
          <Stack.Screen
            name={NavigableRoutes.Drawers}
            component={DrawerStack}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
