import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth';

const PhoneAuthScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('91'); 
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCountry(country);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    setLoading(true);
    try {
      const fullNumber = `+${countryCode}${phoneNumber}`;
      const confirmation = await auth().signInWithPhoneNumber(fullNumber);
      navigation.navigate('OTPVerify', { 
        confirmation, 
        phoneNumber: fullNumber 
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mealer App</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>
      
      <View style={styles.inputContainer}>
        <CountryPicker
          withFilter
          withFlag
          withCallingCode
          withAlphaFilter
          onSelect={onSelectCountry}
          containerButtonStyle={styles.countryPicker}
        />
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={15}
        />
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
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
    fontSize: 28,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  countryPicker: {
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default PhoneAuthScreen;