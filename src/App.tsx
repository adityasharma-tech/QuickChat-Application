/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {RootStackParamList} from './utils/RootStackParamList.types';
import {PermissionsAndroid} from 'react-native';
import uuid from 'react-native-uuid';

// navigation
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// notification
import notifee from '@notifee/react-native';

// screens
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';

// hooks import
import {useRealm} from '@realm/react';
import ChatScreen from './screens/ChatScreen';
import {useSocket} from './config/socket.io/socket';
import {ConversationSchema} from './config/realm/schemas/ConversationSchema';

export default function App() {
  // hooks
  const RootStack = createNativeStackNavigator<RootStackParamList>();

  const realm = useRealm();

  const {socket} = useSocket();

  let navigationRef =
    React.useRef<NavigationContainerRef<RootStackParamList> | null>(null);

  const navigateOnRecievingCallback = React.useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
      if (remoteMessage) {
        // @ts-ignore
        const {_from, display_name} = remoteMessage.data;

        navigationRef.current?.navigate('Chat', {
          phoneNumber: _from,
          displayName: display_name,
        });
      }
    },
    [navigationRef],
  );

  // request permission
  React.useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }, [PermissionsAndroid]);

  const onRemoteMessage = useCallback(
    (data: any) => {
      const {
        message_id,
        message_mode,
        reply_id,
        message,
        _from,
        caption,
      }: any = data;
      try {
        const conversations = realm
          .objects(`Conversation`)
          .filtered('phoneNumber == $0', _from);

        const conversation = conversations.length > 0 ? conversations[0] : null;
        realm.write(() => {
          const newMessage = realm.create('Message', {
            _id: uuid.v4().toString(),
            phoneNumber: _from,
            messageType: message_mode,
            replyId: reply_id,
            message,
            caption,
            edited: false,
            timestamp: new Date(),
          });
          if (conversation) {
            const oldConversation = realm.objectForPrimaryKey(
              'Conversation',
              conversation._id,
            );
            const oldMessage = realm.objectForPrimaryKey(`Message`, message_id);

            if (oldMessage) {
              oldMessage.edited = true;
              oldMessage.message = message;
            } else {
              // @ts-ignore
              oldConversation.messages.push(newMessage);
            }
          } else {
            realm.create('Conversation', {
              _id: uuid.v4().toString(),
              phoneNumber: _from,
              messages: [newMessage],
            });
          }
        });
      } catch (error) {
        console.error('Getting error during Saving RemoteMessage: ', error);
      }
    },
    [ConversationSchema, realm, uuid, Date],
  );

  // handling messages
  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onRemoteMessage(remoteMessage.data);
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    // Handle notification when the app is opened from a quit state
    messaging().getInitialNotification().then(navigateOnRecievingCallback);

    // Handle notification when the app is in the background or foreground
    const unsubscribe = messaging().onNotificationOpenedApp(
      navigateOnRecievingCallback,
    );

    return unsubscribe;
  }, [messaging]);

  // Socket Messaging Listener
  React.useEffect(() => {
    if (socket) {
      socket.on('message:recieved', data => {
        onRemoteMessage(data);
      });
      return () => {
        socket.off('message:recieved');
      };
    }
  }, [socket]);

  React.useEffect(()=>{
    notifee.cancelAllNotifications();
  }, [])

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
