import React, {useCallback} from 'react';
import {ImageBackground, StatusBar, Text, View} from 'react-native';
import {Button, TextInput, useTheme} from 'react-native-paper';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {useAuth} from '@realm/react';

import {OTPWidget} from '@msg91comm/sendotp-react-native';
import {parseMobileNumber, savePhoneNumber} from '../utils/phoneNumberUtils';
import { parsePhoneNumber } from 'libphonenumber-js';

const widgetId = process.env.MSG91_WIDGET_ID;
const tokenAuth = process.env.MSG91_TOKEN_AUTH;

export default function Auth() {
  const intent = useSafeAreaInsets();
  const theme = useTheme();
  const {logInWithFunction, result: authResult} = useAuth();

  const [response, setResponse] = React.useState<{
    message: string;
    type: string;
  } | null>(null);

  const [phoneNumber, setTextPhoneNumber] = React.useState<string>('+911231231231');
  const [otpValue, setOtpValue] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  // Initializing msg91 widget
  React.useEffect(() => {
    OTPWidget.initializeWidget(widgetId!, tokenAuth!); //Widget initialization
  }, []);

  // sending otp to the users mobile number using MSG91
  const handleOtpSend = useCallback(async () => {
    setLoading(true);
    console.log(phoneNumber)
    try {
      const identifier = parsePhoneNumber(phoneNumber, 'IN');
      setTextPhoneNumber(identifier!.number.replace('+', ''));
      const data = {
        identifier: identifier!.number.replace('+', ''),
      };
      const result = await OTPWidget.sendOTP(data);
      console.log('result', result)

      if (result['type'] == 'error') {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Failed to send otp.',
          text2: result?.message,
          position: 'bottom',
        });
        return
      }
      setResponse(result);
      console.log('@handleOtpSend.result: ', result, response);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [
    setLoading,
    parseMobileNumber,
    phoneNumber,
    setTextPhoneNumber,
    OTPWidget.sendOTP,
    Toast.show,
  ]);

  // handle verification
  const handleVerify = useCallback(async () => {
    console.log('@handleVerify');
    setLoading(true);
    const body = {
      reqId: response?.message,
      otp: otpValue,
    };
    const res = await OTPWidget.verifyOTP(body);
    console.log('@handleVerify.result: ', res);

    if (res['type'] != 'success') {
      setLoading(false);
      console.warn('Failed to ');
      Toast.show({
        type: 'error',
        text1: 'Failed to verify otp.',
        text2: res?.message,
        position: 'bottom',
      });
      return;
    }

    await savePhoneNumber({ phoneNumber });

    logInWithFunction({phoneNumber, data: {
      phoneNumber,
      name: "Aditya Sharma",
      profilePicture: "https://avatar.iran.liara.run/username?id="+phoneNumber
    }})

    Toast.show({
      type: 'success',
      text1: 'You are logined successfully',
      position: 'bottom',
    });
    setLoading(false);
  }, [setLoading, phoneNumber, setTextPhoneNumber, OTPWidget, otpValue, Toast.show,]);

  const handleSubmit = useCallback(async () => {
    if (phoneNumber.trim() == '') {
      Toast.show({
        type: 'success',
        text1: 'Invalid input',
        text2: 'Please enter your phone number.',
        position: 'bottom',
      });
      console.warn("Invalid Phone Number")
      return;
    }
    console.log(response);
    if (response !== null) {
      console.log('@handleSubmit:', ' @handleVerify');
      await handleVerify();
    } else {
      console.log('@handleSubmit:', ' @handleOtpSend');
      await handleOtpSend();
    }
  }, [Toast, phoneNumber, response, handleOtpSend, handleVerify]);

  return (
    <React.Fragment>
      <View
        style={{
          height: '100%',
        }}>
        <StatusBar animated={true} barStyle="light-content" />
        <ImageBackground
          source={require('../assets/images/login_image_background.png')}
          style={{
            paddingHorizontal: 20,
            paddingTop: 80 + intent.top,
            paddingVertical: 50,
            flexDirection: 'column',
            rowGap: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 500,
              fontSize: 40,
              lineHeight: 45,
              fontFamily: 'DMSans-Medium',
            }}>
            {'Sign in to your \nAccount'}
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontFamily: 'DMSans-ExtraLight',
            }}>
            QuickChat Authentication
          </Text>
        </ImageBackground>
        <View
          style={{
            paddingVertical: 35,
            paddingHorizontal: 20,
            backgroundColor: 'white',
            height: '100%',
          }}>
          <View
            style={{
              flexDirection: 'column',
              rowGap: 25,
            }}>
            <TextInput
              disabled={response != null || loading}
              mode="outlined"
              label="Phone Number"
              spellCheck={false}
              value={phoneNumber}
              onChangeText={(text)=>setTextPhoneNumber(text)}
              outlineColor="#d9d9d9"
              inputMode="numeric"
              activeOutlineColor={theme.colors.primary}
              outlineStyle={{
                borderRadius: 8,
                elevation: 0,
                shadowOpacity: 0,
              }}
              style={{
                backgroundColor: '#ffffff',
              }}
            />
            <TextInput
              disabled={!response || loading}
              mode="outlined"
              label="Otp here"
              inputMode="tel"
              // secureTextEntry
              spellCheck={false}
              outlineColor="#d9d9d9"
              value={otpValue}
              onChangeText={text => setOtpValue(text)}
              maxLength={6}
              activeOutlineColor={theme.colors.primary}
              outlineStyle={{
                borderRadius: 8,
                elevation: 0,
                shadowOpacity: 0,
              }}
              style={{
                backgroundColor: '#ffffff',
              }}
            />
            <Text
              style={{
                textAlign: 'right',
                fontWeight: '500',
                color: theme.colors.primary,
              }}>
              Resend Otp?
            </Text>

            <Button
              onPress={handleSubmit}
              mode="contained"
              loading={loading||authResult.pending}
              buttonColor={theme.colors.primaryContainer}
              textColor="#000"
              labelStyle={{
                fontSize: 16,
                fontWeight: '600',
                fontFamily: 'DMSans-Medium',
              }}
              contentStyle={{
                paddingVertical: 4,
              }}
              style={{
                borderRadius: 10,
              }}>
              {response ? 'Verify' : 'Get Otp'}
            </Button>
          </View>
        </View>
      </View>
    </React.Fragment>
  );
}
