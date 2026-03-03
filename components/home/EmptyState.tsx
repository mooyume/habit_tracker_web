// components/home/EmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

export default function EmptyState() {
  return (
      <Animated.View
          entering={FadeInDown.duration(600).springify()}
          style={styles.container}
      >
        <Text style={styles.illustration}>📋</Text>
        <Text style={styles.title}>还没有打卡事件</Text>
        <Text style={styles.description}>
          创建你的第一个习惯{'\n'}开始记录每一天的进步吧
        </Text>
        <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/create')}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>创建事件</Text>
        </Pressable>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  illustration: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
