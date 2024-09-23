/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppWrapper from './src/AppWrapper';

// imports
import messaging from '@react-native-firebase/messaging';
import Realm from 'realm';
import {v4 as uuidv4} from 'uuid';
import {
  ConversationSchema,
  MessageSchema,
} from './src/config/realm/schemas/ConversationSchema';
import {UserSchema} from './src/config/realm/schemas/UserSchema';
import {getPhoneNumber} from './src/utils/phoneNumberUtils';
import {
  addMessageToConversation,
  checkConversationExists,
  createNewConversation,
} from './src/config/realm/realm';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    '@messaging.setBackgroundMessageHandler.remoteMessage:',
    remoteMessage,
  );
  const realm = await Realm.open({
    path: 'default.realm',
    schema: [MessageSchema, UserSchema, ConversationSchema],
  });
  try {
    const {phoneNumber} = await getPhoneNumber();
    realm.write(() => {
      checkConversationExists(
        realm,
        `${remoteMessage?.data?.phoneNumber}`,
      ).then(conversation => {
        if (conversation) {
          console.log('conversation', conversation);
          const cid = conversation[0]._id;
          console.log('@cid', cid);
          if (!cid) {return;}
          addMessageToConversation(realm, uuidv4(), remoteMessage.data.phoneNumber,  phoneNumber, remoteMessage.data.message);
        } else {
          createNewConversation(
            realm,
            [`${phoneNumber}`, `${remoteMessage.data.phoneNumber}`],
            `${remoteMessage.data.message}`,
          );
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
});

AppRegistry.registerComponent(appName, () => AppWrapper);
