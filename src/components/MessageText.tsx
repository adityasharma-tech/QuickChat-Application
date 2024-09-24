import {View, Text} from 'react-native';
import React from 'react';
import { colors } from '../utils/colors';
import { MD2Colors } from 'react-native-paper';

export function MyMessageText({
  _id,
  messageText,
  seen
}: {
  _id: string;
  messageText: string;
  seen: boolean
}) {
  return (
    <View
      key={_id}
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 3,
      }}>
      <Text
        style={{
          color: '#000',
          fontSize: 16,
          paddingHorizontal: 15,
          paddingVertical: 7,
          borderRadius: 10,
          opacity: seen ? 1 : 0.5,
          backgroundColor: colors.primary,
        }}>
        {messageText}
      </Text>
    </View>
  );
}

export function UserMessageText({
    _id,
    messageText
  }: {
    _id: string;
    messageText: string;
  }) {
  return (
    <View
      key={_id.toString()}
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 3,
      }}>
      <Text
        style={{
          color: '#000',
          paddingHorizontal: 15,
          paddingVertical: 7,
          borderRadius: 10,
          backgroundColor: MD2Colors.grey200,
        }}>
        {messageText}
      </Text>
    </View>
  );
}
