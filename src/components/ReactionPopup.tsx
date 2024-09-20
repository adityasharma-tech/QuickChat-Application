import { View, Text, Animated, TouchableOpacity } from 'react-native'
import React from 'react'
import { BlurView } from '@react-native-community/blur';
import { Divider, IconButton, MD2Colors } from 'react-native-paper';
import { reactIcons, specificChatReplyOptions } from '../utils/constants';

export default function ReactionPopup() {
  // handling new chat function
  const [visible, setVisible] = React.useState(false);
  const popupScale = React.useRef(new Animated.Value(0)).current;

  const handleNewChatPopupOpen = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handleNewChatPopupClose = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
    }); // Close the modal after the animation
  };

  
    return (
      visible && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}>
          <BlurView
            onTouchEndCapture={() => handleNewChatPopupClose()}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
              opacity: 0.5
            }}
            blurType="dark"
            blurAmount={2}
          />
          <Animated.View
            style={[
              {
                minHeight: 250,
                backgroundColor: 'white',
                borderRadius: 30,
                flexDirection: 'column',
                flex: 1,
                position: 'absolute',
                elevation: 0,
                bottom: 20,
                left: 20,
                right: 20,
                zIndex: 20,
              },
              {
                transform: [{translateY: popupScale}],
              },
            ]}>
            <View
              style={{
                padding: 7,
                flexDirection: 'column',
                rowGap: 10,
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  width: 60,
                  alignSelf: 'center',
                  height: 5,
                  borderRadius: 50,
                  backgroundColor: MD2Colors.grey400,
                }}
              />
              <View
                style={{
                  backgroundColor: MD2Colors.grey200,
                  borderRadius: 12,
                  padding: 5,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={[
                    {
                      color: 'black',
                      fontSize: 16,
                    },
                  ]}>
                  Please help me find a good monitor for the design
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    textAlign: 'left',
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  React
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 10,
                  }}>
                  {reactIcons.map((ri, idx) => (
                    <TouchableOpacity activeOpacity={0.8} key={idx}>
                      <Text
                        style={{
                          fontSize: 30,
                        }}>
                        {ri}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View>
                  {specificChatReplyOptions.map((op, idx) => (
                    <React.Fragment key={idx}>
                      {idx == 0 ? null : <Divider />}
                      <TouchableOpacity onPress={op.onPress} activeOpacity={0.7}>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}>
                          <Text style={{
                            color: 'black',
                            fontWeight: 'bold',
                            fontSize: 16,
                            verticalAlign: 'middle'
                          }}>{op.optionName}</Text>
                          <IconButton icon={op.optionIcon} />
                        </View>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      )
    );
}