import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLastUpdateTime = async (): Promise<number | null> => {
  const lastUpdateTime = await AsyncStorage.getItem('lastUpdateTime');
  return lastUpdateTime ? parseInt(lastUpdateTime, 10) : null;
};

export const setLastUpdateTime = async (time: number): Promise<void> => {
  await AsyncStorage.setItem('lastUpdateTime', time.toString());
};
