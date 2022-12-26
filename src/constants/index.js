import { Dimensions } from "react-native";

export const winWidth = Dimensions.get("window").width;
export const winHeight = Dimensions.get("window").height;

const guidelineBaseWidth = 350;

const scale = (size) => (winWidth / guidelineBaseWidth) * size;

export const rs = (size, factor = 0.5) => size + (scale(size) - size) * factor;

import GhostFish from "../../assets/GhostFishFinalFinal.png";
import IslamicTerroristFish from "../../assets/TerroristFishOneFinal.png";
import PalestineTerroristFish from "../../assets/TerroristFishTwoFinal.png";
import MinecraftFish from "../../assets/MinecraftFishFinal.png";
import RacistFish from "../../assets/RacistFIshFinal.png";
import LexiFish from "../../assets/LexiCatFishFinal.png";
import LouieFish from "../../assets/LouieCatFishFinal.png";
import LunaFish from "../../assets/LunaCatFishFinal.png";

import PrincessRod from "../../assets/PrincessRodFinal.png";
import MinecraftRod from "../../assets/MinecraftRod.png";
import MechanicsRod from "../../assets/MechanicsRod.png";
import RealRod from "../../assets/RealRodFinal.png";

export const FISH = [
  { id: 1, name: "Lexi the Cat-fish", image: LexiFish, cost: 12, description: "Fun fact: She's actually fucking the most curious cat and always fucking uhhhhh.... always wanting to fucking... how do I put this into words? Has a lot of ADHD and can't focus on one thing, I give her one toy and she loves it but then I'll play with the other cats and she'll come over and be all up in the business" },
  { id: 2, name: "Louie the Cat-fish", image: LouieFish, cost: 12, description: "The leader of this school of cat-fish, but don't let the others know. There will be competition, and shins will be bumped against." },
  { id: 3, name: "Luna the Cat-fish", image: LunaFish, cost: 12, description: "Named after a character from Harry Potter. Wingardium Leviosa! Accio pussy!" },
  { id: 4, name: "Islamic Terrorist Fish", image: IslamicTerroristFish, cost: 8, description: "Sawed-off and XM are the only shotguns this fish has known" },
  { id: 5, name: "Palestinian Terrorist Fish", image: PalestineTerroristFish, cost: 8, description: "Chad vent-diver vs virgin ramp rusher" },
  { id: 6, name: "Racist Fish", image: RacistFish, cost: 2, description: "He's just a sucker for NASCAR!" },
  { id: 7, name: "Ghost Fish", image: GhostFish, cost: 2, description: "This isn't even a real ghost-fish, it's just a regular bass that really likes to trick or treat!" },
  { id: 8, name: "Minecraft Fish", image: MinecraftFish, cost: 2, description: "Legend has it of a faraway kingdom, a grand half-built castle, a quaint little village, and a nice river-side house..." },
];

export const FISH_DIFFICULTY = {
  LEGENDARY: { catchZones: 6, name: "Legendary", chances: 2, width: 25 },
  EXTREME: { catchZones: 5, name: "Epic", chances: 2, width: 35 },
  HARD: {
    catchZones: 4,
    name: "Rare",
    chances: 3,
    width: 45,
    fish: [1, 2, 3],
  },
  MEDIUM: {
    catchZones: 3,
    name: "Uncommon",
    chances: 4,
    width: 50,
    fish: [4, 5, 6],
  },
  EASY: {
    catchZones: 2,
    name: "Common",
    chances: 4,
    width: 60,
    fish: [7, 8],
  },
};

export const FISHING_RODS = [
  { id: 1, name: "Toy Rod", image: PrincessRod, price: 50, modifier: 1 },
  { id: 2, name: "Amateur Rod", image: MinecraftRod, price: 100, modifier: 2 },
  { id: 3, name: "Intermediate Rod", image: MechanicsRod, price: 500, modifier: 3 },
  { id: 4, name: "Professional Rod", image: RealRod, price: 5000, modifier: 4 },
];
