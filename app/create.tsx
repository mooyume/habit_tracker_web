// app/create.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <Pressable
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color={Colors.light.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>创建新事件</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* 占位内容 */}
        <View style={styles.content}>
          <Text style={styles.emoji}>✨</Text>
          <Text style={styles.title}>创建事件页</Text>
          <Text style={styles.placeholder}>开发中，敬请期待...</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.light.textTertiary,
  },
});
