import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import Header from '../components/Header';

const Home = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    activePolice: 0,
    resolvedComplaints: 0,
  });
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }

  const fetchStats = async () => {
    try {
      const total = await axios.get('/api/v1/admin/total-complaints')
      const active = await axios.get('/api/v1/admin/active-officers')
      const resolved = await axios.get('/api/v1/admin/resolved-cases')

      const mockResponse = {
        totalComplaints: total?.data?.totalComplaints || 0,
        activePolice: active?.data?.activeOfficers || 0,
        resolvedComplaints: resolved?.data?.totalResolved || 0
      };

      setStats(mockResponse);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStats();
  }, []);

  // Stats Cards Component
  const StatCard = ({ icon, value, label, color, iconType = MaterialIcons }) => {
    const IconComponent = iconType;

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={300}
        style={[styles.statCard, { borderLeftColor: color }]}
      >
        <View style={styles.statIconContainer}>
          <IconComponent name={icon} size={28} color={color} />
        </View>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color={color} />
          ) : (
            <Text style={styles.statValue}>{value}</Text>
          )}
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </Animatable.View>
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
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <Animatable.View
        animation="fadeIn"
        style={styles.heroContainer}
      >
        <Text style={styles.heroTitle}>Bringing happiness back isn’t just a promise — it’s our duty.</Text>
        <Text style={styles.heroText}>
          As police officers, we understand that true happiness in a community comes from a sense of safety, justice, and trust.
          Every action we take — from responding to emergencies to building relationships with the public — is aimed at restoring confidence and peace in people’s lives.
          We don’t see this as just a responsibility written in law, but as a moral duty to ensure that every citizen feels protected, valued, and heard. Bringing happiness back isn’t just a promise — it’s our duty.
        </Text>
      </Animatable.View>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="report-problem"
          value={stats.totalComplaints}
          label="Total Complaints"
          color="#e74c3c"
        />
        <StatCard
          icon="security"
          value={stats.activePolice}
          label="Active Officers"
          color="#3498db"
        />
        <StatCard
          icon="check-circle"
          value={stats.resolvedComplaints}
          label="Cases Resolved"
          color="#2ecc71"
        />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Complaints')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#e74c3c20' }]}>
            <FontAwesome name="exclamation-triangle" size={24} color="#e74c3c" />
          </View>
          <Text style={styles.actionText}>Check Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Updates')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#3498db20' }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#3498db" />
          </View>
          <Text style={styles.actionText}>Admin Updates</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#3498db20' }]}>
            <MaterialIcons name="person" size={24} color="#2ecc71" />
          </View>
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('ComplaintStatus')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#9b59b620' }]}>
            <MaterialIcons name="assignment" size={24} color="#9b59b6" />
          </View>
          <Text style={styles.actionText}>Complaint Status</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      <Text style={styles.sectionTitle}>Recent Updates</Text>
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        style={styles.updateCard}
      >
        <Text style={styles.updateTitle}>New Safety Campaign</Text>
        <Text style={styles.updateText}>
          Join our neighborhood watch program starting next month.
          Training sessions available every Saturday.
        </Text>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingBottom: 40,
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    width: '30%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    backgroundColor: '#f8f9fa',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
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
  updateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  updateText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default Home;