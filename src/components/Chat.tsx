import {Image, TouchableOpacity, View} from 'react-native';
import {DefaultChatT} from '../utils/constants';
import {MD3Colors, Text} from 'react-native-paper';

export default function ChatComponent(props: DefaultChatT): React.JSX.Element {
  console.log(props);
  return (
    <TouchableOpacity onPress={props.onPress}>

    <View
      style={{
        paddingHorizontal: 10,
        backgroundColor: 'white',
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 10,
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={{uri: props.profilePhoto}}
            />
        </View>
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
              {props.profileName}
            </Text>
            <Text
              style={{
                fontSize: 10,
              }}>
              {props.lastChat}
            </Text>
          </View>
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <Text
              style={{
                fontSize: 8,
                color: MD3Colors.neutral50,
              }}>
              {props.lastUpdatedAt.toLocaleTimeString()}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: 'white',
                backgroundColor: MD3Colors.error50,
                width: 15,
                height: 15,
                textAlign: 'center',
                borderRadius: 50,
                marginLeft: 'auto',
                marginRight: 5,
                marginBottom: 10,
              }}>
              1
            </Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
  );
}
