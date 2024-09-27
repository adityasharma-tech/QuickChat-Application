import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import { MD3Colors } from 'react-native-paper';

export default function ConversationItem({onPress, idx, _id, time, lastMessage, phoneNumber, profileName, profilePhoto}: {
    onPress: any;
    idx: number;
    _id: string;
    time: string;
    lastMessage: string;
    phoneNumber: string;
    profileName: string;
    profilePhoto: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
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
          source={{
            uri: profilePhoto,
          }}
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
              color: 'black'
            }}>
            {profileName.trim()=="" ? profileName.trim() == "Unknown" ? phoneNumber : profileName : profileName}
          </Text>
          <Text
            style={{
              color: true ? MD3Colors.neutral50 : 'black',
              fontWeight: true ? '500' : 'semibold',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {lastMessage}
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
            {time}
          </Text>
          {/* {c.unviewedChats == 0 ? null : (
                      <Text
                        style={{
                          fontSize: 10,
                          color: 'black',
                          fontWeight: 'bold',
                          backgroundColor: '#FDC604',
                          width: 20,
                          height: 20,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          borderRadius: 50,
                          marginLeft: 'auto',
                          marginRight: 5,
                          marginBottom: 10,
                        }}>
                        {c.unviewedChats}
                      </Text>
                    )} */}
        </View>
      </View>
    </TouchableOpacity>
  );
}
