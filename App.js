import { StatusBar } from "expo-status-bar";
import RootStack from "./src/navigation/RootStack";

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
 *      Make lure bar smaller
 *    Better fishing poles = more attachment slots?
 *    More inventory slots for more fish
 *
 * Gameplay:
 *    Lure bar will bounce back and forth less for every rarity higher
 *    Make time between fish random, with an item to make time shorter (hmm... maybe, anti gameplay?)
 *    Lure bar has to be fully in catch zone
 *    Make screen flash whenever user attempts to catch fish for every bar, and if they break the line, show a big ol "SNAP!!!"
 *    Two drawers, shop on left side, fish-dex (pokedex) on right side
 *    As the player catches more fish in a row (1-bounce combos, 0-bounce combos), the fish gains more weight, making it sell for more
 *    Save previous fish in state, if they catch a new one they give it up
 *
 *    Shop:
 *      Log book - very inexpensive item to unlock right-side drawer (pokedex)
 *      "Sell current fish" button
 *      Fishing rod, attachments and main rod -- see "Items" above
 */

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <RootStack />
    </>
  );
}
