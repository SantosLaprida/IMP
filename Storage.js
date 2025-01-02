import AsyncStorage from "@react-native-async-storage/async-storage";

// Save data
export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Error saving data

    console.error(error);
  }
};

// Load data
export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
    console.error(error);
  }
};
