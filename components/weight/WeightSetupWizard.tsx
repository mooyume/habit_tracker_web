// components/weight/WeightSetupWizard.tsx

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
  SlideInLeft,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';

const PRIMARY_COLOR = '#4F46E5';
const QUICK_TAGS = ['早起', '空腹', '运动后', '晚间', '餐后'];

interface WeightSetupWizardProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (height: number, targetWeight: number, currentWeight: number, note?: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WeightSetupWizard({ visible, onClose, onComplete }: WeightSetupWizardProps) {
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [height, setHeight] = useState(170);
  const [targetWeight, setTargetWeight] = useState(65.0);
  const [currentWeight, setCurrentWeight] = useState(70.0);
  const [note, setNote] = useState('');

  const handleNext = () => {
    if (step < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDirection('forward');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDirection('backward');
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete(height, targetWeight, currentWeight, note || undefined);
    onClose();
    // 重置状态
    setTimeout(() => {
      setStep(1);
      setHeight(170);
      setTargetWeight(65.0);
      setCurrentWeight(70.0);
      setNote('');
    }, 300);
  };

  const handleTagPress = (tag: string) => {
    setNote(note === tag ? '' : tag);
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Pressable style={styles.mask} onPress={onClose}>
          <Animated.View entering={FadeIn.duration(200)} style={StyleSheet.absoluteFill} />
        </Pressable>

        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(250)}
          style={[
            styles.sheet,
            { height: windowHeight * 0.6, marginBottom: insets.bottom },
          ]}
        >
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheetContent}>
            <View style={styles.dragHandle} />

            {/* 进度指示器 */}
            <View style={styles.progressContainer}>
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <View style={[styles.progressDot, i <= step && styles.progressDotActive]} />
                  {i < 3 && <View style={[styles.progressLine, i < step && styles.progressLineActive]} />}
                </React.Fragment>
              ))}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              {/* 步骤1：身高 */}
              {step === 1 && (
                <Animated.View
                  key="step1"
                  entering={direction === 'forward' ? SlideInRight.duration(300).springify() : SlideInLeft.duration(300).springify()}
                  exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
                  style={styles.stepContainer}
                >
                  <Text style={styles.stepTitle}>设置身高</Text>
                  <Text style={styles.stepDesc}>用于计算 BMI 指数</Text>

                  <View style={styles.inputRow}>
                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setHeight(Math.max(100, height - 1))}
                    >
                      <Ionicons name="remove" size={24} color={Colors.light.textSecondary} />
                    </Pressable>

                    <View style={styles.valueContainer}>
                      <Text style={styles.valueText}>{height}</Text>
                      <Text style={styles.unitText}>cm</Text>
                    </View>

                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setHeight(Math.min(250, height + 1))}
                    >
                      <Ionicons name="add" size={24} color={Colors.light.textSecondary} />
                    </Pressable>
                  </View>
                </Animated.View>
              )}

              {/* 步骤2：当前体重 */}
              {step === 2 && (
                <Animated.View
                  key="step2"
                  entering={direction === 'forward' ? SlideInRight.duration(300).springify() : SlideInLeft.duration(300).springify()}
                  exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
                  style={styles.stepContainer}
                >
                  <Text style={styles.stepTitle}>记录当前体重</Text>
                  <Text style={styles.stepDesc}>今天的体重是多少？</Text>

                  <View style={styles.inputRow}>
                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setCurrentWeight(Math.round(Math.max(30.0, currentWeight - 0.1) * 10) / 10)}
                    >
                      <Ionicons name="remove" size={24} color={Colors.light.textSecondary} />
                    </Pressable>

                    <View style={styles.valueContainer}>
                      <Text style={styles.valueText}>{currentWeight.toFixed(1)}</Text>
                      <Text style={styles.unitText}>kg</Text>
                    </View>

                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setCurrentWeight(Math.round(Math.min(200.0, currentWeight + 0.1) * 10) / 10)}
                    >
                      <Ionicons name="add" size={24} color={Colors.light.textSecondary} />
                    </Pressable>
                  </View>

                  {/* 快捷标签 */}
                  <View style={styles.tagsContainer}>
                    <Text style={styles.tagsLabel}>快捷标签（可选）</Text>
                    <View style={styles.tagsRow}>
                      {QUICK_TAGS.map((tag) => (
                        <Pressable
                          key={tag}
                          style={[styles.tag, note === tag && styles.tagActive]}
                          onPress={() => handleTagPress(tag)}
                        >
                          <Text style={[styles.tagText, note === tag && styles.tagTextActive]}>
                            {tag}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </Animated.View>
              )}

              {/* 步骤3：目标体重 */}
              {step === 3 && (
                <Animated.View
                  key="step3"
                  entering={direction === 'forward' ? SlideInRight.duration(300).springify() : SlideInLeft.duration(300).springify()}
                  exiting={direction === 'forward' ? SlideOutLeft.duration(200) : SlideOutRight.duration(200)}
                  style={styles.stepContainer}
                >
                  <Text style={styles.stepTitle}>设置目标体重</Text>
                  <Text style={styles.stepDesc}>你想达到的理想体重</Text>

                  <View style={styles.inputRow}>
                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setTargetWeight(Math.round(Math.max(30.0, targetWeight - 0.1) * 10) / 10)}
                    >
                      <Ionicons name="remove" size={24} color={Colors.light.textSecondary} />
                    </Pressable>

                    <View style={styles.valueContainer}>
                      <Text style={styles.valueText}>{targetWeight.toFixed(1)}</Text>
                      <Text style={styles.unitText}>kg</Text>
                    </View>

                    <Pressable
                      style={styles.adjustButton}
                      onPress={() => setTargetWeight(Math.round(Math.min(200.0, targetWeight + 0.1) * 10) / 10)}
                    >
                      <Ionicons name="add" size={24} color={Colors.light.textSecondary} />
                    </Pressable>
                  </View>
                </Animated.View>
              )}
            </ScrollView>

            {/* 底部按钮 */}
            <View style={styles.footer}>
              {step > 1 && (
                <Pressable style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>上一步</Text>
                </Pressable>
              )}

              <Pressable
                style={[styles.nextButton, step === 1 && styles.nextButtonFull]}
                onPress={step === 3 ? handleComplete : handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {step === 3 ? '完成' : '下一步'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E2E8F0',
  },
  progressDotActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  progressLineActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  adjustButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 120,
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  unitText: {
    fontSize: 20,
    color: Colors.light.textTertiary,
    marginLeft: 8,
  },
  tagsContainer: {
    marginTop: 40,
  },
  tagsLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagActive: {
    backgroundColor: '#EEF2FF',
    borderColor: PRIMARY_COLOR,
  },
  tagText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  tagTextActive: {
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  nextButton: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
