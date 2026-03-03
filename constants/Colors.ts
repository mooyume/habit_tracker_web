// constants/Colors.ts

export const Colors = {
  light: {
    // 主色
    primary: '#4F46E5',
    primaryLight: '#818CF8',
    primaryDark: '#3730A3',
    primaryBg: '#EEF2FF',

    // 成功/打卡完成
    success: '#10B981',
    successLight: '#34D399',
    successBg: '#ECFDF5',
    successDark: '#059669',

    // 警告
    warning: '#F59E0B',
    warningBg: '#FFFBEB',

    // 错误
    error: '#EF4444',

    // 连续打卡火焰
    streakStart: '#EF4444',
    streakEnd: '#F97316',

    // 背景
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.04)',

    // 文字
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textDisabled: '#CBD5E1',

    // 边框
    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    // Tab 栏
    tabBar: '#FFFFFF',
    tabActive: '#4F46E5',
    tabInactive: '#94A3B8',
  },
  dark: {
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    primaryBg: '#1E1B4B',

    success: '#34D399',
    successLight: '#6EE7B7',
    successBg: '#064E3B',
    successDark: '#10B981',

    warning: '#FBBF24',
    warningBg: '#78350F',

    error: '#F87171',

    streakStart: '#F87171',
    streakEnd: '#FB923C',

    background: '#0F172A',
    card: '#1E293B',
    cardShadow: 'rgba(0, 0, 0, 0.3)',

    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textDisabled: '#475569',

    border: '#334155',
    borderLight: '#1E293B',

    tabBar: '#1E293B',
    tabActive: '#818CF8',
    tabInactive: '#64748B',
  },
};

// 事件可选颜色
export const HabitColors = [
  '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#3B82F6', '#A855F7',
  '#EC4899', '#06B6D4', '#6B7280',
];

export type ColorScheme = typeof Colors.light;
