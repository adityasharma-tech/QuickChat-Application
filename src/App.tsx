/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import mongoose from 'mongoose';
import { refreshKey } from './config/redux/slices/appSlice';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import {RootStackParamList} from './utils/RootStackParamList.types';
import { PermissionsAndroid } from 'react-native';

// navigation
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';

// hooks import
import { useRealm, useUser } from '@realm/react'
import { addMessageToConversation, checkConversationWithSenderId, createNewConversation } from './config/realm/realm';
import { useAppDispatch } from './config/redux/hooks';
import ChatScreen from './screens/ChatScreen';

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
                  new mongoose.Types.ObjectId(cid),
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

  let navigationRef = React.useRef<NavigationContainerRef<RootStackParamList>|null>(null);


  const navigateOnRecievingCallback = React.useCallback((remoteMessage: FirebaseMessagingTypes.RemoteMessage|null)=>{
    if(remoteMessage){
      // @ts-ignore
      const { phoneNumber, displayName } = remoteMessage.data;

      navigationRef.current?.navigate('Chat', { phoneNumber, displayName })
    }
  }, [navigationRef])

  React.useEffect(() => {
    // Handle notification when the app is opened from a quit state
    messaging().getInitialNotification().then(navigateOnRecievingCallback);

    // Handle notification when the app is in the background or foreground
    const unsubscribe = messaging().onNotificationOpenedApp(navigateOnRecievingCallback);

    return unsubscribe;
  }, [messaging]);

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <React.Fragment>
          <RootStack.Screen name="Home" component={HomeScreen} />
          <RootStack.Screen name="Contact" component={ContactScreen} />
          <RootStack.Screen name="Chat" component={ChatScreen} />
        </React.Fragment>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
