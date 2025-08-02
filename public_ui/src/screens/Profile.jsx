import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment';

const ComplaintTable = ({ title, data, columns, onRowPress }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format('DD MMM YYYY, hh:mm A');
  };

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        {columns.map(column => (
          <Text key={column.key} style={styles.headerCell}>{column.label}</Text>
        ))}
      </View>
      {data.map(item => (
        <TouchableOpacity
          key={item._id}
          style={styles.dataRow}
          onPress={() => onRowPress(item._id, title.toLowerCase())}
        >
          {columns.map(column => (
            <Text key={column.key} style={styles.dataCell}>
              {column.key === 'complaintDate'
                ? formatDate(item[column.key])
                : item[column.key] || '-'}
            </Text>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Profile = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState({
    phone: [],
    laptop: [],
    bike: [],
    car: [],
    gold: [],
    loading: true,
    error: null
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  }

  const handleComplaintPress = (complaintId, complaintType) => {
    navigation.navigate('ComplaintStatus', {
      complaintId,
      complaintType,
    });
  };

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get(`/api/v1/complaint/get-all-complaints/${user.aadhaarNo}`);
      if (data?.success) {
        setComplaints({
          phone: data.data?.phone || [],
          laptop: data.data?.laptop || [],
          bike: data.data?.bike || [],
          car: data.data?.car || [],
          gold: data.data?.gold || [],
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error(error);
      setComplaints(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };
  useEffect(() => {
    fetchComplaints();
  }, []);

  // No Complaint Found
  if (complaints.phone.length === 0
    && complaints.laptop.length === 0
    && complaints.bike.length === 0
    && complaints.car.length === 0
    && complaints.gold.length === 0
    && !complaints.loading) {
    return (
      <View style={styles.container}>
        <Header title={`Welcome ${user.name}`} />

        <View style={styles.emptyStateContainer}>
          <Text style={styles.titleTxt}>No Registered Complaints Found.</Text>
          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Perform Following Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Complaints')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#e74c3c20' }]}>
                <FontAwesome name="exclamation-triangle" size={24} color="#e74c3c" />
              </View>
              <Text style={styles.actionText}>File Complaint</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('SafetyTips')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3498db20' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#3498db" />
              </View>
              <Text style={styles.actionText}>Safety Tips</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const renderComplaintSection = (title, data, columns) => {
    if (complaints.loading) return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading {title} complaints...</Text>
      </View>
    );

    if (complaints.error) return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading {title} complaints</Text>
      </View>
    );

    if (!data.length) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title} Complaints ({data.length})</Text>
        <ComplaintTable
          title={title}
          data={data}
          columns={columns}
          onRowPress={handleComplaintPress}
        />
      </View>
    );
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
      <Header title={`Welcome ${user.name}`} />

      {renderComplaintSection('Phone', complaints.phone, [
        { key: 'imei', label: 'IMEI Number' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'complaintDate', label: 'Reported On' }
      ])}

      {renderComplaintSection('Laptop', complaints.laptop, [
        { key: 'serialNo', label: 'Serial No' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'complaintDate', label: 'Reported On' }
      ])}

      {renderComplaintSection('Bike', complaints.bike, [
        { key: 'registrationNo', label: 'Reg No' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'complaintDate', label: 'Reported On' }
      ])}

      {renderComplaintSection('Car', complaints.car, [
        { key: 'registrationNo', label: 'Reg No' },
        { key: 'brand', label: 'Brand' },
        { key: 'model', label: 'Model' },
        { key: 'complaintDate', label: 'Reported On' }
      ])}

      {renderComplaintSection('Gold', complaints.gold, [
        { key: 'weight', label: 'Weight (g)' },
        { key: 'uniqueFeature', label: 'Unique Feature' },
        { key: 'complaintDate', label: 'Reported On' }
      ])}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleTxt: {
    marginTop: 6,
    alignSelf: 'center',
    fontWeight: '800',
    fontSize: 20,
    fontStyle: 'italic',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    paddingBottom: 30,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 12,
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#f5f5f5',
    backgroundColor: 'white',
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#34495e',
  },
  loadingContainer: {
    padding: 15,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7f8c8d',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default Profile;