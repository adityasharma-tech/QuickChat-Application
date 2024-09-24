/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import AppWrapper from './src/AppWrapper';

// imports
import messaging from '@react-native-firebase/messaging';
import Realm from 'realm';
import uuid from 'react-native-uuid';
import {
  ConversationSchema,
  MessageSchema,
} from './src/config/realm/schemas/ConversationSchema';
import {UserSchema} from './src/config/realm/schemas/UserSchema';

const onRemoteMessage = (realm, data) => {
  const {message_id, message_mode, reply_id, message, _from, caption} = data;
  try {
    console.log('onRemoteMessage: ', 'entered', data);
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
        console.log('onRemoteMessage: ', 'conversation exists');
        const oldConversation = realm.objectForPrimaryKey(
          'Conversation',
          conversation._id,
        );
        const oldMessage = realm.objectForPrimaryKey('Message', message_id);

        console.log('onRemoteMessage: ', 'oldMessage:', oldMessage);

        if (oldMessage) {
          oldMessage.edited = true;
          oldMessage.message = message;
        } else {
          // @ts-ignore
          oldConversation.messages.push(newMessage);
        }
      } else {
        console.log('onRemoteMessage: ', 'no converation found');
        realm.create('Conversation', {
          _id: uuid.v4().toString(),
          phoneNumber: _from,
          messages: [newMessage],
        });
      }
    });
  } catch (error) {
    console.error(
      'onRemoteMessage: ',
      'Getting error during Saving RemoteMessage: ',
      error,
    );
  }
};
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const realm = await Realm.open({
    path: 'default.realm',
    schema: [MessageSchema, UserSchema, ConversationSchema],
  });
  onRemoteMessage(realm, remoteMessage.data);
});

AppRegistry.registerComponent(appName, () => AppWrapper);
