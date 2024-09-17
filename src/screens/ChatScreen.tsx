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
import {useRealm, useUser} from '@realm/react';
import {BSON} from 'realm';
import {apiRequest} from '../utils/api';
import {
  addMessageToConversation,
  checkConversationWithSenderId,
  createNewConversation,
} from '../config/realm/realm';
import {MyMessageText, UserMessageText} from '../components/MessageText';

type ChatScreenProp = NativeStackScreenProps<RootStackParamList, 'Chat'>;

export default function ChatScreen({route, navigation}: ChatScreenProp) {
  const user = useUser();
  const realm = useRealm();

  const scrollViewRef = useRef<ScrollView>(null);

  const [message, setMessage] = React.useState('');
  const [messageList, updateMessageList] = React.useState<
    {
      _id: BSON.ObjectId;
      senderId: string;
      receiverId: string;
      messageText: string;
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
  }, [user, route.params]);

  const createMessage = useCallback(async () => {
    if (message.trim() == '') {
      Alert.alert('message is empty');
      return;
    }
    setLoading(true);
    try {
      const token = await getUserFcm;
      console.log('@token', token);
      const response = await apiRequest(
        '/message',
        {
          fcm_token: token,
          content: {
            message,
            phoneNumber: user?.customData?.phoneNumber,
            type: 'text',
          },
        },
        'POST',
      );
      console.log('This is response from the server: ', response);
      if (response) {
        setMessage('');
        realm.write(() => {
          checkConversationWithSenderId(
            realm,
            `${route.params.phoneNumber}`,
          ).then((conversation: any) => {
            if (conversation) {
              const cid = conversation[0]._id;
              if (cid) {
                addMessageToConversation(
                  realm,
                  new BSON.ObjectId(cid),
                  `${user.customData?.phoneNumber}`, // senderId
                  `${route.params.phoneNumber}`, // receiverId
                  message,
                );
              }
            } else {
              createNewConversation(
                realm,
                [
                  `${user.customData?.phoneNumber}`, // senderId
                  `${route.params.phoneNumber}`, // recieverId
                ],
                message,
              );
            }
          });
        });
      } else {
        Alert.alert('Failed to send message');
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [getUserFcm, message, setMessage, route.params, apiRequest, setLoading]);

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
            // backgroundColor: 'black',
            paddingHorizontal: 10,
          }}>
          <FlatList
            data={messageList}
            keyExtractor={item => item._id.toString()}
            renderItem={({item}) =>
              item.senderId == user.customData.phoneNumber ? (
                <MyMessageText
                  key={item._id.toString()}
                  _id={item._id.toString()}
                  messageText={item.messageText}
                />
              ) : (
                <UserMessageText
                  key={item._id.toString()}
                  _id={item._id.toString()}
                  messageText={item.messageText}
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
