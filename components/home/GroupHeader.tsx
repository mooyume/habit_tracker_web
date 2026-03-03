// components/home/GroupHeader.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface GroupHeaderProps {
  emoji: string;
  label: string;
  completed: number;
  total: number;
}

export default function GroupHeader({ emoji, label, completed, total }: GroupHeaderProps) {
  const allDone = completed === total && total > 0;

  return (
      <View style={styles.container}>
        <View style={styles.left}>
          <View style={styles.line} />
          <Text style={styles.label}>
            {emoji} {label}
          </Text>
          <View style={styles.line} />
        </View>
        <Text style={[styles.progress, allDone && styles.progressDone]}>
          {completed}/{total}
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.border,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginHorizontal: 12,
  },
  progress: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textTertiary,
    marginLeft: 8,
  },
  progressDone: {
    color: Colors.light.success,
  },
});
