import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const CarForm = () => {
  const { user } = useContext(AuthContext);
  const [complaintDetails, setComplaintDetails] = useState({
    aadhaarNo: '',
    registrationNo: '',
    chasisNo: '',
    engineNo: '',
    brand: '',
    model: '',
    color: '',
    description: '',
    lostLocation: '',
    lostDescription: '',
    lostDate: new Date(),
    lostDateInput: '',
  });
  const [loading, setLoading] = useState(false);

  // Set user's Aadhaar number on component mount
  useEffect(() => {
    handleChange('aadhaarNo', user.aadhaarNo);
  }, [user.aadhaarNo]);

  const handleChange = (name, value) => {
    setComplaintDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateDetails = () => {
    const { aadhaarNo, registrationNo, chasisNo, engineNo, brand, color, model, description, lostLocation, lostDescription, lostDate } = complaintDetails;

    if (aadhaarNo.trim().length !== 12) {
      showToast('error', 'Enter valid Aadhaar Number.');
      return false;
    }
    if (registrationNo.trim().length !== 10 || !/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/.test(registrationNo.toUpperCase())) {
      showToast('error', '[KA40ED3909] Enter valid 10 digit Registration Number.');
      return false;
    }
    if (chasisNo.trim().length !== 17) {
      showToast('error', 'Enter valid 17 digit Chasis Number.');
      return false;
    }
    if (!engineNo) {
      showToast('error', 'Enter valid Engine Number.');
      return false;
    }
    if (!brand) {
      showToast('error', 'Enter Vehicle Brand.');
      return false;
    }
    if (!model) {
      showToast('error', 'Enter Vehicle Model.');
      return false;
    }
    if (!color) {
      showToast('error', 'Enter Vehicle Color.');
      return false;
    }
    if (!lostLocation) {
      showToast('error', 'Enter Vehicle Lost Location.');
      return false;
    }
    if (!lostDescription) {
      showToast('error', 'Enter Vehicle Lost Description.');
      return false;
    }
    if (!lostDate) {
      showToast('error', 'Enter Vehicle Lost Date.');
      return false;
    }
    if (!description) {
      showToast('error', 'Enter Vehicle Description.');
      return false;
    }

    return true;
  };

  const showToast = (type, message) => {
    Toast.show({ type, text1: message });
  };

  const parseDateFromString = (dateString) => {
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year) return null;

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleDateChange = (val) => {
    handleChange('lostDateInput', val);
    const parsedDate = parseDateFromString(val);
    if (parsedDate) handleChange('lostDate', parsedDate);
  };

  const clearForm = () => {
    setComplaintDetails(prev => ({
      ...prev,
      registrationNo: '',
      chasisNo: '',
      engineNo: '',
      brand: '',
      model: '',
      color: '',
      description: '',
      lostLocation: '',
      lostDescription: '',
      lostDate: new Date(),
      lostDateInput: '',
    }));
  };

  const sendNotification = async (complaintId) => {
    const status = "Complaint registered"
    const description = "Your complaint has been registered successfully"
    try {
      const { data } = await axios.post('/api/v1/complaint/update-mail', {
        complaintId,
        status,
        description,
        type: 'car',
      });
      if (data?.success) {
        Toast.show({
          type: 'success',
          text1: data?.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: data?.message,
        });
      }
    } catch (error) {
      console.error(error)
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to send notification.',
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateDetails()) return;

    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/complaint/car-complaint', { complaintDetails });

      if (data?.success) {
        showToast('success', data?.message);
        clearForm();
        sendNotification(data?.complaintId);
      } else {
        showToast('error', data?.message);
      }
    } catch (error) {
      console.error(error);
      showToast('error', error?.response?.data?.message || 'Failed to submit the complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Car Theft Complaint</Text>

      {/* Phone Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Car Information</Text>

        <FormField
          label="Registration Number*" // Acept only in KA40FA3990 formate
          placeholder="Enter Registration Number"
          value={complaintDetails.registrationNo}
          onChangeText={val => handleChange('registrationNo', val)}
        />

        <FormField
          label="Chasis Number*"
          placeholder="Enter Chasis Number"
          value={complaintDetails.chasisNo}
          onChangeText={val => handleChange('chasisNo', val)}
        />

        <FormField
          label="Engine Number*"
          placeholder="Enter Engine Number"
          value={complaintDetails.engineNo}
          onChangeText={val => handleChange('engineNo', val)}
        />

        <FormField
          label="Car Brand*"
          placeholder="e.g., TATA, Mahindra"
          value={complaintDetails.brand}
          onChangeText={val => handleChange('brand', val)}
        />

        <FormField
          label="Car Model*"
          placeholder="e.g., Nexon, XUV 3XO"
          value={complaintDetails.model}
          onChangeText={val => handleChange('model', val)}
        />

        <FormField
          label="Car Color*"
          placeholder="e.g., Black, Red"
          value={complaintDetails.color}
          onChangeText={val => handleChange('color', val)}
        />

        <FormField
          label="Car Description*"
          placeholder="About your Car"
          value={complaintDetails.description}
          onChangeText={val => handleChange('description', val)}
          multiline
          textArea
        />

      </View>

      {/* Incident Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incident Details</Text>

        <FormField
          label="Lost Location*"
          placeholder="Where was the phone lost/stolen?"
          value={complaintDetails.lostLocation}
          onChangeText={val => handleChange('lostLocation', val)}
          multiline
          textArea
        />

        <FormField
          label="Lost Description*"
          placeholder="Describe what happened"
          value={complaintDetails.lostDescription}
          onChangeText={val => handleChange('lostDescription', val)}
          multiline
          textArea
        />

        <FormField
          label="Lost Date (DD/MM/YYYY)*"
          placeholder="Enter date like 28/05/2024"
          value={complaintDetails.lostDateInput}
          onChangeText={handleDateChange}
        />
      </View>

      <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity style={[styles.submitButton, { width: 170 }]} disabled={loading} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>{loading ? 'Submiting...' : 'Submit Complaint'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitButton, { width: 90, backgroundColor: '#D3D3D3' }]} onPress={clearForm}>
          <Text style={styles.submitButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Reusable FormField component
const FormField = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  multiline,
  textArea
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, textArea && styles.textArea]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      multiline={multiline}
    />
  </>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  invoiceImage: {
    width: 100,
    height: 150,
    marginBottom: 8,
    borderRadius: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  uploadText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CarForm;