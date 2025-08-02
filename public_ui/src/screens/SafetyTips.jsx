import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SafetyTips = () => {
  const [safetyTips, setSafetyTips] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSafetyTips();
    setRefreshing(false);
  }

  const fetchSafetyTips = async () => {
    try {
      const { data } = await axios.get('/api/v1/complaint/get-safetyTips');
      if (data?.success) {
        setSafetyTips(data?.safetyTips);
      } else {
        Toast.show({
          type: 'error',
          text1: data?.message,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to fetch safety tips.',
      });
    }
  };
  useEffect(() => {
    fetchSafetyTips();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        <Header title="Safety Tips to Follow" />
        <Text style={styles.heading}>Your Safety Comes First</Text>

        {/* Important Notice */}
        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.noticeContainer}
        >
          <MaterialIcons name="warning" size={20} color="#f39c12" />
          <Text style={styles.noticeText}>
            Always follow the provided safety tips to help protect your belongings from theft.
            Staying informed and cautious is the first step toward ensuring personal and property safety.
          </Text>
        </Animatable.View>

        {safetyTips.length === 0 ? (
          <Text style={styles.noTips}>No safety tips available.</Text>
        ) : (
          safetyTips.map(item => (
            <View key={item._id} style={styles.card}>
              <Text style={styles.tipText}>{item?.tips}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SafetyTips;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  noTips: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 22,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  noticeText: {
    marginLeft: 10,
    color: '#856404',
    fontSize: 14,
    flex: 1,
  },
});
