// handles the main app screens (ones in tabs folder)

// app/navigation/MainNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../(tabs)/explore';
import IndexScreen from '../(tabs)/index';
import ProfileScreen from '../(tabs)/profile';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={ExploreScreen} />
      <Tab.Screen name="Goals" component={IndexScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
