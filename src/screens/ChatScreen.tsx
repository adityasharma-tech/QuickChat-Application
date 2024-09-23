import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  BackHandler,
  FlatList,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {IconButton, MD2Colors, TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../utils/RootStackParamList.types';
import {useQuery, useRealm, useUser} from '@realm/react';
import {MyMessageText, UserMessageText} from '../components/MessageText';
import {useSocket} from '../config/socket.io/socket';
import {v4 as uuidv4} from 'uuid';
import {
  ConversationSchema,
  MessageSchema,
} from '../config/realm/schemas/ConversationSchema';

type ChatScreenProp = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({route, navigation}: ChatScreenProp) {
  const user = useUser();
  const realm = useRealm();
  const {socket} = useSocket();

  const scrollViewRef = useRef<ScrollView>(null);

  const [recipientFcm, setRecipientFcm] = React.useState(null);

  const [message, setMessage] = React.useState('');
  const [messageList, updateMessageList] = React.useState<
    {
      _id: string;
      phoneNumber: string;
      messageType:
        | 'text'
        | 'media/image'
        | 'media/video'
        | 'media/audio'
        | 'media/doc';
      replyId: string;
      message: string;
      caption: string;
      edited: boolean;
      timestamp: Date;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const getUserFcm = useMemo(async () => {
    const userCollection = user
      .mongoClient('mongodb-atlas')
      .db('quickchat')
      .collection('userdata');
    const rUser = await userCollection.findOne({
      phoneNumber: route.params.phoneNumber,
    });
    if (!rUser) return;
    // @ts-ignore
    return rUser.fcm_token;
  }, [user, route.params, recipientFcm]);

  const onRemoteMessage = useCallback(
    (data: any) => {
      const {
        message_id,
        message_mode,
        reply_id,
        message,
        phone_number,
        caption,
        seen
      }: any = data;
      try {
        const conversations = useQuery(ConversationSchema).filtered(
          `phoneNumber == $0`,
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
              `_id == $0`,
              message_id,
            );
            const oldMessage = messages.length > 0 ? messages[0] : null;
            if (oldMessage) {
              oldMessage.edited = true;
              oldMessage.seen = seen ?? false;
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

  const updateListenerCallback = useCallback(() => {
    const currentConversation = realm
      .objects('Conversation')
      .filtered('participants CONTAINS $0', route.params.phoneNumber);

    if (currentConversation.length > 0) {
      // @ts-ignore
      updateMessageList([...currentConversation[0].messages]);
    }
  }, [realm, Array, updateMessageList]);

  React.useEffect(() => {
    const conversation = realm
      .objects('Conversation')
      .filtered('participants CONTAINS $0', route.params.phoneNumber);

    if (conversation.length > 0) {
      // @ts-ignore
      updateMessageList([...conversation[0].messages]);
    }

    conversation.addListener(updateListenerCallback);

    return () => {
      conversation.removeListener(updateListenerCallback);
    };
  }, []);

  // Back Handler
  React.useEffect(() => {
    const backAction = () => {
      if (messageList.length > 0) {
        navigation.popToTop();
        return true;
      } else {
        return false;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [BackHandler]);

  // New Version Started

  const createMessage = useCallback(() => {
    if (!socket) return console.error('Socket not found.');
    socket.emit(
      'message:create',
      {
        message_id: uuidv4(),
        message_mode: 'text',
        reply_id: '',
        fcm_token: getUserFcm,
        message,
        caption: '',
        metadata: {
          avatar_url: `https://i.pravatar.cc/150?u=${user.customData.phoneNumber}`,
          phone_number: user.customData.phoneNumber,
          display_name: user.customData.phoneNumber,
        },
      },
      (response: any) => {
        console.log('Response from socket.io-message:create->', response);
        onRemoteMessage({
          message_id: uuidv4(),
          message_mode: 'text',
          reply_id: '',
          message,
          caption: '',
          phone_number: user.customData.phoneNumber,
          seen: true,
        });
      },
    );
    onRemoteMessage({
      message_id: uuidv4(),
      message_mode: 'text',
      reply_id: '',
      message,
      caption: '',
      phone_number: user.customData.phoneNumber,
    });
  }, [socket, uuidv4, user, onRemoteMessage, getUserFcm]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: MD2Colors.grey50,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderBottomWidth: 2,
          borderBottomColor: MD2Colors.grey200,
        }}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <IconButton
            icon="chevron-left"
            size={30}
            style={{
              marginVertical: 'auto',
            }}
            onPress={() => navigation.goBack()}
          />
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginVertical: 'auto',
            }}
            source={{
              uri: `https://i.pravatar.cc/50?u=${
                route.params._id ?? route.params.displayName
              }`,
            }}
          />
          <View
            style={{
              flexDirection: 'column',
              rowGap: 2,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              {route.params.displayName}
            </Text>
            <Text
              style={{
                color: MD2Colors.grey600,
              }}>
              {route.params.phoneNumber}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        />
        <IconButton onPress={() => {}} size={30} icon="video-outline" />
        <IconButton onPress={() => {}} size={30} icon="phone-outline" />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flexGrow: 1,
        }}>
        <ScrollView
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({animated: true})
          }
          scrollsToTop={false}
          ref={scrollViewRef}
          style={{
            position: 'absolute',
            bottom: 80,
            top: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 10,
          }}>
          <FlatList
            data={messageList}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) =>
              item.phoneNumber == user.customData.phoneNumber ? (
                <MyMessageText
                  key={item._id.toString()}
                  _id={item._id.toString()}
                  messageText={item.message}
                />
              ) : (
                <UserMessageText
                  key={item._id.toString()}
                  _id={item._id.toString()}
                  messageText={item.message}
                />
              )
            }
          />
        </ScrollView>
      </View>
      {/* Bottom Chat */}
      <View
        style={{
          bottom: 0,
          left: 0,
          right: 0,
          position: 'absolute',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 2,
          borderTopColor: MD2Colors.grey100,
          backgroundColor: 'white',
        }}>
        <IconButton onPress={() => {}} size={30} icon="plus" />

        <View
          style={{
            flex: 1,
          }}>
          <TextInput
            mode="outlined"
            onSubmitEditing={createMessage}
            blurOnSubmit={false}
            autoFocus={true}
            returnKeyType="send"
            onFocus={() => scrollViewRef.current?.scrollToEnd({animated: true})}
            value={message}
            onChangeText={setMessage}
            placeholder="Type message..."
            textColor="#737373"
            cursorColor="#000"
            outlineStyle={{
              borderRadius: 50,
            }}
            contentStyle={{
              backgroundColor: MD2Colors.grey200,
              fontSize: 20,
              borderRadius: 50,
              paddingHorizontal: 20,
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 'auto',
            }}
          />
        </View>
        <IconButton
          loading={loading}
          onPress={createMessage}
          size={30}
          icon={message.length <= 0 ? 'microphone-outline' : 'send'}
        />
      </View>
    </View>
  );
}
