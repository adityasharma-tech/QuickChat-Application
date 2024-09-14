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
import OTPInput from '../components/OTPInput';
import {colors} from '../utils/colors';
import {useAuth} from '@realm/react';
import {OTPWidget} from '@msg91comm/sendotp-react-native';
import {parsePhoneNumber} from 'libphonenumber-js';
import Toast from 'react-native-toast-message';
import {savePhoneNumber} from '../utils/phoneNumberUtils';

// constants & envs
const {width} = Dimensions.get('window');
const widgetId = process.env.MSG91_WIDGET_ID;
const tokenAuth = process.env.MSG91_TOKEN_AUTH;

// custom types
interface MSG91ResponseT {
  message: string;
  type: string;
}

export default function ViewScreen() {
  // hooks
  const theme = useTheme();
  const {logInWithFunction, result: authResult} = useAuth();

  const newTheme = {
    ...theme,
    colors: {
      primary: '#000',
    },
  };

  // useEffects
  React.useEffect(() => {
    OTPWidget.initializeWidget(widgetId!, tokenAuth!);
  }, []); // OTPWidget initialization

  // use state hooks
  const [phoneNumberText, setPhoneNumberText] = React.useState<string>('');
  const [otpInputText, setOtpInputText] = React.useState<string>('');
  const [isOtpSendSuccess, setIsOtpSendSuccess] =
    React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [msg91Response, setMSG91Response] = React.useState<MSG91ResponseT>();

  // Animation value
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Handle phone input continue function
  const handlePhoneInputContinue = useCallback(async () => {
    setLoading(true);
    try {
      const identifier = parsePhoneNumber(phoneNumberText, 'IN');
      const data = {
        identifier: identifier!.number.replace('+', ''),
      };
      const result = await OTPWidget.sendOTP(data);
      console.log('@handlePhoneInputContinue.result:', result);

      if (result['type'] == 'error' || result.error) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Failed to send otp.',
          text2: result?.message,
          position: 'bottom',
        });
        return;
      }

      setMSG91Response(result);
    } catch (error: any) {
      console.error('Error occured in sending OTP:', error);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
    // now start the animation
    setIsOtpSendSuccess(true);
    Animated.timing(slideAnim, {
      toValue: -width, // Move the phone input off-screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [
    setIsOtpSendSuccess,
    Animated,
    width,
    slideAnim,
    setLoading,
    parsePhoneNumber,
    phoneNumberText,
    setPhoneNumberText,
    OTPWidget,
    Toast,
    setMSG91Response,
  ]);

  const handleLogin = useCallback(async () => {
    setLoading(true);
    const body = {
      reqId: msg91Response?.message,
      otp: otpInputText,
    };
    const res = await OTPWidget.verifyOTP(body);

    if (res['type'] != 'success') {
      setLoading(false);
      console.warn('Failed to verify otp;');
      Toast.show({
        type: 'error',
        text1: 'Failed to verify otp.',
        text2: res?.message,
        position: 'bottom',
      });
      return;
    }

    const id = parsePhoneNumber(phoneNumberText, 'IN');
    if (!id) return;

    await savePhoneNumber({phoneNumber: id.number.replace('+', '')});
    logInWithFunction({phoneNumber: id.number.replace('+', '')});

    Toast.show({
      type: 'success',
      text1: 'You are logined successfully',
      position: 'bottom',
    });
    setLoading(false);
  }, [
    setLoading,
    msg91Response,
    otpInputText,
    OTPWidget,
    Toast,
    parsePhoneNumber,
    savePhoneNumber,
    phoneNumberText,
    logInWithFunction,
  ]);

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
                  disabled={isOtpSendSuccess || loading}
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
                  placeholderTextColor={MD2Colors.grey400}
                  style={{
                    backgroundColor: 'white',
                  }}
                  value={phoneNumberText}
                  activeOutlineColor={colors.secondary}
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
                marginVertical: 15,
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
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
          <OTPInput onCodeFilled={setOtpInputText} />
        </View>
      </Animated.View>

      <View
        style={{
          marginTop: 'auto',
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        {isOtpSendSuccess ? (
          <Button
            loading={loading}
            disabled={otpInputText.trim().length != 6}
            onPress={handleLogin}
            style={{
              borderRadius: 50,
            }}
            contentStyle={{
              height: 50,
            }}
            theme={newTheme}
            mode="contained">
            Verify
          </Button>
        ) : (
          <Button
            loading={loading}
            disabled={!(phoneNumberText.trim().length == 11)}
            onPress={handlePhoneInputContinue}
            style={{
              borderRadius: 50,
            }}
            contentStyle={{
              height: 50,
            }}
            theme={newTheme}
            mode="contained">
            {`Continue`}
          </Button>
        )}
      </View>
    </View>
  );
}
