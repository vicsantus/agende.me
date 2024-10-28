import AsyncStorage from "@react-native-async-storage/async-storage";

// const defaultOptions = {
//   keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
// };

async function saveAcessTokenInStorage(accessToken, refreshToken) {
  await AsyncStorage.setItem(
    "Session",
    JSON.stringify({ accessToken, refreshToken }),
  );
}

async function getTokensInStorage() {
  const acessData = await AsyncStorage.getItem("Session");

  return JSON.parse(acessData);
}

async function saveDataInStorage(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

async function getDataInsInStorage(data) {
  const acessData = await AsyncStorage.getItem(data);

  return JSON.parse(acessData);
}

async function getAllKeys() {
  const allKeys = await AsyncStorage.getAllKeys();
  console.log("allKeys", allKeys);
  return allKeys;
}

async function clearTokensInStorage() {
  const allKeys = await getAllKeys();
  await AsyncStorage.multiRemove(allKeys);
}

async function removeKeyInStorage(key) {
  await AsyncStorage.removeItem(key);
}

export {
  clearTokensInStorage, getDataInsInStorage, getTokensInStorage, removeKeyInStorage, saveAcessTokenInStorage, saveDataInStorage
};

