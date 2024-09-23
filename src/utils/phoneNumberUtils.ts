import parsePhoneNumber from 'libphonenumber-js';
import {DefaultContactT} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function parseMobileNumber(phoneNumber: string) {
  let parseNum = parsePhoneNumber(phoneNumber, 'IN');
  return parseNum;
}

export function removeDuplicatePhoneNumbers(
  contacts: DefaultContactT[],
): DefaultContactT[] {
  const uniqueContacts: DefaultContactT[] = [];

  const phoneNumbersSet: Set<string> = new Set();

  contacts.forEach(contact => {
    if (!phoneNumbersSet.has(contact.phoneNumber)) {
      uniqueContacts.push(contact);
      phoneNumbersSet.add(contact.phoneNumber);
    }
  });

  return uniqueContacts;
}

export const savePhoneNumber = async (user: {
  phoneNumber: string;
}) => {
  try {
    const userData = JSON.stringify(user);
    await AsyncStorage.setItem('user', userData);
    console.log('User data saved to Local Storage');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getPhoneNumber = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData !== null) {
      const user = JSON.parse(userData);
      console.log('User data retrieved:', user);
      return user;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
};

export const removePhoneNumber = async () => {
  try {
    await AsyncStorage.removeItem('user');
    console.log('User data removed from Local Storage');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};
