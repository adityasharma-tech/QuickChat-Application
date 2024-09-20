import React, {useCallback} from 'react';

import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  InteractionManager,
  FlatList,
} from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';
import {getPhoneNumber} from '../utils/phoneNumberUtils';

// constants
import {createChatTypes, defaultStatus, TabNameE} from '../utils/constants';

// skeleton
import ChatSkeleton from '../components/skeleton/ChatSkeleton';
import StatusSkeleton from '../components/skeleton/StatusSkeleton';

import {BlurView} from '@react-native-community/blur';

// hook importsd
import {useAuth, useRealm, useUser} from '@realm/react';

// firebase
import messaging from '@react-native-firebase/messaging';
import {RootStackParamList} from '../utils/RootStackParamList.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ConversationItem from '../components/ConversationItem';
import ProfilePopup from '../components/ProfilePopup';
import {usePopup} from '../config/custom-providers/ProfileProvider';
import mongoose from 'mongoose';

// types
interface ConversationT {
  _id: mongoose.Types.ObjectId;
  messages: {
    _id: mongoose.Types.ObjectId;
    senderId: string;
    receiverId: string;
    messageText: string;
    timestamp: Date;
  }[];
  participants: string[];
}

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function ViewScreen({navigation}: HomeScreenProps) {
  // hooks
  const {logOut} = useAuth();
  const user = useUser();
  const realm = useRealm();
  const {showPopup} = usePopup();

  // use state hooks
  const [allConversations, setAllConversations] = React.useState<
    ConversationT[]
  >([]);
  const [userDataUpdating, isUserDataUpdating] = React.useState<boolean>(true);
  const [chatLoading, setChatLoading] = React.useState<boolean>(false);
  const [statusLoading, setStatusLoading] = React.useState<boolean>(false);

  // Animations
  const [inputViewExpanded, setInputViewExpanded] = React.useState(false);
  const widthAnim = React.useRef(new Animated.Value(0)).current;
  const inputRef = React.useRef<TextInput>(null);

  const handleSearchPress = () => {
    setInputViewExpanded(!inputViewExpanded);

    Animated.timing(widthAnim, {
      toValue: inputViewExpanded ? 0 : Dimensions.get('window').width,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      inputRef?.current?.focus();
    });
  };

  // handling new chat function
  const [visible, setVisible] = React.useState(false);
  const popupScale = React.useRef(new Animated.Value(0)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;

  const handleNewChatPopupOpen = () => {
    setVisible(true);

    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100, // Delay to start after the popup animation
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNewChatPopupClose = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    }); // Close the modal after the animation
  };

  const handleNavigationChange = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      InteractionManager.runAfterInteractions(() => {
        //@ts-ignore
        navigation.navigate('Contact');
      });
    });
  };

  const saveTokenToDb = React.useCallback(
    async (token: string) => {
      console.log('Saving token to realm db.', token);
      try {
        const customUserDataCollection = user
          .mongoClient('mongodb-atlas')
          .db('quickchat')
          .collection('userdata');
        const phoneNumber = user.customData.phoneNumber;
        if (!phoneNumber) return;

        const filter = {
          user_id: user.id,
        };

        const updateDoc = {
          $set: {
            user_id: user.id,
            fcm_token: token,
          },
        };

        const options = {
          upsert: true,
        };

        await customUserDataCollection.updateOne(filter, updateDoc, options);
        const customData = await user.refreshCustomData();
        console.log(customData);
      } catch (error: any) {
        throw new Error(error);
      }
    },
    [getPhoneNumber, user, logOut],
  );

  const writeCustomUserData = React.useCallback(async () => {
    try {
      const customUserDataCollection = user
        .mongoClient('mongodb-atlas')
        .db('quickchat')
        .collection('userdata');
      const {phoneNumber} = await getPhoneNumber();
      if (!phoneNumber) logOut();

      const filter = {
        user_id: user.id,
      };

      const updateDoc = {
        $set: {
          user_id: user.id,
          name: 'Custom Name',
          profilePicture: '',
          phoneNumber,
          created: true,
        },
      };

      const options = {
        upsert: true,
      };

      await customUserDataCollection.updateOne(filter, updateDoc, options);
      const customData = await user.refreshCustomData();
      console.log(customData);
    } catch (error: any) {
      throw new Error(error);
    }
  }, [user, getPhoneNumber, logOut]);

  const updateConversationListListener = useCallback(() => {
    const conversationCollection = realm.objects('Conversation');

    // @ts-ignore
    setAllConversations([...conversationCollection]);
  }, []);

  const deleteAllRealmData = useCallback(() => {
    try {
      realm.write(() => {
        realm.deleteAll(); // Delete all Realm data
      });
      console.log('All Realm data has been deleted.');
    } catch (error) {
      console.error('Error while deleting Realm data:', error);
    }
  }, [realm]);

  const logoutUser = useCallback(async () => {
    try {
      if (user) {
        deleteAllRealmData();
        await logOut();
        console.log('User logged out successfully.');
      }
    } catch (error) {
      console.error('Error logging out user:', error);
    }
  }, [user]);

  React.useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDb(token as string);
      })
      .catch(err => console.error(err));

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDb(token as string);
    });
  }, [messaging, saveTokenToDb]);

  React.useEffect(() => {
    (async () => {
      if (!user.customData.created) {
        isUserDataUpdating(true);
        await writeCustomUserData();
        isUserDataUpdating(false);
      } else {
        isUserDataUpdating(false);
      }
    })();
  }, [writeCustomUserData, isUserDataUpdating]);

  React.useEffect(() => {
    const conversationCollection = realm.objects('Conversation');

    // @ts-ignore
    setAllConversations([...conversationCollection]);

    // Listener for any changes
    conversationCollection.addListener(updateConversationListListener);

    // Clean up the listener when the component unmounts
    return () => {
      conversationCollection.removeListener(updateConversationListListener);
    };
  }, [realm]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
      <ProfilePopup />
      {/** Floting create chat **/}
      {visible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.5,
            }}
            blurType="dark"
            blurAmount={2}
          />
          <Animated.View
            style={[
              {
                height: 250,
                backgroundColor: 'white',
                borderRadius: 30,
                flexDirection: 'column',
                flex: 1,
                position: 'absolute',
                elevation: 0,
                bottom: 80,
                left: 20,
                right: 20,
                zIndex: 20,
              },
              {
                transform: [{scale: popupScale}],
              },
            ]}>
            {createChatTypes.map((props, idx) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flex: 1,
                }}
                key={idx}
                onPress={handleNavigationChange}>
                {idx != 0 ? <Divider /> : null}
                <View
                  style={{
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    flexGrow: 1,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <IconButton
                      style={{
                        alignSelf: 'center',
                      }}
                      icon={props.icon}
                      size={30}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '80%',
                        borderBottomWidth: 0.2,
                        borderBottomColor: MD3Colors.neutral70,
                        justifyContent: 'space-between',
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            fontWeight: '700',
                            fontSize: 14,
                          }}>
                          {props.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                          }}>
                          {props.desc}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>

          <Animated.View
            style={[
              {
                height: 80,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                alignSelf: 'center',
                zIndex: 30,
              },
              {
                opacity: buttonOpacity,
              },
            ]}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
                justifyContent: 'center',
                flexDirection: 'row',
                columnGap: 5,
              }}>
              <View
                style={{
                  width: 100,
                }}
              />
              <Button
                onPress={handleNewChatPopupClose}
                style={{
                  flex: 1,
                }}
                labelStyle={{
                  color: 'black',
                  fontWeight: 200,
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  height: 43,
                  borderRadius: 50,
                }}>
                Cancel
              </Button>
              <View
                style={{
                  width: 100,
                }}
              />
            </View>
          </Animated.View>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        <Text
          style={{
            paddingHorizontal: 15,
            height: '100%',
            fontSize: 20,
            fontWeight: 'bold',
            textAlignVertical: 'center',
          }}>
          QuickChat
        </Text>
        <View
          style={{
            flex: 1,
          }}>
          <Animated.View
            style={[
              {overflow: 'hidden'},
              {
                width: widthAnim,
                backgroundColor: MD3Colors.neutral90,
                borderRadius: 30,
                marginVertical: 5,
              },
            ]}>
            <TextInput
              inputMode="search"
              returnKeyType="search"
              onSubmitEditing={() => {
                handleSearchPress();
                return true;
              }}
              ref={inputRef}
              placeholder=" Search here..."
              placeholderTextColor={MD3Colors.neutral70}
              cursorColor="#000"
              style={{
                paddingHorizontal: 20,
                fontSize: 16,
                color: MD3Colors.neutral30,
              }}
            />
          </Animated.View>
        </View>
        <IconButton onPress={handleSearchPress} size={30} icon="magnify" />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <ScrollView
          style={{
            height: 100,
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingStart: 20,
          }}
          horizontal>
          {/* My Story */}
          <View
            style={{
              width: 70,
              marginRight: 10,
            }}>
            <View
              style={{
                flexDirection: 'column',
                rowGap: 5,
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: MD3Colors.neutral70,
                  justifyContent: 'center',
                }}>
                <IconButton
                  style={{
                    width: '100%',
                    margin: 0,
                  }}
                  size={30}
                  icon="plus"
                />
              </TouchableOpacity>
              <Text
                style={{
                  width: 70,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 'condensedBold',
                }}>
                Your Story
              </Text>
            </View>
          </View>
          {statusLoading ? (
            <StatusSkeleton />
          ) : defaultStatus.length > 0 ? (
            defaultStatus.map((i, idx) => (
              <View
                key={idx}
                style={{
                  width: 70,
                  marginRight: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                    rowGap: 5,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 50,
                      borderWidth: 2,
                      borderStyle: 'solid',
                      borderColor: MD2Colors.amber50,
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 50,
                      }}
                      source={{
                        uri: 'https://i.pravatar.cc/70?u=' + i.profileName,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      width: 70,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 'condensedBold',
                    }}>
                    {i.profileName}
                  </Text>
                </View>
              </View>
            ))
          ) : null}
        </ScrollView>
      </View>

      {allConversations.length <= 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                rowGap: 5,
              }}>
              <Button
                onPress={() => navigation.navigate('Contact')}
                style={{
                  width: 200,
                  height: 50,
                  borderRadius: 100,
                  alignSelf: 'center',
                }}
                labelStyle={{
                  color: '#063D30',
                  fontWeight: 200,
                }}
                contentStyle={{
                  backgroundColor: '#FBD717',
                  height: 43,
                  borderRadius: 50,
                }}
                icon="plus">
                New Chat
              </Button>

              <Text
                numberOfLines={2}
                style={{
                  marginHorizontal: 20,
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                {'Trace the journey from traditional\n wired setups to the.'}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {chatLoading ? (
        <ChatSkeleton />
      ) : allConversations.length > 0 ? (
        <ScrollView>
          {/* Chat Section */}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}>
              <Text
                style={{
                  paddingHorizontal: 15,
                  height: '100%',
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlignVertical: 'center',
                }}>
                Chats
              </Text>
              <IconButton
                onPress={() => console.log('Searching....')}
                size={30}
                icon="dots-horizontal"
              />
            </View>
          </View>
          <FlatList
            data={allConversations}
            keyExtractor={item => item._id.toString()}
            renderItem={({item, index}) => (
              <ConversationItem
                onPress={() =>
                  navigation.navigate('Chat', {
                    displayName: item.participants[1],
                    phoneNumber: item.participants[1],
                    _id: item._id.toString(),
                  })
                }
                _id={item._id.toString()}
                lastMessage={
                  allConversations[index].messages[
                    allConversations[index].messages.length - 1
                  ].messageText
                }
                time={allConversations[index].messages[
                  allConversations[index].messages.length - 1
                ].timestamp.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false, // Ensures 24-hour format
                })}
                idx={index}
                phoneNumber={item.participants[1]}
              />
            )}
          />
        </ScrollView>
      ) : null}
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 15,
          justifyContent:
            allConversations.length > 0 ? 'center' : 'space-around',
          flexDirection: 'row',
          backgroundColor: 'white',
          columnGap: 5,
        }}>
        <IconButton
          style={{
            marginHorizontal: 0,
            width: 100,
            marginVertical: 0,
          }}
          onPress={() => {}}
          icon="home-outline"
        />
        {allConversations.length > 0 ? (
          <Button
            onPress={handleNewChatPopupOpen}
            style={{
              flex: 1,
            }}
            labelStyle={{
              color: 'white',
              fontWeight: 200,
            }}
            contentStyle={{
              backgroundColor: 'black',
              height: 43,
              borderRadius: 50,
            }}
            icon="plus">
            New Chat
          </Button>
        ) : null}
        <IconButton
          style={{
            marginVertical: 0,
            marginHorizontal: 0,
            width: 100,
          }}
          onPress={showPopup}
          icon="account-outline"
        />
      </View>
    </View>
  );
}
