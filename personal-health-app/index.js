// index.js
import { registerRootComponent } from 'expo';
import React from 'react';
import { AuthProvider } from './app/context/AuthContext';
import AppNavigator from './app/navigation/AppNavigator';

const RootApp = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

registerRootComponent(RootApp);
