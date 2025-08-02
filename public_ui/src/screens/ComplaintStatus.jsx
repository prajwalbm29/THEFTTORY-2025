import { StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Animatable from 'react-native-animatable';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import RenderComplaintDetails from '../components/RenderComplaintDetails';

const ComplaintStatus = ({ navigation, route }) => {
  // initial values
  const { complaintId: initialComplaintId, complaintType: initialComplaintType } = route.params || {};

  const [complaintId, setComplaintId] = useState(initialComplaintId || '');
  const [complaintType, setComplaintType] = useState(initialComplaintType || '');

  // complaint and status
  const [complaint, setComplaint] = useState(null);
  const [update, setUpdate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaint();
    setRefreshing(false);
  }

  const fetchComplaint = async () => {
    if (!complaintId || !complaintType) {
      Toast.show({
        type: 'error',
        text1: 'Complaint Id and type are required.',
      });
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/complaint/${complaintType}-details/${complaintId}`);
      if (data?.success) {
        Toast.show({
          type: 'info',
          text1: 'Data fetched successfully',
        });
        setComplaint(data[complaintType]);
        await fetchStatus();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Error in fetching complaint Status.',
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchStatus = async () => {
    try {
      const { data } = await axios.get(`/api/v1/complaint/complaint-status/${complaintId}`);
      if (data?.success) {
        Toast.show({
          type: 'info',
          text1: 'Update fetched successfully',
        });
        setUpdate(data?.complaint);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Error in fetcing complaint status.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#3498db']}
          tintColor="#3498db"
        />
      }
    >

      <View style={styles.headerContainer}>
        {/* Header Section */}
        <Header title="Complaint Status" navigation={navigation} />

        {/* Hero Section */}
        <Animatable.View animation="fadeIn" style={styles.heroContainer}>
          <Text style={styles.heroTitle}>Your Voice Matters</Text>
          <Text style={styles.heroText}>
            Track your complaint status in real-time. We're committed to keeping you
            informed at every step of the process.
          </Text>
        </Animatable.View>
      </View>

      {/* Search Section */}
      <Animatable.View animation="fadeInUp" style={styles.searchContainer}>
        <Text style={styles.label}>Complaint Id</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Complaint ID"
          value={complaintId}
          onChangeText={setComplaintId}
        />

        <Text style={styles.label}>Select Complaint Type</Text>
        <Picker
          selectedValue={complaintType}
          style={styles.picker}
          onValueChange={(itemValue) => setComplaintType(itemValue)}
        >
          <Picker.Item label="Select Complaint Type..." value="" enabled={false} />
          <Picker.Item label="Phone" value="phone" />
          <Picker.Item label="Laptop" value="laptop" />
          <Picker.Item label="Bike" value="bike" />
          <Picker.Item label="Car" value="car" />
          <Picker.Item label="Gold" value="gold" />
        </Picker>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchComplaint}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </Animatable.View>

      {/* details and updates Container */}
      <RenderComplaintDetails complaint={complaint} complaintType={complaintType} update={update} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  heroContainer: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timelineContainer: {
    marginTop: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timelineDotContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3498db',
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    top: 16,
    bottom: -15,
    width: 2,
    backgroundColor: '#3498db',
  },
  timelineContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  timelineDate: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  noStatusText: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginVertical: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    margin: 4,
  },
});

export default ComplaintStatus;