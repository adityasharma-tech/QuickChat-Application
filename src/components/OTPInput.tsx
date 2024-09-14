import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import {colors} from '../utils/colors';

interface OTPInputProps {
  pinCount?: number;
  onCodeFilled: (code: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({pinCount = 6, onCodeFilled}) => {
  const [otp, setOtp] = useState<string[]>(Array(pinCount).fill(''));
  const inputsRef = useRef<TextInput[]>([]);

  const handleTextChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input
    if (text !== '' && index < pinCount - 1) {
      inputsRef.current[index + 1].focus();
    }

    onCodeFilled(newOtp.join(''));
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    const key = e.nativeEvent.key;

    // Handle backspace
    if (key === 'Backspace') {
      if (otp[index] === '') {
        // Move to previous input if current is empty
        if (index > 0) {
          inputsRef.current[index - 1].focus();
          const newOtp = [...otp];
          newOtp[index - 1] = ''; // Clear the previous input as well
          setOtp(newOtp);
        }
      } else {
        // Clear the current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
        cursorColor={'#000'}
          key={index}
          ref={ref => (inputsRef.current[index] = ref!)} // Non-null assertion since ref will always be assigned
          style={styles.otpInput}
          maxLength={1}
          keyboardType="numeric"
          value={digit}
          onChangeText={text => handleTextChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },
  otpInput: {
    color: colors.secondary,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
    fontSize: 20,
    width: 40,
    height: 50,
    textAlign: 'center',
  },
});

export default OTPInput;
