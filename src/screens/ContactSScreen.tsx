import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Dialog, IconButton, Portal, Text} from 'react-native-paper';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {DefaultContactT} from '../utils/constants';
import {removeDuplicatePhoneNumbers} from '../utils/phoneNumberUtils';
import ContactComponent from '../components/Contact';
import {useUser} from '@realm/react';
import {parsePhoneNumber} from 'libphonenumber-js';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../utils/RootStackParamList.types';


type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;
type Props = {
  navigation: ProfileScreenNavigationProp;
};


export default function ContactScreen({navigation}: Props) {
  const [contacts, setContacts] = React.useState<DefaultContactT[]>([
    {
      phoneNumber: '+911234567890',
      contactName: 'User 1',
    },
    {
      phoneNumber: '+911231231231',
      contactName: 'User 2',
    },
  ]);
  const [loading, setLoading] = React.useState(true);
  const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
  const user = useUser();

  async function handleNavigation(phoneNumber: string, name: string) {
    setLoading(true);
    try {
      const result: any = await user.functions.checkUserExists({
        phoneNumber: phoneNumber.replace('+', ''),
      });
      if (result['exists'] === true) {
        const myUser = result['user'];
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
      setLoading(false);
    }
  }

  React.useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        console.log('Permission: ', res);
        Contacts.getAll()
          .then(c => {
            let allContact: DefaultContactT[] = [
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
              let duplicateNumbers: DefaultContactT[] = [];
              for (let n = 0; n < element?.phoneNumbers.length; n++) {
                const num = element?.phoneNumbers[n];
                let finalNumber: any;
                try {
                  finalNumber = parsePhoneNumber(
                    num?.number.toString() || '',
                    'IN',
                  );
                } catch (error) {
                  console.error(error);
                  continue;
                }
                if (finalNumber) {
                  duplicateNumbers.push({
                    phoneNumber: finalNumber.number,
                    contactName: element?.displayName,
                  });
                }
              }
              allContact.push(...removeDuplicatePhoneNumbers(duplicateNumbers));
            }
            setContacts(allContact);
            setLoading(false);
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  }, []);

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'white',
        position: 'relative',
      }}>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#000000B3',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Button loading>Loading...</Button>
          </View>
        </View>
      ) : null}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>User not found</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">User is not on QuickChat</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Got it</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View
        style={{
          height: 60,
          elevation: 10,
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingHorizontal: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 5,
            }}>
            <IconButton
              icon="arrow-left-thick"
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                height: '100%',
                fontWeight: 'medium',
              }}>
              Your Contacts
            </Text>
          </View>
        </View>
      </View>
      {loading && contacts.length <= 0 ? null : (
        <ScrollView>
          {contacts.map((props, idx) => (
            <ContactComponent
              key={idx}
              props={props}
              handleNavigation={() =>
                handleNavigation(props.phoneNumber, props.contactName)
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
