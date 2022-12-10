import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import FishinBar from "./src/components/FishinBar";

/**
 * Ideas for the game:
 *
 * Items:
 *    Fish radar, Rarity of fish to be caught
 *    Fishing poles
 *    Attachments for fishing poles:
 *      Varying tiers: Amateur, Intermediate, Professional
 *      Increase width of catch zones
 *      Change Easing algorithm of lure bar
 *      Lower speed of lure bar
 *      Premium bait, make rarities more common
 *
 * Gameplay:
 *    Lure bar will bounce back and forth less for every rarity higher
 *    Make time between fish random, with an item to make time shorter (hmm... maybe, anti gameplay?)
 *    Should lure bar have to be fully in catch zone, or partially? Leaning towards fully. Should it be smaller?
 */

export default function App() {
  const [fishin, setFishin] = useState(false);

  const fishFound = () => {
    setFishin(true);
  };

  useEffect(() => {
    fishFound();

    const int = setInterval(fishFound, 7000);

    return () => clearInterval(int);
  }, []);

  const caughtFishCB = () => {
    setFishin(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FishinBar fishin={fishin} caughtFishCB={caughtFishCB} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
