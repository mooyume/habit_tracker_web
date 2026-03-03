// components/home/HabitCard.tsx

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  Layout,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { HabitWithRecord } from '@/types/habit';
import { useHabitStore } from '@/stores/useHabitStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ════════════════════════════════════════
// 主组件
// ════════════════════════════════════════

interface HabitCardProps {
  habit: HabitWithRecord;
  index: number;
}

export default function HabitCard({ habit, index }: HabitCardProps) {
  const { toggleCheck, incrementCount, addMinutes } = useHabitStore();

  const isCompleted = getIsCompleted(habit);

  // 动画共享值
  const cardScale = useSharedValue(1);
  const checkScale = useSharedValue(1);

  // 卡片动画样式
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // 按钮动画样式
  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  // 打卡操作
  const handleCheck = useCallback(() => {
    // 按钮弹跳动画
    checkScale.value = withSequence(
        withTiming(0.6, { duration: 80 }),
        withSpring(1.35, { damping: 8, stiffness: 300 }),
        withSpring(1, { damping: 12, stiffness: 200 })
    );

    // 卡片缩放动画
    cardScale.value = withSequence(
        withTiming(0.97, { duration: 80 }),
        withSpring(1, { damping: 15 })
    );

    // 触觉反馈
    if (!isCompleted) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // 执行打卡
    if (habit.type === 'check') {
      toggleCheck(habit.id);
    } else if (habit.type === 'count') {
      incrementCount(habit.id);
    } else if (habit.type === 'timer') {
      addMinutes(habit.id, 5);
    }
  }, [habit.id, habit.type, isCompleted]);

  // 长按操作
  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: 弹出操作菜单
  }, []);

  // 完成时间
  const completedTime = habit.record?.completedAt
      ? new Date(habit.record.completedAt).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
      })
      : null;

  const subtitle = getSubtitle(habit, completedTime);

  return (
      <Animated.View
          entering={FadeIn.delay(index * 60).duration(400)}
          layout={Layout.springify().damping(15)}
      >
        <AnimatedPressable
            onLongPress={handleLongPress}
            style={[
              styles.card,
              isCompleted && styles.cardCompleted,
              cardAnimatedStyle,
            ]}
        >
          {/* ── 左侧图标 ── */}
          <View
              style={[
                styles.emojiContainer,
                { backgroundColor: habit.color + '15' },
              ]}
          >
            <Text style={styles.emoji}>{habit.emoji}</Text>
          </View>

          {/* ── 中间信息区 ── */}
          <View style={styles.info}>
            <Text
                style={[styles.name, isCompleted && styles.nameCompleted]}
                numberOfLines={1}
            >
              {habit.name}
            </Text>

            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>

            {/* 计数型进度 */}
            {habit.type === 'count' && (
                <CountProgress
                    current={habit.record?.count ?? 0}
                    target={habit.targetCount ?? 1}
                    color={habit.color}
                />
            )}

            {/* 计时型进度 */}
            {habit.type === 'timer' && (
                <TimerProgress
                    current={habit.record?.minutes ?? 0}
                    target={habit.targetMinutes ?? 1}
                    color={habit.color}
                />
            )}

            {/* 连续打卡 */}
            {habit.streak > 0 && (
                <View style={styles.streakRow}>
                  <Text style={styles.streakFire}>🔥</Text>
                  <Text style={styles.streakText}>连续 {habit.streak} 天</Text>
                </View>
            )}
          </View>

          {/* ── 右侧按钮 ── */}
          <AnimatedPressable
              onPress={handleCheck}
              style={[styles.checkButton, checkAnimatedStyle]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <CheckButtonContent habit={habit} isCompleted={isCompleted} />
          </AnimatedPressable>
        </AnimatedPressable>
      </Animated.View>
  );
}

// ════════════════════════════════════════
// 子组件：计数进度
// ════════════════════════════════════════

function CountProgress({
                         current,
                         target,
                         color,
                       }: {
  current: number;
  target: number;
  color: string;
}) {
  // 最多显示 12 个圆点，超出用进度条
  const useDots = target <= 12;

  if (useDots) {
    return (
        <View style={styles.progressRow}>
          <View style={styles.dotsContainer}>
            {Array.from({ length: target }).map((_, i) => (
                <View
                    key={i}
                    style={[
                      styles.progressDot,
                      {
                        backgroundColor:
                            i < current ? color : Colors.light.border,
                      },
                    ]}
                />
            ))}
          </View>
          <Text style={styles.countText}>
            {current} / {target}
          </Text>
        </View>
    );
  }

  // 超过12个，用进度条
  const progress = Math.min(current / target, 1);
  return (
      <View style={styles.timerRow}>
        <View style={styles.timerBarBg}>
          <View
              style={[
                styles.timerBarFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: color,
                },
              ]}
          />
        </View>
        <Text style={styles.countText}>
          {current} / {target}
        </Text>
      </View>
  );
}

