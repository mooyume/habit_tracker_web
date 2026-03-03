// app/(tabs)/stats.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

export default function StatsScreen() {
  const insets = useSafeAreaInsets();

  return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.title}>📊 统计</Text>
        <Text style={styles.placeholder}>开发中，敬请期待...</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.light.textTertiary,
  },
});
