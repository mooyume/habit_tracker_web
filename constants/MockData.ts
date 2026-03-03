// constants/MockData.ts

import { Habit, CheckRecord, HabitGroup } from '@/types/habit';
import { formatDate } from '@/utils/date';

export const HABIT_GROUPS: HabitGroup[] = [
  { key: 'health', label: '健康', emoji: '🏃' },
  { key: 'study', label: '学习', emoji: '📖' },
  { key: 'life', label: '生活', emoji: '🏠' },
];

const today = formatDate(new Date());

export const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: '晨跑',
    emoji: '🏃',
    color: '#3B82F6',
    type: 'check',
    group: 'health',
    repeatType: 'daily',
    reminderTime: '06:30',
    reminderEnabled: true,
    sortOrder: 0,
    archived: false,
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    name: '喝水',
    emoji: '💧',
    color: '#06B6D4',
    type: 'count',
    group: 'health',
    repeatType: 'daily',
    targetCount: 8,
    reminderEnabled: false,
    sortOrder: 1,
    archived: false,
    createdAt: '2024-12-01',
  },
  {
    id: '3',
    name: '冥想',
    emoji: '🧘',
    color: '#A855F7',
    type: 'timer',
    group: 'health',
    repeatType: 'daily',
    targetMinutes: 15,
    reminderTime: '07:00',
    reminderEnabled: true,
    sortOrder: 2,
    archived: false,
    createdAt: '2024-12-01',
  },
  {
    id: '4',
    name: '俯卧撑',
    emoji: '💪',
    color: '#EF4444',
    type: 'check',
    group: 'health',
    repeatType: 'daily',
    reminderEnabled: false,
    sortOrder: 3,
    archived: false,
    createdAt: '2024-12-10',
  },
  {
    id: '5',
    name: '阅读 30 分钟',
    emoji: '📖',
    color: '#22C55E',
    type: 'timer',
    group: 'study',
    repeatType: 'weekday',
    targetMinutes: 30,
    reminderTime: '21:00',
    reminderEnabled: true,
    sortOrder: 4,
    archived: false,
    createdAt: '2024-12-01',
  },
  {
    id: '6',
    name: '背单词',
    emoji: '🇬🇧',
    color: '#F97316',
    type: 'check',
    group: 'study',
    repeatType: 'daily',
    reminderTime: '08:00',
    reminderEnabled: true,
    sortOrder: 5,
    archived: false,
    createdAt: '2024-11-25',
  },
  {
    id: '7',
    name: '23:00 前入睡',
    emoji: '😴',
    color: '#6366F1',
    type: 'check',
    group: 'life',
    repeatType: 'daily',
    reminderTime: '22:30',
    reminderEnabled: true,
    sortOrder: 6,
    archived: false,
    createdAt: '2024-12-05',
  },
];

// 生成模拟打卡记录
function generateMockRecords(): CheckRecord[] {
  const records: CheckRecord[] = [];

  // 为今天生成部分打卡记录
  const todayRecords: Partial<CheckRecord>[] = [
    { habitId: '1', completed: true, completedAt: `${today}T06:45:00` },
    { habitId: '2', completed: false, count: 5 },
    { habitId: '3', completed: false, minutes: 10 },
    { habitId: '4', completed: true, completedAt: `${today}T08:12:00` },
    { habitId: '6', completed: true, completedAt: `${today}T08:30:00` },
    { habitId: '7', completed: true, completedAt: `${today}T22:45:00` },
  ];

  todayRecords.forEach((r, index) => {
    records.push({
      id: `record-today-${index}`,
      habitId: r.habitId!,
      date: today,
      completed: r.completed ?? false,
      count: r.count,
      minutes: r.minutes,
      completedAt: r.completedAt,
    });
  });

  // 生成过去的连续打卡记录（用于计算 streak）
  const streakMap: Record<string, number> = {
    '1': 16, '2': 10, '3': 7, '4': 3,
    '5': 8, '6': 22, '7': 5,
  };

  Object.entries(streakMap).forEach(([habitId, days]) => {
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);

      records.push({
        id: `record-${habitId}-${dateStr}`,
        habitId,
        date: dateStr,
        completed: true,
        completedAt: `${dateStr}T12:00:00`,
      });
    }
  });

  return records;
}

export const MOCK_RECORDS: CheckRecord[] = generateMockRecords();
