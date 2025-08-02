import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import * as Animatable from 'react-native-animatable'
import PhoneForm from '../components/PhoneForm'
import LaptopForm from '../components/LaptopForm'
import BikeForm from '../components/BikeForm'
import CarForm from '../components/CarForm'
import GoldForm from '../components/GoldForm'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ComplaintForm = ({ route, navigation }) => {
  const { category } = route.params

  // Category configuration
  const categoryConfig = {
    phone: {
      title: "Phone Theft Report",
      icon: "smartphone",
      color: "#3498db",
      component: <PhoneForm />
    },
    laptop: {
      title: "Laptop Theft Report",
      icon: "laptop",
      color: "#e74c3c",
      component: <LaptopForm />
    },
    bike: {
      iconType: 'FontAwesome',
      title: "Bike Theft Report",
      icon: "bicycle",
      color: "#2ecc71",
      component: <BikeForm />
    },
    car: {
      iconType: 'FontAwesome',
      title: "Car Theft Report",
      icon: "car",
      color: "#f39c12",
      component: <CarForm />
    },
    gold: {
      iconType: 'MaterialIcons',
      title: "Gold Theft Report",
      icon: "diamond",
      color: "#9b59b6",
      component: <GoldForm />
    }
  }

  const currentCategory = categoryConfig[category]

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section with dynamic title */}
      <Header title={currentCategory.title} />

      {/* Hero Section */}
      <Animatable.View
        animation="fadeIn"
        style={[styles.heroContainer, { backgroundColor: currentCategory.color }]}
      >
        <View style={styles.heroHeader}>
          {currentCategory?.iconType === 'FontAwesome' ? (
            <FontAwesome
              name={currentCategory.icon}
              size={30}
              color="white"
              style={styles.categoryIcon}
            />
          )
            :
            (
              <MaterialIcons
                name={currentCategory.icon}
                size={30}
                color="white"
                style={styles.categoryIcon}
              />
            )
          }
          <Text style={styles.heroTitle}>Lost Your {category.charAt(0).toUpperCase() + category.slice(1)}?</Text>
        </View>
        <Text style={styles.heroText}>
          Enter valid details, this will be verified by the Admin before investigation.
          Providing accurate information increases recovery chances.
        </Text>
      </Animatable.View>

      {/* Important Notice */}
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        style={styles.noticeContainer}
      >
        <MaterialIcons name="warning" size={20} color="#f39c12" />
        <Text style={styles.noticeText}>
          False complaints may lead to legal action. Ensure all information is accurate.
        </Text>
      </Animatable.View>

      {/* Dynamic Form Section */}
      <Animatable.View
        animation="fadeInUp"
        delay={400}
        style={styles.formContainer}
      >
        {currentCategory.component}
      </Animatable.View>
    </ScrollView>
  )
}

export default ComplaintForm

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingBottom: 40,
  },
  heroContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    marginRight: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  heroText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
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
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
})