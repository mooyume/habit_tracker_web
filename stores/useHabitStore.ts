// stores/useHabitStore.ts

import { create } from 'zustand';
import { Habit, CheckRecord, HabitWithRecord } from '@/types/habit';
import { MOCK_HABITS, MOCK_RECORDS, HABIT_GROUPS } from '@/constants/MockData';
import { formatDate, isSameDay } from '@/utils/date';

// --- Helper Functions (Pure) ---

export const calculateStreak = (records: CheckRecord[], habitId: string) => {
  let streak = 0;
  const today = new Date();

  // 检查今天是否完成
  const todayRecord = records.find(
    (r) => r.habitId === habitId && r.date === formatDate(today) && r.completed
  );

  // 从今天或昨天开始往回数
  const startOffset = todayRecord ? 0 : 1;

  for (let i = startOffset; i < 365; i++) {
    const checkDate = new Date();
    checkDate.setDate(today.getDate() - i);
    const dateStr = formatDate(checkDate);

    const record = records.find(
      (r) => r.habitId === habitId && r.date === dateStr && r.completed
    );

    if (record) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const calculateHabitsWithRecords = (
  habits: Habit[],
  records: CheckRecord[],
  selectedDate: string
): HabitWithRecord[] => {
  const activeHabits = habits.filter((h) => !h.archived);

  return activeHabits.map((habit) => {
    const record = records.find(
      (r) => r.habitId === habit.id && r.date === selectedDate
    );
    const streak = calculateStreak(records, habit.id);

    return { ...habit, record, streak };
  });
};

export const calculateGroupedHabits = (
  habits: Habit[],
  records: CheckRecord[],
  selectedDate: string
) => {
  const habitsWithRecords = calculateHabitsWithRecords(habits, records, selectedDate);

  return HABIT_GROUPS.map((group) => {
    const groupHabits = habitsWithRecords
      .filter((h) => h.group === group.key)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const completed = groupHabits.filter((h) => {
      if (h.type === 'check') return h.record?.completed;
      if (h.type === 'count')
        return (h.record?.count ?? 0) >= (h.targetCount ?? 1);
      if (h.type === 'timer')
        return (h.record?.minutes ?? 0) >= (h.targetMinutes ?? 1);
      return false;
    }).length;

    return {
      group,
      habits: groupHabits,
      completed,
      total: groupHabits.length,
    };
  }).filter((g) => g.habits.length > 0);
};

export const calculateTodayProgress = (
  habits: Habit[],
  records: CheckRecord[],
  selectedDate: string
) => {
  const groups = calculateGroupedHabits(habits, records, selectedDate);
  let completed = 0;
  let total = 0;

  groups.forEach((g) => {
    completed += g.completed;
    total += g.total;
  });

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};

interface HabitStore {
  // 数据
  habits: Habit[];
  records: CheckRecord[];
  selectedDate: string;

  // 日期操作
  setSelectedDate: (date: string) => void;

  // 获取当日带记录的习惯列表
  getHabitsWithRecords: () => HabitWithRecord[];

  // 获取分组数据
  getGroupedHabits: () => {
    group: { key: string; label: string; emoji: string };
    habits: HabitWithRecord[];
    completed: number;
    total: number;
  }[];

  // 打卡操作
  toggleCheck: (habitId: string) => void;
  incrementCount: (habitId: string) => void;
  addMinutes: (habitId: string, minutes: number) => void;

  // 统计
  getTodayProgress: () => { completed: number; total: number; percentage: number };
  getStreak: (habitId: string) => number;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: MOCK_HABITS,
  records: MOCK_RECORDS,
  selectedDate: formatDate(new Date()),

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  getHabitsWithRecords: () => {
    const { habits, records, selectedDate } = get();
    return calculateHabitsWithRecords(habits, records, selectedDate);
  },

  getGroupedHabits: () => {
    const { habits, records, selectedDate } = get();
    return calculateGroupedHabits(habits, records, selectedDate);
  },

  toggleCheck: (habitId: string) => {
    const { records, selectedDate } = get();
    const existingIndex = records.findIndex(
        (r) => r.habitId === habitId && r.date === selectedDate
    );

    const newRecords = [...records];

    if (existingIndex >= 0) {
      // 切换完成状态
      const existing = newRecords[existingIndex];
      newRecords[existingIndex] = {
        ...existing,
        completed: !existing.completed,
        completedAt: !existing.completed
            ? new Date().toISOString()
            : undefined,
      };
    } else {
      // 创建新记录
      newRecords.push({
        id: `record-${habitId}-${selectedDate}-${Date.now()}`,
        habitId,
        date: selectedDate,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }

    set({ records: newRecords });
  },

  incrementCount: (habitId: string) => {
    const { records, selectedDate, habits } = get();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingIndex = records.findIndex(
        (r) => r.habitId === habitId && r.date === selectedDate
    );

    const newRecords = [...records];

    if (existingIndex >= 0) {
      const existing = newRecords[existingIndex];
      const newCount = (existing.count ?? 0) + 1;
      const isCompleted = newCount >= (habit.targetCount ?? 1);

      newRecords[existingIndex] = {
        ...existing,
        count: newCount,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      };
    } else {
      const isCompleted = 1 >= (habit.targetCount ?? 1);
      newRecords.push({
        id: `record-${habitId}-${selectedDate}-${Date.now()}`,
        habitId,
        date: selectedDate,
        completed: isCompleted,
        count: 1,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      });
    }

    set({ records: newRecords });
  },

  addMinutes: (habitId: string, minutes: number) => {
    const { records, selectedDate, habits } = get();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingIndex = records.findIndex(
        (r) => r.habitId === habitId && r.date === selectedDate
    );

    const newRecords = [...records];

    if (existingIndex >= 0) {
      const existing = newRecords[existingIndex];
      const newMinutes = (existing.minutes ?? 0) + minutes;
      const isCompleted = newMinutes >= (habit.targetMinutes ?? 1);

      newRecords[existingIndex] = {
        ...existing,
        minutes: newMinutes,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      };
    } else {
      const isCompleted = minutes >= (habit.targetMinutes ?? 1);
      newRecords.push({
        id: `record-${habitId}-${selectedDate}-${Date.now()}`,
        habitId,
        date: selectedDate,
        completed: isCompleted,
        minutes,
        completedAt: isCompleted ? new Date().toISOString() : undefined,
      });
    }

    set({ records: newRecords });
  },

  getTodayProgress: () => {
    const { habits, records, selectedDate } = get();
    return calculateTodayProgress(habits, records, selectedDate);
  },

  getStreak: (habitId: string) => {
    const { records } = get();
    return calculateStreak(records, habitId);
  },
}));