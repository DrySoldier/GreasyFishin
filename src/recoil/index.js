import { atom } from 'recoil';

export const fishingEquipment = atom({
  key: "fishingEquipment",
  default: {
    rod: { modifier: 0 }, // How many attachments you can equip; default: 1
    lure: {}, // Speed of lure
    line: {}, // // Decreases size of lure
    reel: {}, // Increases width of catch zone
    sinker: {}, // How rare of fish you can catch
    handle: {}, // Changes easing algorithm of lure
    
    tank: {}, // Storing fish, can only have a limited number of fish

    rodsOwned: [],
    currentFish: { id: undefined, cost: 0 },
    caughtFish: [],
    money: 0,
  },
});
