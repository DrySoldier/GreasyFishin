import { Dimensions } from "react-native";

export const winWidth = Dimensions.get("window").width;
export const winHeight = Dimensions.get("window").height;

const guidelineBaseWidth = 350;

const scale = (size) => (winWidth / guidelineBaseWidth) * size;

export const rs = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const FISH_DIFFICULTY = {
  LEGENDARY: { catchZones: 6, name: "Legendary", chances: 2, width: 25 },
  EXTREME: { catchZones: 5, name: "Epic", chances: 2, width: 35 },
  HARD: { catchZones: 4, name: "Rare", chances: 3, width: 45 },
  MEDIUM: { catchZones: 3, name: "Uncommon", chances: 4, width: 50 },
  EASY: { catchZones: 2, name: "Common", chances: 4, width: 60 },
};
