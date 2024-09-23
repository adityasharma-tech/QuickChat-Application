import {View, Text} from 'react-native';
import React from 'react';
import {Skeleton} from '@rneui/base';

export default function StatusSkeleton() {
  return Array.from({length: 3}).map(() => (
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
        <Skeleton
        animation="pulse"
        circle
        width={70}
        height={70}
        />
        <Skeleton
          style={{
            width: 40,
            borderRadius: 10,
            alignSelf: 'center',
          }}
        />
      </View>
    </View>
  ));
}
