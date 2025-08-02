import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import AuthProvider from './context/AuthContext';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigation />
      <Toast />
    </AuthProvider>
  )
};

export default App;