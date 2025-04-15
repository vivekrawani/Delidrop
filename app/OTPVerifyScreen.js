import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const OTPVerifyScreen = ({ route, navigation }) => {
  const { confirmation, phoneNumber } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    if (countdown === 0) {
      setResendDisabled(false);
    }
    
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await confirmation.confirm(otp);
      // Check if user is new or existing
      const userExists = await checkUserExists(phoneNumber);
      if (userExists) {
        navigation.replace('Home');
      } else {
        navigation.replace('ProfileSetup', { phoneNumber });
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkUserExists = async (phoneNumber) => {
    return false; 
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60);
    try {
      const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
      Alert.alert('Success', 'New OTP sent successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>
        We've sent a 6-digit code to {phoneNumber}
      </Text>
      
      <TextInput
        style={styles.otpInput}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleVerifyOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleResendOTP}
        disabled={resendDisabled}
      >
        <Text style={[styles.resendText, resendDisabled && styles.resendDisabled]}>
          {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendText: {
    textAlign: 'center',
    color: '#FF6B6B',
  },
  resendDisabled: {
    color: '#999',
  },
});

export default OTPVerifyScreen;
