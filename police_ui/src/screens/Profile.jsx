import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [resolved, setResolved] = useState([]);
  const [stats, setStats] = useState({
    totalResolved: 0,
    lastMonth: 0,
  });
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResolvedComplaints();
    setRefreshing(false);
  }

  const fetchResolvedComplaints = async () => {
    try {
      const { data } = await axios.get(`/api/v1/police/resolved-complaints/${user?.policeId}`);
      if (data?.success) {
        setResolved(data?.resolvedComplaints || []);

        // Calculate some statistics
        const lastMonthCount = data.resolvedComplaints.filter(complaint =>
          moment(complaint.resolvedDate).isAfter(moment().subtract(30, 'days'))
        ).length;

        setStats({
          totalResolved: data.resolvedComplaints.length,
          lastMonth: lastMonthCount,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
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
      {/* Header */}
      <View style={styles.header}>
        <Header title="Your Current Profile" showBackButton={false} style={styles.Header} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={40} color="#fff" />
            </View>
          )}
        </View>

        <Text style={styles.userName}>{user?.name || 'Officer'}</Text>
        <Text style={styles.userRank}>{user?.rank || 'Police Officer'}</Text>
        <Text style={styles.userId}>ID: {user?.policeId || 'N/A'}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalResolved}</Text>
            <Text style={styles.statLabel}>Total Resolved</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.lastMonth}</Text>
            <Text style={styles.statLabel}>Last 30 Days</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Complaints')}>
          <Icon name="list" size={24} color="#3498db" />
          <Text style={styles.actionText}>Active Cases</Text>
        </TouchableOpacity>
      </View>

      {/* Resolved Complaints Section */}
      <Text style={styles.sectionTitle}>Recently Resolved Cases</Text>

      {resolved.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="checkmark-done-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No resolved cases yet</Text>
          <Text style={styles.emptySubText}>Cases you resolve will appear here</Text>
        </View>
      ) : (
        <>
          {resolved.slice(0, 5).map((item, index) => (
            <View style={styles.card} key={index}>
              <View style={styles.cardHeader}>
                <Text style={styles.complaintId}>Case #{item}</Text>
                <View style={styles.resolvedBadge}>
                  <Icon name="checkmark" size={14} color="#fff" />
                  <Text style={styles.resolvedText}>Resolved</Text>
                </View>
              </View>
            </View>
          ))}

          {resolved.length > 5 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('ResolvedCases')}
            >
              <Text style={styles.viewAllText}>View All Resolved Cases ({resolved.length})</Text>
              <Icon name="chevron-forward" size={20} color="#3498db" />
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#e74c3c" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginLeft: 20,
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    margin: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userRank: {
    fontSize: 16,
    color: '#bdc3c7',
    marginBottom: 5,
  },
  userId: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#34495e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  complaintId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  resolvedText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  complaintDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    marginTop: 10,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 15,
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 10,
  },
});