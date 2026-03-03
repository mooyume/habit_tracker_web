// components/home/Header.tsx

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getGreeting, getEncouragement } from '@/utils/greeting';
import { Colors } from '@/constants/Colors';

export default function Header() {
  const greeting = getGreeting();
  const encouragement = useMemo(() => getEncouragement(), []);

  return (
      <View style={styles.container}>
        <Text style={styles.greeting}>
          {greeting.text}，小明 {greeting.emoji}
        </Text>
        <Text style={styles.encouragement}>{encouragement}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    letterSpacing: -0.5,
  },
  encouragement: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    marginTop: 4,
  },
});
