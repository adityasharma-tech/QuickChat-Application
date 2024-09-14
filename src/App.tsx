/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { BSON } from 'realm'
import { refreshKey } from './config/redux/slices/appSlice';
// navigation
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import HomeScreen from './screens/HomeScreen';
import {RootStackParamList} from './utils/RootStackParamList.types';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// hooks import
import { useRealm, useUser } from '@realm/react'
import { addMessageToConversation, checkConversationWithSenderId, createNewConversation } from './config/realm/realm';
import { useAppDispatch } from './config/redux/hooks';
import ViewScreen from './screens/ViewScreen';

export default function App() {
  // hooks
  const RootStack = createNativeStackNavigator<RootStackParamList>();
  const realm = useRealm()
  const user = useUser()
  const dispatch = useAppDispatch()

  // request permission
  React.useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, [PermissionsAndroid]);

  // handling messages
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      try {
        realm.write(() => {
          checkConversationWithSenderId(
            realm,
            `${remoteMessage?.data?.phoneNumber}`,
          ).then((conversation: any) => {
            if (conversation) {
              const cid = conversation[0]._id;
              if (cid) {
                addMessageToConversation(
                  realm,
                  new BSON.ObjectId(cid),
                  `${remoteMessage?.data?.phoneNumber}`,
                  `${user.customData?.phoneNumber}`,
                  `${remoteMessage?.data?.message}`,
                );
              }
            } else {
              createNewConversation(
                realm,
                [
                  `${user.customData?.phoneNumber}`,
                  `${remoteMessage?.data?.phoneNumber}`,
                ],
                `${remoteMessage?.data?.message}`,
              );
            }
          });
        });
      } catch (error: any) {
        console.error(error);
      } finally {
        dispatch(refreshKey());
      }
    });

    return unsubscribe;
  }, []);


  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <React.Fragment>
          <RootStack.Screen name="Home" component={ViewScreen} />
        </React.Fragment>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
