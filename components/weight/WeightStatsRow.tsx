// components/weight/WeightStatsRow.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { WeightStats } from '@/types/weight';

interface WeightStatsRowProps {
  stats: WeightStats;
}

const WeightStatsRow: React.FC<WeightStatsRowProps> = React.memo(({ stats }) => {
  const { width } = Dimensions.get('window');
  const cardWidth = (width - 60) / 2.5;

  const renderChangeValue = (value: number) => {
    if (stats.totalDays === 0) {
      return <Text style={styles.valueText}>——</Text>;
    }
    
    if (value < 0) {
      return (
        <Text style={styles.valueTextSuccess}>
          ↓{Math.abs(value).toFixed(1)}
        </Text>
      );
    } else if (value > 0) {
      return (
        <Text style={styles.valueTextError}>
          ↑{value.toFixed(1)}
        </Text>
      );
    } else {
      return (
        <Text style={styles.valueTextNeutral}>
          →0.0
        </Text>
      );
    }
  };

  const statsData = [
    {
      title: '本周变化',
      value: stats.totalDays === 0 ? '——' : renderChangeValue(stats.weekChange),
      unit: 'kg',
      showUnit: stats.totalDays > 0,
    },
    {
      title: '本月变化',
      value: stats.totalDays === 0 ? '——' : renderChangeValue(stats.monthChange),
      unit: 'kg',
      showUnit: stats.totalDays > 0,
    },
    {
      title: '平均体重',
      value: stats.totalDays === 0 ? '——' : stats.average.toFixed(1),
      unit: 'kg',
      showUnit: stats.totalDays > 0,
    },
    {
      title: '已记录',
      value: stats.totalDays === 0 ? '——' : stats.totalDays.toString(),
      unit: '天',
      showUnit: stats.totalDays > 0,
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {statsData.map((item, index) => (
        <Animated.View
          key={item.title}
          style={[styles.card, { width: cardWidth }]}
          entering={FadeInRight.delay(index * 80).duration(400).springify()}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.valueContainer}>
            {typeof item.value === 'string' && stats.totalDays === 0 ? (
              <Text style={styles.valueText}>{item.value}</Text>
            ) : typeof item.value === 'string' ? (
              <Text style={styles.valueText}>{item.value}</Text>
            ) : (
              item.value
            )}
            {item.showUnit && (
              <Text style={styles.unitText}>{item.unit}</Text>
            )}
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
  },
  valueTextSuccess: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.success,
  },
  valueTextError: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.error,
  },
  valueTextNeutral: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.textTertiary,
  },
  unitText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginLeft: 4,
  },
});

export default WeightStatsRow;
