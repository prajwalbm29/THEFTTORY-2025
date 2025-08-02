import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { Image } from 'react-native-animatable';

const PhoneForm = () => {
  const { user } = useContext(AuthContext);
  const [complaintDetails, setComplaintDetails] = useState({
    aadhaarNo: '',
    imei: '',
    mobile1: '',
    mobile2: '',
    brand: '',
    model: '',
    invoice: null,
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
    const { imei, mobile1, brand, model, lostLocation, lostDescription, lostDate, invoice } = complaintDetails;

    if (imei.trim().length !== 14) {
      showToast('error', 'Enter valid 14 digit IMEI Number.');
      return false;
    }
    if (mobile1.trim().length !== 10) {
      showToast('error', 'Enter valid 10 digit Mobile Number.');
      return false;
    }
    if (!brand) {
      showToast('error', 'Enter Mobile Brand.');
      return false;
    }
    if (!model) {
      showToast('error', 'Enter Mobile Model.');
      return false;
    }
    if (!lostLocation) {
      showToast('error', 'Enter Mobile Lost Location.');
      return false;
    }
    if (!lostDescription) {
      showToast('error', 'Enter Mobile Lost Description.');
      return false;
    }
    if (!lostDate) {
      showToast('error', 'Enter Mobile Lost Date.');
      return false;
    }

    if (!invoice) {
      showToast('error', 'Purchace Invoice is required.');
      return false;
    }

    return true;
  };

  const showToast = (type, message) => {
    Toast.show({ type, text1: message });
  };

  const handleUploadInvoice = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.error) {
        console.log(response.errorMessage);
        return;
      }

      const asset = response?.assets?.[0];
      if (asset) {
        handleChange('invoice', {
          name: asset?.name || 'Image01',
          type: asset?.type,
          uri: asset?.uri,
          base64: asset?.base64,
        });
      }
    });
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
      imei: '',
      mobile1: '',
      mobile2: '',
      brand: '',
      model: '',
      invoice: null,
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
        type: 'phone',
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
      const { data } = await axios.post('/api/v1/complaint/cell-complaint', { complaintDetails });

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
      <Text style={styles.heading}>Phone Theft Complaint</Text>

      {/* Phone Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Information</Text>

        <FormField
          label="IMEI Number*"
          placeholder="Enter 15-digit IMEI Number"
          value={complaintDetails.imei}
          onChangeText={val => handleChange('imei', val)}
        />

        <FormField
          label="Mobile Number 1*"
          placeholder="Registered mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={complaintDetails.mobile1}
          onChangeText={val => handleChange('mobile1', val)}
        />

        <FormField
          label="Mobile Number 2"
          placeholder="Additional mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={complaintDetails.mobile2}
          onChangeText={val => handleChange('mobile2', val)}
        />

        <FormField
          label="Brand*"
          placeholder="e.g., Apple, Samsung"
          value={complaintDetails.brand}
          onChangeText={val => handleChange('brand', val)}
        />

        <FormField
          label="Model*"
          placeholder="e.g., iPhone 13, Galaxy S22"
          value={complaintDetails.model}
          onChangeText={val => handleChange('model', val)}
        />

        <Text style={styles.label}>Purchase Invoice*</Text>
        {complaintDetails?.invoice?.uri && (
          <Image
            style={styles.invoiceImage}
            source={{ uri: complaintDetails.invoice.uri }}
          />
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadInvoice}>
          <MaterialIcons name="attach-file" size={20} color="#fff" />
          <Text style={styles.uploadText}>
            {complaintDetails.invoice ? 'Invoice Uploaded' : 'Upload Invoice (Image)'}
          </Text>
        </TouchableOpacity>
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

export default PhoneForm;