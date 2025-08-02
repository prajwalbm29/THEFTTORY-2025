import { ScrollView, StyleSheet, View, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Header from '../components/Header';
import * as Animatable from 'react-native-animatable';
import RenderComplaintDetails from '../components/RenderComplaintDetails';
import AddStatus from '../components/AddStatus';

const StatusUpdate = ({ navigation, route }) => {
  const { complaintId, complaintType } = route.params;

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/complaint/${complaintType}-details/${complaintId}`)
      if (data?.success) {
        setComplaint(data[complaintType]);
        await fetchStatus();
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to fetch complaint.',
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchStatus = async () => {
    try {
      const { data } = await axios.get(`/api/v1/complaint/complaint-status/${complaintId}`);
      if (data?.success) {
        setStatus(data?.complaint?.status);
        setDescription(data?.complaint?.description);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchComplaintDetails();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        {/* Header Section */}
        <Header title="UPDATE COMPLAINT STATUS" />

        {/* Hero Section */}
        <Animatable.View animation="fadeIn" style={styles.heroContainer}>
          <Text style={styles.heroTitle}>Let's bring the smile back.</Text>
          <Text style={styles.heroText}>
            This isn't just a call to action — it's a commitment to restoring peace,
            trust, and comfort in the lives of those affected by crime. Every recovered item,
            every resolved complaint, and every act of justice is a step toward healing. Together,
            let's replace fear with hope and bring smiles back where they belong — on the faces of our people.
          </Text>
        </Animatable.View>
      </View>

      <RenderComplaintDetails complaint={complaint} complaintType={complaintType} status={status} description={description} />

      <AddStatus setStatus={setStatus} setDescription={setDescription} complaintId={complaintId} complaintType={complaintType} />
    </ScrollView>
  );
};

export default StatusUpdate;

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
})