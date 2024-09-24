import React, {useCallback} from 'react';

import {
  FlatList,
  Image,
  PermissionsAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
  TextInput,
} from 'react-native-paper';
import Contacts from 'react-native-contacts';

// skeleton
import ChatSkeleton from '../components/skeleton/ChatSkeleton';

import {RootStackParamList} from '../utils/RootStackParamList.types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useUser} from '@realm/react';
import {parsePhoneNumber} from 'libphonenumber-js';
import {removeDuplicatePhoneNumbers} from '../utils/phoneNumberUtils';
import {Dialog} from '@rneui/base';
import { colors } from '../utils/colors';

interface ContactT {
  contactName: string;
  phoneNumber: string;
}

type ContactScreenProp = NativeStackScreenProps<RootStackParamList, 'Contact'>;

export default function ContactScreen({navigation}: ContactScreenProp) {
  // hooks
  const user = useUser();

  // useState Hooks
  const [allContacts, setAllContacts] = React.useState<ContactT[]>([]);

  const [filteredContacts, setFilteredContacts] = React.useState<ContactT[]>(
    [],
  );

  const [loading, setLoading] = React.useState<boolean>(true);

  const [navigationLoading, setNavigationLoading] = React.useState(false);

  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // handling functions
  const handleNavigation = useCallback(
    async (phoneNumber: string, name: string) => {
      setNavigationLoading(true);
      try {
        const result: any = await user.functions.checkUserExists({
          phoneNumber: phoneNumber.replace('+', ''),
        });
        if (result.exists === true) {
          const myUser = result.user;
          navigation.navigate('Chat', {
            _id: myUser._id.toString(),
            displayName: name.trim() == '' ? myUser.name : name,
            phoneNumber: myUser.phoneNumber,
          });
        } else {
          setDialogVisible(true);
        }
      } catch (error) {
        setDialogVisible(true);
        console.error(error);
      } finally {
        setNavigationLoading(false);
      }
    },
    [setLoading, user, navigation, setDialogVisible],
  );

  const handleLoadContact = useCallback(async () => {
    Contacts.getAll()
      .then(c => {
        let contacts: ContactT[] = [
          {
            phoneNumber: '+911234567890',
            contactName: 'User 1',
          },
          {
            phoneNumber: '+911231231231',
            contactName: 'User 2',
          },
        ];
        // work with contacts
        for (let index = 0; index < c.length; index++) {
          const element = c[index];
          let duplicateNumbers: ContactT[] = [];
          for (let n = 0; n < element?.phoneNumbers.length; n++) {
            const num = element?.phoneNumbers[n];
            let finalNumber: any;
            try {
              finalNumber = parsePhoneNumber(
                num?.number.toString() || '',
                'IN',
              );
            } catch (error) {
              continue;
            }

            if (finalNumber) {
              duplicateNumbers.push({
                phoneNumber: finalNumber.number,
                contactName: element?.displayName,
              });
            }
          }
          contacts.push(...removeDuplicatePhoneNumbers(duplicateNumbers));
        }
        setAllContacts(contacts);
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => setLoading(false));
  }, [Contacts, parsePhoneNumber, allContacts, setAllContacts, setLoading]);

  const handlePermissionAndLoad = useCallback(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(async () => {
        await handleLoadContact();
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [PermissionsAndroid, handleLoadContact, setLoading]);

  const handleSearch = (query: string) => {
    setLoading(true);
    setSearchQuery(query);
    const filtered = allContacts.filter(contact => {
      const normalizedQuery = query.toLowerCase();
      return (
        contact.contactName.toLowerCase().includes(normalizedQuery) ||
        contact.phoneNumber.includes(query)
      );
    });
    setFilteredContacts(filtered);
    setLoading(false);
  };

  // useEffect hooks
  React.useEffect(() => {
    handlePermissionAndLoad();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
        {
          navigationLoading ? <View style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#00000080',
              zIndex: 5,
              justifyContent: 'center',
              flexDirection: 'column',
            },
          ]}>
            <View>
              <ActivityIndicator size={50} color={colors.primary}/>
            </View>
          </View> : null
        }
      <Dialog
        overlayStyle={{
          backgroundColor: 'white',
          borderRadius: 30,
          paddingVertical: 30,
        }}
        isVisible={dialogVisible}
        onBackdropPress={() => setDialogVisible(!dialogVisible)}>
        <Dialog.Title
          titleStyle={{
            color: 'black',
          }}
          title="User not found"
        />
        <Text>User is not on QuickChat</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
            mode="outlined"
            labelStyle={{
              color: '#000',
            }}
            onPress={() => setDialogVisible(false)}>
            Close
          </Button>
        </View>
      </Dialog>
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
          All Contacts
        </Text>
        <View
          style={{
            flex: 1,
          }}>
          <TextInput
            mode="outlined"
            inputMode="search"
            activeOutlineColor="#000"
            returnKeyType="search"
            onChangeText={setSearchQuery}
            onSubmitEditing={() => {
              handleSearch(searchQuery);
              return true;
            }}
            placeholder=" Search here..."
            placeholderTextColor={MD3Colors.neutral70}
            cursorColor="#000"
            outlineStyle={{
              borderRadius: 50,
            }}
            style={{
              fontSize: 16,
              paddingHorizontal: 10,
              color: MD3Colors.neutral30,
            }}
          />
        </View>
        <IconButton
          onPress={() => handleSearch(searchQuery)}
          size={30}
          icon="magnify"
        />
      </View>

      {!loading && allContacts.length <= 0 ? (
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
                Create Contact
              </Button>

              <Text
                numberOfLines={2}
                style={{
                  marginHorizontal: 20,
                  textAlign: 'center',
                  fontSize: 12,
                }}>
                {
                  'No Contact Found. Trace the journey from\n traditional wired setups to the.'
                }
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {loading ? (
        <ChatSkeleton headerShown={false} />
      ) : allContacts.length > 0 ? (
        <React.Fragment>
          {/* Contact Section */}
          {searchQuery.length <= 0 ? (
            <FlatList
              data={allContacts}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() =>
                    handleNavigation(item.phoneNumber, item.contactName)
                  }
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: 'center',
                  }}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                      }}
                      source={require('../assets/images/user.png')}
                    />
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {item.contactName}
                      </Text>
                      <Text
                        style={{
                          color: MD2Colors.grey800,
                          fontWeight: 'semibold',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {item.phoneNumber}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 50,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'right',
                          color: MD3Colors.neutral60,
                        }}>
                        Phone
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : null}
          {searchQuery.length > 0 && (
            <FlatList
              data={filteredContacts}
              renderItem={({item: c, index: idx}) => (
                <TouchableOpacity
                  onPress={() => handleNavigation(c.phoneNumber, c.contactName)}
                  activeOpacity={0.8}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    justifyContent: 'center',
                  }}
                  key={idx}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 50,
                      }}
                      source={require('../assets/images/user.png')}
                    />
                    <View
                      style={{
                        flex: 1,
                        paddingHorizontal: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {c.contactName}
                      </Text>
                      <Text
                        style={{
                          color: MD2Colors.grey800,
                          fontWeight: 'semibold',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {c.phoneNumber}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 50,
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          textAlign: 'right',
                          color: MD3Colors.neutral60,
                        }}>
                        Phone
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </React.Fragment>
      ) : null}
    </View>
  );
}
