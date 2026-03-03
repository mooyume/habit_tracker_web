// app/(tabs)/index.tsx

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';
import { useWeightStore } from '@/stores/useWeightStore';
import type { WeightRecord } from '@/types/weight';
import WeightStatusCard from '@/components/weight/WeightStatusCard';
import WeightChart from '@/components/weight/WeightChart';
import WeightStatsRow from '@/components/weight/WeightStatsRow';
import WeightHistory from '@/components/weight/WeightHistory';
import WeightFAB from '@/components/weight/WeightFAB';
import WeightInputSheet from '@/components/weight/WeightInputSheet';
import ConfettiEffect from '@/components/ui/ConfettiEffect';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [chartRange, setChartRange] = useState<'week' | 'month' | 'year'>('week');
  const [sheetVisible, setSheetVisible] = useState(false);

  const [showAllHistory, setShowAllHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const records = useWeightStore((state) => state.records);
  const goal = useWeightStore((state) => state.goal);

  const stats = useMemo(() => {
    return useWeightStore.getState().getStats();
  }, [records, goal]);

  const chartData = useMemo(() => {
    return useWeightStore.getState().getChartData(chartRange);
  }, [records, chartRange]);

  const historyRecords = useMemo(() => {
    return useWeightStore.getState().getHistory();
  }, [records]);

  const lastRecord = useMemo(() => {
    if (historyRecords.length === 0) return undefined;
    return historyRecords[0];
  }, [historyRecords]);

  const handleRangeChange = useCallback((range: 'week' | 'month' | 'year') => {
    setChartRange(range);
  }, []);

  const handleFABPress = useCallback(() => {
    setSheetVisible(true);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const handleSave = useCallback((weight: number, date: string, note?: string) => {
    const store = useWeightStore.getState();
    const today = dayjs().format('YYYY-MM-DD');

    if (dayjs(date).isAfter(dayjs(today))) {
      return;
    }

    store.addRecord(weight, date, note);
    const currentStats = store.getStats();
    if (weight <= currentStats.lowest || currentStats.totalDays <= 1) {
      setShowConfetti(true);
    }
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleDelete = useCallback((id: string) => {
    useWeightStore.getState().deleteRecord(id);
  }, []);

  const handleToggleShowAll = useCallback(() => {
    setShowAllHistory((prev) => !prev);
  }, []);

  const handleGoalChange = useCallback((targetWeight: number) => {
    const store = useWeightStore.getState();
    store.setGoal({ ...store.goal, targetWeight });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      useWeightStore.getState().reload();
      setRefreshing(false);
    }, 800);
  }, []);

  return (
    <GestureHandlerRootView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.light.primary} />
        }
      >
        <WeightStatusCard stats={stats} goal={goal} onGoalChange={handleGoalChange} />

            <View style={styles.sectionGap} />

            <WeightChart
              chartData={chartData}
              targetWeight={goal.targetWeight}
              range={chartRange}
              onRangeChange={handleRangeChange}
            />

            <View style={styles.sectionGap} />

            <WeightStatsRow stats={stats} />

            <View style={styles.sectionGap} />

        <WeightHistory
          records={historyRecords}
          onDelete={handleDelete}
          showAll={showAllHistory}
          onToggleShowAll={handleToggleShowAll}
        />
      </ScrollView>

      <WeightFAB onPress={handleFABPress} />

      <WeightInputSheet
        visible={sheetVisible}
        onClose={handleSheetClose}
        onSave={handleSave}
        initialWeight={stats.current}
        lastRecord={lastRecord}
      />

      <ConfettiEffect
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  sectionGap: {
    height: 12,
  },
});