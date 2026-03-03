// components/home/ProgressRing.tsx

import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { useHabitStore, calculateTodayProgress } from '@/stores/useHabitStore';
import { useShallow } from 'zustand/react/shallow';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RING_SIZE = 120;
const STROKE_WIDTH = 10;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ProgressRing() {
  const { habits, records, selectedDate } = useHabitStore(
    useShallow((s) => ({
      habits: s.habits,
      records: s.records,
      selectedDate: s.selectedDate,
    }))
  );

  const { completed, total, percentage } = useMemo(
    () => calculateTodayProgress(habits, records, selectedDate),
    [habits, records, selectedDate]
  );

  const progress = useSharedValue(0);
  const displayPercentage = useSharedValue(0);

  useEffect(() => {
    const target = total > 0 ? completed / total : 0;
    progress.value = withTiming(target, {
      duration: 1000,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
    displayPercentage.value = withTiming(percentage, {
      duration: 1000,
      easing: Easing.bezierFn(0.25, 0.1, 0.25, 1),
    });
  }, [completed, total, percentage]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  // 根据完成度选择颜色
  const ringColor =
      percentage >= 100
          ? Colors.light.success
          : percentage >= 50
              ? Colors.light.primary
              : Colors.light.primaryLight;

  return (
      <View style={styles.container}>
        <View style={styles.ringWrapper}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            {/* 背景圆环 */}
            <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={Colors.light.borderLight}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
            />
            {/* 进度圆环 */}
            <AnimatedCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={ringColor}
                strokeWidth={STROKE_WIDTH}
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
                transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            />
          </Svg>

          {/* 中心文字 */}
          <View style={styles.centerText}>
            <Text style={styles.fractionText}>
              <Text style={styles.completedNumber}>{completed}</Text>
              <Text style={styles.divider}> / </Text>
              <Text style={styles.totalNumber}>{total}</Text>
            </Text>
            <Text style={styles.percentageText}>{percentage}%</Text>
          </View>
        </View>

        {/* 底部状态 */}
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.statusLabel}>已完成 {completed}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: Colors.light.textDisabled }]} />
            <Text style={styles.statusLabel}>剩余 {total - completed}</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
  },
  fractionText: {
    fontSize: 14,
  },
  completedNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  divider: {
    fontSize: 14,
    color: Colors.light.textTertiary,
  },
  totalNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textTertiary,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  statusDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.light.border,
    marginHorizontal: 16,
  },
});