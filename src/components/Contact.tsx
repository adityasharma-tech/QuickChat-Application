import {TouchableOpacity, View} from 'react-native';
import {DefaultContactT} from '../lib/constants';
import {MD3Colors, Text} from 'react-native-paper';

export default function ContactComponent(
  { props, handleNavigation }: {
    props: DefaultContactT,
    handleNavigation: Function
  }
): React.JSX.Element {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={()=>handleNavigation(props.phoneNumber)}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.2,
        borderBottomColor: MD3Colors.neutral70,
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: 14,
          }}>
          {props.contactName}
        </Text>
        <Text
          style={{
            fontSize: 10,
          }}>
          {props.phoneNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
