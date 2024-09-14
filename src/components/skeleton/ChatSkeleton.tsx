import { ScrollView, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {Skeleton} from '@rneui/themed';

export default function ChatSkeleton({headerShown = true}: {
  headerShown?: boolean;
}) {
  return (
    <ScrollView>
      {/* Chat Section */}
      {headerShown && <View
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
      </View>}
      {Array.from({length: 5}).map((c, idx) => (
        <View
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
            <Skeleton
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
              }}
            />
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
                flexDirection: 'column',
                justifyContent: 'center',
                paddingVertical: 12,
                rowGap: 5,
              }}>
              <Skeleton
                style={{
                  width: 200,
                  height: 18,
                  borderRadius: 8,
                }}
              />
              <Skeleton
                style={{
                  flexGrow: 1,
                  borderRadius: 8,
                }}
              />
            </View>
            <View
              style={{
                width: 50,
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}>
              <Skeleton
                style={{
                  width: 30,
                  height: 8,
                  borderRadius: 10,
                }}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
