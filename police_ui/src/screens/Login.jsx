import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [policeId, setPoliceId] = useState('');
  const [aadhaarNo, setAadhaarNo] = useState('');
  const [details, setDetails] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleFetchDetails = async () => {
    if (policeId.length !== 5) {
      Toast.show({
        type: 'error',
        text1: 'Enter valid 5 digit Police Id.',
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/auth/police-details/${policeId}`);
      if (!data?.success) {
        Toast.show({ type: 'error', text1: data?.message || 'Failed to fetch details' });
        return;
      }
      setDetails(data?.data);
      setAadhaarNo(data?.data?.aadhaarNo);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Police Id does not exists.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOTP = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/auth/generate-otp/${aadhaarNo}`);
      if (data?.success) {
        Toast.show({ type: 'success', text1: data?.message || 'OTP sent successfully' });
        setCorrect(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to generate OTP.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/auth/verify-police-otp', { otp, aadhaarNo });
      if (data?.success) {
        Toast.show({ type: 'success', text1: data?.message || 'Login successful' });
        navigation.replace('Home');
        await login(data?.token, details.name, aadhaarNo, data?._id);
      } else {
        Toast.show({ type: 'error', text1: data?.message || 'Invalid credentials.' });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Invalid OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.heading}>Police Login</Text>

        <Text style={styles.label}>Police Id</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Police Id"
          value={policeId}
          onChangeText={(text) => setPoliceId(text)}
          maxLength={5}
          editable={!details}
        />

        {!details && (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: policeId.length === 5 || loading ? '#1e90ff' : '#ccc' },
            ]}
            disabled={policeId.length !== 5 || loading}
            onPress={handleFetchDetails}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Fetch Details</Text>
            )}
          </TouchableOpacity>
        )}

        {details && !correct && (
          <>
            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>👤 Name: {details.name}</Text>
              <Text style={styles.detailText}>📅 DOB: {new Date(details.dob).toLocaleDateString()}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleGenerateOTP} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Data Correct</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: '#d9534f' }]}
                onPress={() => {
                  setDetails(null);
                  setPoliceId('');
                }}
              >
                <Text style={styles.buttonText}>Data Not Correct</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {correct && (
          <>
            <Text style={styles.label}>OTP</Text>
            <View style={styles.otpContainer}>
              <TextInput
                style={[styles.input, styles.otpInput]}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.button, styles.regenerateButton, { backgroundColor: '#1e90ff' }]}
                onPress={handleGenerateOTP}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? <ActivityIndicator color="#fff" /> : 'Regenerate'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, { marginTop: 16 }]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="#fff" /> : 'Verify OTP'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  box: {
    width: '85%',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 12,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  detailsBox: {
    marginBottom: 16,
    backgroundColor: '#eef5fb',
    padding: 12,
    borderRadius: 8,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  regenerateButton: {
    width: 120,
    marginBottom: 0,
  },
});
