import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fishingEquipment } from "../recoil";

export const storeData = async (type, val) => {
  try {
    await AsyncStorage.setItem(`@GG:${type}`, String(val));
    console.log(`::: AsyncStorage storeData for ${type} with value: ${val}`);
  } catch (error) {
    console.log(error);
    console.log(" ::: AsyncStorage Error - StoreData failed for ", type, val);
  }
};

export const retrieveData = async (type) => {
  try {
    const value = await AsyncStorage.getItem(`@GG:${type}`);
    console.log(`::: AsyncStorage retrieved for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    console.log(" ::: AsyncStorage Error - Retriev/eData failed for ", type);
  }
};

export const removeData = async (type) => {
  try {
    const value = await AsyncStorage.removeItem(`@GG:${type}`);
    console.log(`::: AsyncStorage removed for ${type} with value: ${value}`);
    return value;
  } catch (error) {
    console.log(" ::: AsyncStorage Error - Remove data failed for ", type);
  }
};

/*
TO USE:
import { storedData, retrieveData } from 'src/utils/asyncData';

storeData('yourVarName', 'yourValue');

const myExample = retrieveData('yourVarName');
*/

export const useSave = () => {
  const [loaded, setLoaded] = useState(false);
  const [fishingEq, setFishingEq] = useRecoilState(fishingEquipment);

  useEffect(() => {
    async function fetchData() {
      const data = await retrieveData("SAVE");
      if (loaded && JSON.stringify(fishingEq) !== data) {
        setFishingEq({ ...fishingEq });
        await storeData("SAVE", JSON.stringify(fishingEq));
      }
    }
    fetchData();
  }, [fishingEq]);

  const loadSave = async () => {
    const data = await retrieveData("SAVE");

    if (!!data) {
      setFishingEq(JSON.parse(data));
    }

    setLoaded(true);
  };

  return loadSave;
};
