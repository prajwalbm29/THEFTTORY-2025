import { StyleSheet, ScrollView, View, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

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
              {column.key === 'complaintDate' || column.key === 'lostDate'
                ? formatDate(item[column.key])
                : item[column.key] || '-'}
            </Text>
          ))}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Complaint = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState({
    phone: [],
    laptop: [],
    bike: [],
    car: [],
    gold: [],
    loading: true,
    error: null,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchActiveComplaints();
    setRefreshing(false);
  }

  const handleComplaintPress = (complaintId, complaintType) => {
    navigation.navigate('ChangeStatus', {
      complaintId,
      complaintType,
    });
  };

  const fetchActiveComplaints = async () => {
    try {
      setComplaints(prev => ({ ...prev, loading: true }));

      const { data: allotedData } = await axios.get(`/api/v1/police/alloted-complaints/${user.policeId}`);

      if (!allotedData?.success) {
        throw new Error('Failed to fetch allotted complaints');
      }

      // Then fetch resolved complaints
      const { data: resolvedData } = await axios.get('/api/v1/complaint/resolved-complaints');

      if (!resolvedData?.success) {
        throw new Error('Failed to fetch resolved complaints');
      }

      // Filter out resolved complaints
      const resolvedIds = resolvedData?.resolvedComplaints.map(id => id.toString());

      const filterActive = (complaints = []) =>
        complaints.filter(c => c && !resolvedIds.includes(c._id.toString()));

      setComplaints({
        phone: filterActive(allotedData.data?.phone) || [],
        laptop: filterActive(allotedData.data?.laptop) || [],
        bike: filterActive(allotedData.data?.bike) || [],
        car: filterActive(allotedData.data?.car) || [],
        gold: filterActive(allotedData.data?.gold) || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setComplaints({
        phone: [],
        laptop: [],
        bike: [],
        car: [],
        gold: [],
        loading: false,
        error: error.message
      });
    }
  };

  useEffect(() => {
    fetchActiveComplaints();
  }, []);

  // Loading state
  if (complaints.loading) {
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
          <Header title={'Loading your complaints...'} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Fetching active complaints</Text>
        </View>
      </ScrollView>
    );
  }

  // Error state
  if (complaints.error) {
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
          <Header title={'Error loading complaints'} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{complaints.error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchActiveComplaints}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Empty state
  const totalComplaints = complaints.phone.length + complaints.laptop.length +
    complaints.bike.length + complaints.car.length +
    complaints.gold.length;

  if (totalComplaints === 0 && !complaints.loading) {
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
          <Header title={'No active complaints'} />
        </View>

        <View style={styles.emptyStateContainer}>
          <Text style={styles.titleTxt}>All caught up! No unresolved complaints.</Text>

          <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3498db20' }]}>
                <MaterialIcons name="person" size={24} color="#2ecc71" />
              </View>
              <Text style={styles.actionText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Updates')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3498db20' }]}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#3498db" />
              </View>
              <Text style={styles.actionText}>Check Updates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  const renderComplaintSection = (title, data, columns) => {
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
        { key: 'lostDate', label: 'Lost On' }
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
    gap: 8,
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
});

export default Complaint;