import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const Update = () => {
  const [safetyTips, setSafetyTips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const fetchSafetyTips = async () => {
    try {
      setRefreshing(true);
      const { data } = await axios.get('/api/v1/police/get-updateTips');
      if (data?.success) {
        setSafetyTips(data?.policeUpdates || []);
      } else {
        Toast.show({
          type: 'error',
          text1: data?.message || 'Failed to fetch updates',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Network error. Please try again.',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    fetchSafetyTips();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title="Police Updates & Alerts" showBackButton={false} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchSafetyTips}
            colors={['#1e88e5']}
            tintColor="#1e88e5"
          />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Important Updates</Text>
          <Text style={styles.subHeading}>Latest announcements and safety tips</Text>
        </View>

        {safetyTips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No updates available</Text>
            <Text style={styles.emptyText}>Check back later for new announcements</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={fetchSafetyTips}
            >
              <Icon name="refresh" size={20} color="#1e88e5" />
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          safetyTips.map(item => (
            <TouchableOpacity
              key={item._id}
              style={[
                styles.card,
                item.priority === 'high' && styles.highPriorityCard,
                item.priority === 'medium' && styles.mediumPriorityCard
              ]}
              activeOpacity={0.8}
              onPress={() => toggleExpand(item._id)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.priorityBadge}>
                  <Icon
                    name={item.priority === 'high' ? 'warning' : 'info'}
                    size={16}
                    color={item.priority === 'high' ? '#d32f2f' : '#1976d2'}
                  />
                  <Text style={[
                    styles.priorityText,
                    item.priority === 'high' && styles.highPriorityText,
                    item.priority === 'medium' && styles.mediumPriorityText
                  ]}>
                    {item.priority === 'high' ? 'Urgent' : 'Important'}
                  </Text>
                </View>
                <Text style={styles.dateText}>
                  {moment(item.createdAt).format('MMM D, h:mm A')}
                </Text>
              </View>

              <Text style={styles.tipTitle}>{item.title || 'Police Announcement'}</Text>

              <Text
                style={styles.tipText}
                numberOfLines={expandedId === item._id ? undefined : 3}
              >
                {item.update}
              </Text>

              {item.update.length > 150 && (
                <TouchableOpacity
                  style={styles.readMoreButton}
                  onPress={() => toggleExpand(item._id)}
                >
                  <Text style={styles.readMoreText}>
                    {expandedId === item._id ? 'Show Less' : 'Read More'}
                  </Text>
                  <Icon
                    name={expandedId === item._id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={18}
                    color="#1e88e5"
                  />
                </TouchableOpacity>
              )}

              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.updateImage}
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default Update;

const styles = StyleSheet.create({
  header: {
    marginLeft: 20,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 14,
    color: '#546e7a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  mediumPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1976d2',
  },
  highPriorityText: {
    color: '#d32f2f',
  },
  mediumPriorityText: {
    color: '#ffa000',
  },
  dateText: {
    fontSize: 12,
    color: '#78909c',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#455a64',
    lineHeight: 22,
    marginBottom: 8,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  readMoreText: {
    fontSize: 14,
    color: '#1e88e5',
    fontWeight: '500',
    marginRight: 4,
  },
  updateImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    opacity: 0.6,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#546e7a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#90a4ae',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '80%',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshText: {
    fontSize: 14,
    color: '#1e88e5',
    fontWeight: '500',
    marginLeft: 6,
  },
});