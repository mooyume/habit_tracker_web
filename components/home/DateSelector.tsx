// components/home/DateSelector.tsx

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { useHabitStore } from '@/stores/useHabitStore';
import {
  getWeekDates,
  getWeekDayLabel,
  getDayNumber,
  formatDate,
  isDateToday,
  isSameDay,
} from '@/utils/date';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ITEM_WIDTH = 48;
const ITEM_MARGIN = 6;
const screenWidth = Dimensions.get('window').width;

interface DateItemProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  hasRecords: boolean;
  onPress: () => void;
}

function DateItem({ date, isSelected, isToday, hasRecords, onPress }: DateItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
      <AnimatedPressable
          onPress={handlePress}
          style={[
            styles.dateItem,
            isSelected && styles.dateItemSelected,
            animatedStyle,
          ]}
      >
        <Text
            style={[
              styles.weekDay,
              isSelected && styles.weekDaySelected,
            ]}
        >
          {getWeekDayLabel(date)}
        </Text>
        <Text
            style={[
              styles.dayNumber,
              isSelected && styles.dayNumberSelected,
              isToday && !isSelected && styles.dayNumberToday,
            ]}
        >
          {getDayNumber(date)}
        </Text>
        {hasRecords && !isSelected && (
            <View style={styles.dot} />
        )}
        {isSelected && isToday && (
            <Text style={styles.todayLabel}>今天</Text>
        )}
      </AnimatedPressable>
  );
}

export default function DateSelector() {
  const scrollRef = useRef<ScrollView>(null);
  const { selectedDate, setSelectedDate, records } = useHabitStore();

  const dates = getWeekDates(new Date(selectedDate));

  // 检查某天是否有打卡记录
  const hasRecordsOnDate = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return records.some((r) => r.date === dateStr && r.completed);
  };

  useEffect(() => {
    // 滚动到中间
    const centerOffset =
        3 * (ITEM_WIDTH + ITEM_MARGIN * 2) -
        screenWidth / 2 +
        ITEM_WIDTH / 2 +
        20;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ x: Math.max(0, centerOffset), animated: false });
    }, 100);
  }, []);

  return (
      <View style={styles.container}>
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
          {dates.map((date, index) => {
            const dateStr = formatDate(date);
            const isSelected = dateStr === selectedDate;
            const today = isDateToday(date);
            const hasRec = hasRecordsOnDate(date);

            return (
                <DateItem
                    key={dateStr}
                    date={date}
                    isSelected={isSelected}
                    isToday={today}
                    hasRecords={hasRec}
                    onPress={() => setSelectedDate(dateStr)}
                />
            );
          })}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 14,
  },
  dateItem: {
    width: ITEM_WIDTH,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: ITEM_MARGIN,
    backgroundColor: 'transparent',
  },
  dateItemSelected: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  weekDay: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.light.textTertiary,
    marginBottom: 4,
  },
  weekDaySelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  dayNumberToday: {
    color: Colors.light.primary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.primary,
    marginTop: 4,
  },
  todayLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
});
