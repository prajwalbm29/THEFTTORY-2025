import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const Complaint = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 'phone', name: 'Phone', icon: 'smartphone', color: '#3498db', iconSet: 'MaterialIcons' },
    { id: 'laptop', name: 'Laptop', icon: 'laptop', color: '#e74c3c', iconSet: 'MaterialIcons' },
    { id: 'bike', name: 'Bike', icon: 'bicycle', color: '#2ecc71', iconSet: 'FontAwesome' },
    { id: 'car', name: 'Car', icon: 'car', color: '#f39c12', iconSet: 'FontAwesome' },
    { id: 'gold', name: 'Gold', icon: 'diamond', color: '#9b59b6', iconSet: 'MaterialIcons' },
  ];

  const renderIcon = (iconSet, icon, color, size) => {
switch (iconSet) {
  case 'FontAwesome':
    return <FontAwesome name={icon} size={size} color={color} />;
  default:
    return <MaterialIcons name={icon} size={size} color={color} />;
}
  };

const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  navigation.navigate('ComplaintForm', { category });
};

return (
  <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
  >
    {/* Header Section */}
    <Header />

    {/* Hero Section */}
    <Animatable.View
      animation="fadeIn"
      style={styles.heroContainer}
    >
      <Text style={styles.heroTitle}>Report a Theft</Text>
      <Text style={styles.heroText}>
        We understand the pain of losing something valuable — file your complaint,
        and we'll do our best to help you recover your belongings.
      </Text>
    </Animatable.View>

    {/* Documents Required Section */}
    <Animatable.View
      animation="fadeInUp"
      delay={200}
      style={styles.sectionContainer}
    >
      <Text style={styles.sectionTitle}>Documents Required</Text>
      <View style={styles.infoBox}>
        <View style={styles.bulletPoint}>
          <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
          <Text style={styles.infoText}>Government issued ID proof</Text>
        </View>
        <View style={styles.bulletPoint}>
          <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
          <Text style={styles.infoText}>Purchase invoice/receipt (if available)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
          <Text style={styles.infoText}>IMEI number (for phones)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
          <Text style={styles.infoText}>Vehicle registration (for cars/bikes)</Text>
        </View>
        <View style={styles.bulletPoint}>
          <MaterialIcons name="check-circle" size={16} color="#2ecc71" />
          <Text style={styles.infoText}>Hallmark certificate (for gold)</Text>
        </View>
      </View>
    </Animatable.View>

    {/* Steps to Register Section */}
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      style={styles.sectionContainer}
    >
      <Text style={styles.sectionTitle}>Steps to Register Complaint</Text>
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Select the stolen item type</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Fill in the details</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Upload required documents</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>Submit and get reference number</Text>
        </View>
      </View>
    </Animatable.View>

    {/* Choose Stolen Item Section */}
    <Animatable.View
      animation="fadeInUp"
      delay={600}
      style={styles.sectionContainer}
    >
      <Text style={styles.sectionTitle}>What was stolen?</Text>
      <Text style={styles.sectionSubtitle}>Select the category to file your complaint</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              selectedCategory === category.id && styles.selectedCategoryCard,
              { borderLeftColor: category.color }
            ]}
            onPress={() => handleCategorySelect(category.id)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
              {renderIcon(category.iconSet, category.icon, category.color, 28)}
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 10,
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: width / 2 - 30,
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
    alignItems: 'center',
  },
  selectedCategoryCard: {
    borderWidth: 1,
    borderColor: '#3498db',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});

export default Complaint