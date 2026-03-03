// types/habit.ts

export type HabitType = 'check' | 'count' | 'timer';

export type RepeatType = 'daily' | 'weekday' | 'custom';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  type: HabitType;
  group: string;
  repeatType: RepeatType;
  repeatDays?: number[];       // 0-6, 0=周日
  targetCount?: number;        // 计数型目标
  targetMinutes?: number;      // 计时型目标（分钟）
  reminderTime?: string;       // "06:30"
  reminderEnabled: boolean;
  sortOrder: number;
  archived: boolean;
  createdAt: string;
}

export interface CheckRecord {
  id: string;
  habitId: string;
  date: string;                // "2024-12-17"
  completed: boolean;
  count?: number;              // 计数型：当前次数
  minutes?: number;            // 计时型：当前分钟数
  note?: string;
  mood?: string;
  completedAt?: string;        // ISO 时间戳
}

export interface HabitGroup {
  key: string;
  label: string;
  emoji: string;
}

export interface HabitWithRecord extends Habit {
  record?: CheckRecord;
  streak: number;
}