// ════════════════════════════════════════
// 子组件：计时进度
// ════════════════════════════════════════

function TimerProgress({
                         current,
                         target,
                         color,
                       }: {
  current: number;
  target: number;
  color: string;
}) {
  const progress = Math.min(current / target, 1);

  return (
      <View style={styles.timerRow}>
        <View style={styles.timerBarBg}>
          <View
              style={[
                styles.timerBarFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: color,
                },
              ]}
          />
        </View>
        <Text style={styles.countText}>
          {current} / {target} 分钟
        </Text>
      </View>
  );
}

// ════════════════════════════════════════
// 子组件：打卡按钮内容
// ════════════════════════════════════════

function CheckButtonContent({
                              habit,
                              isCompleted,
                            }: {
  habit: HabitWithRecord;
  isCompleted: boolean;
}) {
  // 已完成：绿色打勾
  if (isCompleted) {
    return (
        <View style={[styles.checkCircle, styles.checkCircleDone]}>
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
        </View>
    );
  }

  // 普通打卡：空心圆
  if (habit.type === 'check') {
    return <View style={[styles.checkCircle, styles.checkCircleUndone]} />;
  }

  // 计数型：加号
  if (habit.type === 'count') {
    return (
        <View style={[styles.checkCircle, styles.checkCircleAction]}>
          <Ionicons name="add" size={20} color={Colors.light.primary} />
        </View>
    );
  }

  // 计时型：播放
  if (habit.type === 'timer') {
    return (
        <View style={[styles.checkCircle, styles.checkCircleAction]}>
          <Ionicons name="play" size={16} color={Colors.light.primary} />
        </View>
    );
  }

  return null;
}

// ════════════════════════════════════════
// 工具函数
// ════════════════════════════════════════

function getIsCompleted(habit: HabitWithRecord): boolean {
  if (!habit.record) return false;
  if (habit.type === 'check') return habit.record.completed;
  if (habit.type === 'count')
    return (habit.record.count ?? 0) >= (habit.targetCount ?? 1);
  if (habit.type === 'timer')
    return (habit.record.minutes ?? 0) >= (habit.targetMinutes ?? 1);
  return false;
}

function getSubtitle(habit: HabitWithRecord, completedTime: string | null): string {
  const repeatLabel =
      habit.repeatType === 'daily'
          ? '每天'
          : habit.repeatType === 'weekday'
              ? '工作日'
              : '自定义';

  const completed = getIsCompleted(habit);

  if (completed && completedTime) {
    return `${repeatLabel} · ${completedTime} 已完成`;
  }

  if (habit.type === 'count') {
    return `${repeatLabel} · 目标 ${habit.targetCount} 次`;
  }

  if (habit.type === 'timer') {
    return `${repeatLabel} · 目标 ${habit.targetMinutes} 分钟`;
  }

  if (habit.reminderEnabled && habit.reminderTime) {
    return `${repeatLabel} · ${habit.reminderTime} 提醒`;
  }

  return repeatLabel;
}

// ════════════════════════════════════════
// 样式
// ════════════════════════════════════════

const styles = StyleSheet.create({
  // 卡片容器
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: {
    backgroundColor: Colors.light.successBg,
    shadowColor: Colors.light.success,
    shadowOpacity: 0.08,
  },

  // 左侧图标
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 22,
  },

  // 中间信息
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  nameCompleted: {
    color: Colors.light.successDark,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginTop: 3,
  },

  // streak 连续打卡
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  streakFire: {
    fontSize: 12,
    marginRight: 3,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },

  // 计数进度圆点
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  countText: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginLeft: 8,
  },

  // 计时进度条
  timerRow: {
    marginTop: 8,
  },
  timerBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.borderLight,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // 右侧打卡按钮
  checkButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleUndone: {
    borderWidth: 2.5,
    borderColor: Colors.light.border,
    backgroundColor: 'transparent',
  },
  checkCircleDone: {
    backgroundColor: Colors.light.success,
    borderWidth: 0,
  },
  checkCircleAction: {
    borderWidth: 2,
    borderColor: Colors.light.primaryLight,
    backgroundColor: Colors.light.primaryBg,
  },
});
