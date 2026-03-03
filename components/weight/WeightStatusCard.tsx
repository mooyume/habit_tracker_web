// components/weight/WeightStatusCard.tsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';
import { WeightStats, WeightGoal } from '@/types/weight';
import { getBMILevel } from '@/utils/bmi';

const PRIMARY_COLOR = '#4F46E5';

interface WeightStatusCardProps {
  stats: WeightStats;
  goal: WeightGoal;
  onGoalChange?: (targetWeight: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WeightStatusCard: React.FC<WeightStatusCardProps> = React.memo(({ stats, goal, onGoalChange }) => {
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalInputText, setGoalInputText] = useState('');
  const goalInputRef = useRef<TextInput>(null);

  const progress = goal.targetWeight > 0 && goal.startWeight !== goal.targetWeight
    ? Math.max(0, Math.min(1, (goal.startWeight - stats.current) / (goal.startWeight - goal.targetWeight)))
    : 0;

  // 区域2：体重数字动画
  const [displayedWeight, setDisplayedWeight] = useState('0.0');
  const weightAnimRef = useRef<number | null>(null);
  const prevWeightRef = useRef(0);

  useEffect(() => {
    if (stats.current === 0) {
      setDisplayedWeight('——');
      prevWeightRef.current = 0;
      return;
    }
    const startVal = prevWeightRef.current;
    const endVal = stats.current;
    prevWeightRef.current = endVal;

    if (weightAnimRef.current !== null) {
      cancelAnimationFrame(weightAnimRef.current);
    }

    const duration = 800;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 3);
      const currentVal = startVal + (endVal - startVal) * eased;
      setDisplayedWeight(currentVal.toFixed(1));

      if (progressRatio < 1) {
        weightAnimRef.current = requestAnimationFrame(animate);
      } else {
        weightAnimRef.current = null;
      }
    };

    weightAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (weightAnimRef.current !== null) {
        cancelAnimationFrame(weightAnimRef.current);
      }
    };
  }, [stats.current]);

  // 区域4：进度条动画
  const progressSharedValue = useSharedValue(0);
  const dotScale = useSharedValue(1);

  useEffect(() => {
    progressSharedValue.value = withDelay(700, withTiming(progress, { duration: 1000 }));
    dotScale.value = withDelay(1700, withSequence(
      withSpring(1.4, { damping: 6, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 180 }),
    ));
  }, [progress]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressSharedValue.value * 100}%`,
  }));

  const dotAnimatedStyle = useAnimatedStyle(() => ({
    left: `${progressSharedValue.value * 100}%`,
    transform: [{ scale: dotScale.value }],
  }));

  const currentLabelAnimatedStyle = useAnimatedStyle(() => ({
    left: `${progressSharedValue.value * 100}%`,
  }));

  // 区域3：目标卡片点击态
  const goalCardScale = useSharedValue(1);
  const goalCardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: goalCardScale.value }],
  }));

  // 变化值
  const getChangeInfo = useCallback(() => {
    if (stats.totalDays < 2) return null;
    if (stats.change < 0) {
      return {
        text: `↓ ${Math.abs(stats.change).toFixed(1)} kg`,
        color: Colors.light.success,
        desc: '较上次下降',
      };
    } else if (stats.change > 0) {
      return {
        text: `↑ ${stats.change.toFixed(1)} kg`,
        color: Colors.light.error,
        desc: '较上次上升',
      };
    }
    return {
      text: '→ 0.0 kg',
      color: '#94A3B8',
      desc: '较上次持平',
    };
  }, [stats.change, stats.totalDays]);

  // BMI
  const bmiLevel = (goal.height > 0 && stats.current > 0) ? getBMILevel(stats.bmi) : null;
  const bmiEmoji = bmiLevel
    ? (bmiLevel.label === '正常' ? '🟢' : bmiLevel.label === '偏瘦' ? '🔵' : bmiLevel.label === '偏胖' ? '🟡' : '🔴')
    : '';
  
  const hasNoHeight = goal.height === 0 || goal.height === 175;

  // 目标差值
  const goalDiff = goal.targetWeight > 0
    ? Math.abs(Math.round((stats.current - goal.targetWeight) * 10) / 10)
    : 0;
  const needReduce = stats.current > goal.targetWeight;

  const handleGoalPress = () => {
    goalCardScale.value = withSequence(
      withTiming(0.97, { duration: 80 }),
      withTiming(1, { duration: 120 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setGoalInputText(goal.targetWeight > 0 ? goal.targetWeight.toFixed(1) : '');
    setGoalModalVisible(true);
    setTimeout(() => goalInputRef.current?.focus(), 300);
  };

  const handleGoalInputChange = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, '');
    const dotCount = (filtered.match(/\./g) || []).length;
    if (dotCount > 1) return;
    const parts = filtered.split('.');
    if (parts[1] && parts[1].length > 1) return;
    setGoalInputText(filtered);
  };

  const handleGoalSave = () => {
    Keyboard.dismiss();
    const parsed = parseFloat(goalInputText);
    if (!isNaN(parsed) && parsed >= 30 && parsed <= 200 && onGoalChange) {
      onGoalChange(Math.round(parsed * 10) / 10);
    }
    setGoalModalVisible(false);
  };

  const changeInfo = getChangeInfo();

  return (
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(500).springify()}
    >
      {/* 区域1：标签 */}
      <Text style={styles.label}>当前体重</Text>

      {/* 区域2：核心数据行 */}
      <View style={styles.coreRow}>
        <View style={styles.weightLeft}>
          <Text style={styles.weightText}>
            {displayedWeight}
          </Text>
          {stats.current > 0 && <Text style={styles.unitText}>kg</Text>}
        </View>
        {changeInfo && (
          <Animated.View style={styles.changeRight} entering={FadeIn.delay(600)}>
            <Text style={[styles.changeValueText, { color: changeInfo.color }]}>
              {changeInfo.text}
            </Text>
            <Text style={styles.changeDescText}>{changeInfo.desc}</Text>
          </Animated.View>
        )}
      </View>

      {/* 区域3：BMI + 目标小卡片 */}
      <Animated.View style={styles.infoCardsRow} entering={FadeInUp.delay(500).springify()}>
        {bmiLevel ? (
          <View style={[styles.infoCard, styles.bmiCard, { backgroundColor: bmiLevel.bgColor }]}>
            <Text style={[styles.infoCardTitle, { color: bmiLevel.color }]}>
              BMI {stats.bmi}
            </Text>
            <Text style={[styles.infoCardSub, { color: bmiLevel.color }]}>
              {bmiEmoji} {bmiLevel.label}
            </Text>
          </View>
        ) : hasNoHeight && stats.current > 0 ? (
          <View style={[styles.infoCard, styles.bmiCard, styles.bmiCardEmpty]}>
            <Text style={styles.infoCardTitle}>BMI</Text>
            <Text style={styles.infoCardSub}>设置身高后计算</Text>
          </View>
        ) : null}
        <AnimatedPressable
          style={[
            styles.infoCard, 
            styles.goalCard, 
            goalCardAnimStyle,
            goal.targetWeight === 0 && styles.goalCardEmpty
          ]}
          onPress={handleGoalPress}
        >
          {goal.targetWeight > 0 ? (
            <>
              <Text style={styles.infoCardTitle}>
                🎯 目标 {goal.targetWeight.toFixed(1)} kg
              </Text>
              <Text style={styles.infoCardSub}>
                还需{needReduce ? '减' : '增'} {goalDiff} kg
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.infoCardTitle, styles.goalCardEmptyTitle]}>
                🎯 设置目标体重 →
              </Text>
              <Text style={styles.infoCardSub}>点击设置目标</Text>
            </>
          )}
        </AnimatedPressable>
      </Animated.View>

      {/* 区域4：进度条 */}
      {goal.targetWeight > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressLabelText}>{goal.startWeight.toFixed(1)}</Text>
            <Text style={styles.progressLabelText}>{goal.targetWeight.toFixed(1)}</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
            <Animated.View style={[styles.progressDot, dotAnimatedStyle]} />
          </View>
          <View style={styles.currentLabelWrapper}>
            <Animated.View style={[styles.currentLabelContainer, currentLabelAnimatedStyle]}>
              <Text style={styles.currentLabelText}>{stats.current.toFixed(1)}</Text>
            </Animated.View>
          </View>
        </View>
      )}

      {/* 目标编辑弹窗 */}
      <Modal visible={goalModalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboardView}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setGoalModalVisible(false)}>
            <Pressable style={styles.modalContent} onPress={(e) => { e.stopPropagation(); Keyboard.dismiss(); }}>
              <Text style={styles.modalTitle}>设置目标体重</Text>
              <View style={styles.modalInputRow}>
                <TextInput
                  ref={goalInputRef}
                  style={styles.modalInput}
                  keyboardType="decimal-pad"
                  value={goalInputText}
                  onChangeText={handleGoalInputChange}
                  placeholder="输入目标体重"
                  placeholderTextColor="#94A3B8"
                  maxLength={5}
                  returnKeyType="done"
                  onSubmitEditing={handleGoalSave}
                />
                <Text style={styles.modalUnit}>kg</Text>
              </View>
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalCancelButton} onPress={() => { Keyboard.dismiss(); setGoalModalVisible(false); }}>
                  <Text style={styles.modalCancelText}>取消</Text>
                </Pressable>
                <Pressable style={styles.modalSaveButton} onPress={handleGoalSave}>
                  <Text style={styles.modalSaveText}>确定</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  // 区域1
  label: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  // 区域2
  coreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  weightLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  weightText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.light.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  unitText: {
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 4,
  },
  changeRight: {
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  changeValueText: {
    fontSize: 20,
    fontWeight: '600',
  },
  changeDescText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  // 区域3
  infoCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  infoCard: {
    borderRadius: 12,
    padding: 12,
  },
  bmiCard: {
    flex: 1,
  },
  bmiCardEmpty: {
    backgroundColor: '#F8FAFC',
  },
  goalCard: {
    flex: 1.2,
    backgroundColor: '#F8FAFC',
  },
  goalCardEmpty: {
    backgroundColor: '#EEF2FF',
  },
  goalCardEmptyTitle: {
    color: PRIMARY_COLOR,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  infoCardSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  // 区域4
  progressSection: {
    marginTop: 2,
  },
  progressLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabelText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 4,
  },
  progressDot: {
    position: 'absolute',
    top: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.light.card,
    borderWidth: 2.5,
    borderColor: PRIMARY_COLOR,
    marginLeft: -7,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 3,
  },
  currentLabelWrapper: {
    position: 'relative',
    height: 18,
    marginTop: 4,
  },
  currentLabelContainer: {
    position: 'absolute',
    marginLeft: -18,
  },
  currentLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: PRIMARY_COLOR,
  },
  // 弹窗
  modalKeyboardView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: 280,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    textAlign: 'center',
  },
  modalUnit: {
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  modalSaveButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: PRIMARY_COLOR,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default WeightStatusCard;