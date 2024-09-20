import {
  View,
  Text,
  Image,
  StatusBar,
  GestureResponderEvent,
} from 'react-native';
import React from 'react';
import {Button, MD2Colors} from 'react-native-paper';
import {colors} from '../utils/colors';

export default function GuideScreenComponent({
  onPress,
}: {
  onPress: (e: GestureResponderEvent) => void;
}) {

  return (
    <View
      style={{
        padding: 20,
        height: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <StatusBar
        backgroundColor={'white'}
        barStyle={'dark-content'}
        translucent
      />
      <Image
        style={{
          width: '100%',
          height: 500,
          objectFit: 'contain',
        }}
        source={require('../assets/images/startup.png')}
      />
      <View
        style={{
          justifyContent: 'space-between',
          flexGrow: 1,
        }}>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: 'black',
              fontSize: 29,
              fontWeight: 'bold',
            }}>
            Welcome to QuickChat
          </Text>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 25,
              color: MD2Colors.grey600,
            }}
            numberOfLines={
              2
            }>{`Share with anynone, anywhere.\nA home for all the groups in your life.`}</Text>
        </View>
        <View
          style={{
            rowGap: 10,
            paddingBottom: 10,
          }}>
          <Button
            onPress={onPress}
            theme={{
              colors: {
                primary: colors.primary,
              },
            }}
            labelStyle={{
              color: 'black',
            }}
            contentStyle={{
              paddingVertical: 2,
            }}
            style={{
              borderRadius: 50,
            }}
            mode="contained">
            Sign in
          </Button>
          <Button
            onPress={onPress}
            theme={{
              colors: {
                primary: colors.primary,
              },
            }}
            contentStyle={{
              paddingVertical: 2,
              borderWidth: 0,
            }}
            style={{
              borderRadius: 50,
              borderColor: MD2Colors.grey500,
            }}
            labelStyle={{
              color: 'black',
            }}
            mode="outlined">
            Create an account
          </Button>
        </View>
      </View>
    </View>
  );
}
