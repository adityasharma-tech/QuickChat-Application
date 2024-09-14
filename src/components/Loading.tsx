import {View} from 'react-native';
import {Button} from 'react-native-paper';

export default function Loading() {
  return (
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
  );
}
