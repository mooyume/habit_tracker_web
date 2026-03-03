// app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconsName;
  color: string;
  size: number;
}

function TabIcon({ name, color, size }: TabIconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  return (
      <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.light.tabActive,
            tabBarInactiveTintColor: Colors.light.tabInactive,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarItemStyle: styles.tabItem,
          }}
      >
        <Tabs.Screen
            name="index"
            options={{
              title: '首页',
              tabBarIcon: ({ color, size }) => (
                  <TabIcon name="home" color={color} size={size} />
              ),
            }}
        />
        <Tabs.Screen
            name="stats"
            options={{
              title: '统计',
              tabBarIcon: ({ color, size }) => (
                  <TabIcon name="bar-chart" color={color} size={size} />
              ),
            }}
        />
        <Tabs.Screen
            name="calendar"
            options={{
              title: '日历',
              tabBarIcon: ({ color, size }) => (
                  <TabIcon name="calendar" color={color} size={size} />
              ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
              title: '我的',
              tabBarIcon: ({ color, size }) => (
                  <TabIcon name="person" color={color} size={size} />
              ),
            }}
        />
      </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.light.tabBar,
    borderTopColor: Colors.light.borderLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabItem: {
    paddingVertical: 4,
  },
});
