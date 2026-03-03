// stores/useWeightStore.ts

import { create } from 'zustand';
import { WeightRecord, WeightGoal, WeightStats, ChartDataPoint } from '@/types/weight';
import { generateMockWeightRecords, generateMockWeightGoal } from '@/constants/MockWeightData';
import { calculateBMI } from '@/utils/bmi';
import dayjs from 'dayjs';

interface WeightStore {
  records: WeightRecord[];
  goal: WeightGoal;

  addRecord: (weight: number, date: string, note?: string) => void;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, weight: number, note?: string) => void;
  setGoal: (goal: WeightGoal) => void;
  getStats: () => WeightStats;
  getChartData: (range: 'week' | 'month' | 'year') => ChartDataPoint[];
  getHistory: (limit?: number) => WeightRecord[];
  getRecordByDate: (date: string) => WeightRecord | undefined;
  reload: () => void;
}

export const useWeightStore = create<WeightStore>((set, get) => ({
  records: generateMockWeightRecords(),
  goal: generateMockWeightGoal(),

  addRecord: (weight: number, date: string, note?: string) => {
    const { records } = get();
    const existingIndex = records.findIndex((r) => r.date === date);
    const newRecord: WeightRecord = {
      id: `weight-${date}`,
      date,
      weight,
      note,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      const newRecords = [...records];
      newRecords[existingIndex] = newRecord;
      set({ records: newRecords });
    } else {
      set({ records: [...records, newRecord] });
    }
  },

  deleteRecord: (id: string) => {
    const { records } = get();
    set({ records: records.filter((r) => r.id !== id) });
  },

  updateRecord: (id: string, weight: number, note?: string) => {
    const { records } = get();
    const index = records.findIndex((r) => r.id === id);
    if (index < 0) return;

    const newRecords = [...records];
    newRecords[index] = {
      ...newRecords[index],
      weight,
      note,
    };
    set({ records: newRecords });
  },

  setGoal: (goal: WeightGoal) => {
    set({ goal });
  },

  getStats: () => {
    const { records, goal } = get();
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

    if (sorted.length === 0) {
      return {
        current: 0,
        previous: 0,
        change: 0,
        weekChange: 0,
        monthChange: 0,
        highest: 0,
        lowest: 0,
        average: 0,
        totalDays: 0,
        bmi: 0,
      };
    }

    const current = sorted[sorted.length - 1].weight;
    const previous = sorted.length >= 2 ? sorted[sorted.length - 2].weight : current;
    const change = sorted.length >= 2 ? Math.round((current - previous) * 10) / 10 : 0;

    const weights = sorted.map((r) => r.weight);
    const highest = Math.max(...weights);
    const lowest = Math.min(...weights);
    const average = Math.round((weights.reduce((sum, w) => sum + w, 0) / weights.length) * 10) / 10;

    const today = dayjs();
    const startOfThisWeek = today.startOf('week');
    const startOfLastWeek = startOfThisWeek.subtract(1, 'week');
    const startOfThisMonth = today.startOf('month');
    const startOfLastMonth = startOfThisMonth.subtract(1, 'month');

    const thisWeekRecords = sorted.filter((r) => {
      const d = dayjs(r.date);
      return d.isAfter(startOfThisWeek.subtract(1, 'day')) && d.isBefore(today.add(1, 'day'));
    });
    const lastWeekRecords = sorted.filter((r) => {
      const d = dayjs(r.date);
      return d.isAfter(startOfLastWeek.subtract(1, 'day')) && d.isBefore(startOfThisWeek);
    });

    let weekChange = 0;
    if (thisWeekRecords.length > 0 && lastWeekRecords.length > 0) {
      const thisWeekLatest = thisWeekRecords[thisWeekRecords.length - 1].weight;
      const lastWeekLatest = lastWeekRecords[lastWeekRecords.length - 1].weight;
      weekChange = Math.round((thisWeekLatest - lastWeekLatest) * 10) / 10;
    }

    const thisMonthRecords = sorted.filter((r) => {
      const d = dayjs(r.date);
      return d.isAfter(startOfThisMonth.subtract(1, 'day')) && d.isBefore(today.add(1, 'day'));
    });
    const lastMonthRecords = sorted.filter((r) => {
      const d = dayjs(r.date);
      return d.isAfter(startOfLastMonth.subtract(1, 'day')) && d.isBefore(startOfThisMonth);
    });

    let monthChange = 0;
    if (thisMonthRecords.length > 0 && lastMonthRecords.length > 0) {
      const thisMonthLatest = thisMonthRecords[thisMonthRecords.length - 1].weight;
      const lastMonthLatest = lastMonthRecords[lastMonthRecords.length - 1].weight;
      monthChange = Math.round((thisMonthLatest - lastMonthLatest) * 10) / 10;
    }

    const bmi = goal.height > 0 ? calculateBMI(current, goal.height) : 0;

    return {
      current,
      previous,
      change,
      weekChange,
      monthChange,
      highest,
      lowest,
      average,
      totalDays: sorted.length,
      bmi,
    };
  },

  getChartData: (range: 'week' | 'month' | 'year') => {
    const { records } = get();
    const today = dayjs();
    let startDate: dayjs.Dayjs;

    switch (range) {
      case 'week':
        startDate = today.subtract(6, 'day');
        break;
      case 'month':
        startDate = today.subtract(29, 'day');
        break;
      case 'year':
        startDate = today.subtract(364, 'day');
        break;
    }

    const filtered = records
      .filter((r) => {
        const d = dayjs(r.date);
        return d.isAfter(startDate.subtract(1, 'day')) && d.isBefore(today.add(1, 'day'));
      })
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ date: r.date, weight: r.weight }));

    return filtered;
  },

  getHistory: (limit?: number) => {
    const { records } = get();
    const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
    if (limit !== undefined) {
      return sorted.slice(0, limit);
    }
    return sorted;
  },

  getRecordByDate: (date: string) => {
    const { records } = get();
    return records.find((r) => r.date === date);
  },

  reload: () => {
    set({
      records: generateMockWeightRecords(),
      goal: generateMockWeightGoal(),
    });
  },
}));
