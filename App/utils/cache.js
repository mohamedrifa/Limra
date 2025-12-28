import AsyncStorage from "@react-native-async-storage/async-storage";

export const setCache = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log("Cache set error:", e);
  }
};

export const getCache = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("Cache get error:", e);
    return null;
  }
};

export const clearCache = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log("Cache clear error:", e);
  }
};
