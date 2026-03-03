// components/weight/WeightEmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

export default function WeightEmptyState() {
  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.container}
    >
      <Text style={styles.illustration}>⚖️</Text>
      <Text style={styles.title}>开始记录体重</Text>
      <Text style={styles.description}>
        记录每一次变化{'\n'}见证每一次进步
      </Text>
      <View style={styles.hint}>
        <Text style={styles.hintText}>点击右下角</Text>
        <Text style={styles.hintIcon}>➕</Text>
        <Text style={styles.hintText}>开始记录</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
    marginHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  illustration: {
    fontSize: 72,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },
  hintText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  hintIcon: {
    fontSize: 18,
    color: Colors.light.primary,
  },
});
