import React, {useCallback, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Button,
  IconButton,
  MD2Colors,
  MD3Colors,
  MD3LightTheme,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

const {width} = Dimensions.get('window');

export default function ViewScreen() {
  const theme = useTheme();
  const newTheme = {
    ...theme,
    colors: {
      primary: '#000',
    },
  };

  // use state hooks
  const [phoneNumberText, setPhoneNumberText] = React.useState<string>('');
  const [isOtpSendSuccess, setIsOtpSendSuccess] =
    React.useState<boolean>(false);

  // Animation value
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Handle phone input continue function
  const handlePhoneInputContinue = useCallback(() => {
    // Assuming OTP sent successfully, now start the animation
    setIsOtpSendSuccess(true);
    Animated.timing(slideAnim, {
      toValue: -width, // Move the phone input off-screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [setIsOtpSendSuccess, Animated, width, slideAnim]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: 'white',
      }}>
      {/* Topbar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}>
        <IconButton
          style={{
            borderWidth: 1,
            borderColor: MD3Colors.neutral80,
          }}
          size={30}
          icon="chevron-left"
        />
        <IconButton
          style={{
            borderWidth: 1,
            borderColor: MD3Colors.neutral80,
          }}
          size={30}
          icon="dots-horizontal"
        />
      </View>
      <Animated.View
        style={[
          {flexDirection: 'row', width: '200%'},
          {
            transform: [{translateX: slideAnim}],
          },
        ]}>
        <View
          style={{
            width: width,
          }}>
          {/* headings */}
          <View
            style={{
              justifyContent: 'center',
              rowGap: 10,
              paddingVertical: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 'semibold',
              }}>
              Let's join with us
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: MD2Colors.grey600,
              }}
              numberOfLines={2}>
              {'Enter your phone number/social\naccount to get started'}
            </Text>
          </View>

          {/* Phone number enter */}

          <View
            style={{
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                paddingVertical: 15,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Phone number
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 5,
              }}>
              <View
                style={{
                  borderWidth: 1,
                  backgroundColor: 'white',
                  borderRadius: 50,
                  borderColor: MD2Colors.grey600,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  paddingRight: 15,
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 20,
                    objectFit: 'contain',
                    alignSelf: 'center',
                  }}
                  source={require('../assets/images/india_flag.png')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                  }}>
                  +91
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}>
                <TextInput
                  disabled={isOtpSendSuccess}
                  onChangeText={text => {
                    const cleaned = text.replace(/\D/g, '');
                    const formatted = cleaned.match(/.{1,5}/g)?.join(' ') || '';
                    setPhoneNumberText(formatted);
                  }}
                  onSubmitEditing={handlePhoneInputContinue}
                  returnKeyType="next"
                  returnKeyLabel="continue"
                  inputMode="numeric"
                  placeholder="8123 3456 6789"
                  value={phoneNumberText}
                  maxLength={11}
                  theme={newTheme}
                  outlineStyle={{
                    borderRadius: 50,
                  }}
                  mode="outlined"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Otp Input View */}
        <View
          style={{
            width: width,
          }}>
          {/* headings */}
          <View
            style={{
              justifyContent: 'center',
              paddingVertical: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 'semibold',
                marginVertical: 15
              }}>
              Enter OTP code
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: MD2Colors.grey600,
              }}
              numberOfLines={2}>
              {`Enter the 6-digit code sent to +91 ${phoneNumberText}.`}
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: MD2Colors.grey600,
                }}
                numberOfLines={2}>
                {`Didn't get a code?  `}
              </Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* OTP Input Text */}
          
        </View>
      </Animated.View>

      <View
        style={{
          marginTop: 'auto',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Button
          disabled={phoneNumberText.trim().length != 11}
          onPress={handlePhoneInputContinue}
          style={{
            borderRadius: 50,
          }}
          contentStyle={{
            height: 50,
          }}
          theme={newTheme}
          mode="contained">
          Continue
        </Button>
      </View>
    </View>
  );
}
