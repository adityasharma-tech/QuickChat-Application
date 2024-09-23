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
import {v4 as uuidv4} from 'uuid';

// navigation
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import HomeScreen from './screens/HomeScreen';
import ContactScreen from './screens/ContactScreen';

// hooks import
import {useQuery, useRealm} from '@realm/react';
import ChatScreen from './screens/ChatScreen';
import {useSocket} from './config/socket.io/socket';
import {
  ConversationSchema,
  MessageSchema,
} from './config/realm/schemas/ConversationSchema';

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
        const {phone_number, display_name} = remoteMessage.data;

        navigationRef.current?.navigate('Chat', {
          phoneNumber: phone_number,
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
        phone_number,
        caption,
      }: any = data;
      try {
        const conversations = useQuery(ConversationSchema).filtered(
          'phoneNumber == $0',
          phone_number,
        );

        const conversation = conversations.length > 0 ? conversations[0] : null;
        realm.write(() => {
          const newMessage = realm.create('Message', {
            _id: uuidv4(),
            phoneNumber: phone_number,
            messageType: message_mode,
            replyId: reply_id,
            message,
            caption,
            edited: false,
            timestamp: new Date(),
          });
          if (conversation) {
            const messages = useQuery(MessageSchema).filtered(
              '_id == $0',
              message_id,
            );

            const oldMessage = messages.length > 0 ? messages[0] : null;
            if (oldMessage) {
              oldMessage.edited = true;
              oldMessage.message = message;
            } else {
              // @ts-ignore
              conversation.messages.push(newMessage);
            }
          } else {
            realm.create('Conversation', {
              _id: uuidv4(),
              phoneNumber: phone_number,
              messages: [newMessage],
            });
          }
        });
      } catch (error) {
        console.error('Getting error during Saving RemoteMessage: ', error);
      }
    },
    [useQuery, ConversationSchema, realm, uuidv4, Date],
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
