// components/weight/WeightWelcomeCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  FadeInLeft, 
  FadeInRight, 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/Colors';

const PRIMARY_COLOR = '#4F46E5';

interface WeightWelcomeCardProps {
  onStartSetup: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function WeightWelcomeCard({ onStartSetup }: WeightWelcomeCardProps) {
  const buttonScale = useSharedValue(1);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleStartPress = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStartSetup();
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(600).springify().damping(14)}
    >
      {/* 插图区 */}
      <Animated.View 
        style={styles.illustrationContainer}
        entering={FadeIn.delay(200).duration(400)}
      >
        <Animated.Text 
          style={styles.mainEmoji}
          entering={FadeIn.delay(200).duration(400)}
        >
          ⚖️
        </Animated.Text>
        <Animated.Text 
          style={styles.decorEmojis}
          entering={FadeIn.delay(300).duration(400)}
        >
          📊💪🎯
        </Animated.Text>
      </Animated.View>

      {/* 标题 */}
      <Animated.Text 
        style={styles.title}
        entering={FadeIn.delay(300).duration(400)}
      >
        开启你的健康之旅
      </Animated.Text>

      {/* 副标题 */}
      <Animated.Text 
        style={styles.subtitle}
        entering={FadeIn.delay(400).duration(400)}
      >
        记录每一次变化，看见每一步的进步
      </Animated.Text>

      {/* 步骤卡片 */}
      <View style={styles.stepsContainer}>
        <Animated.View 
          style={styles.stepCard}
          entering={FadeInLeft.delay(500).duration(400).springify()}
        >
          <View style={[styles.stepNumber, styles.stepNumberActive]}>
            <Text style={styles.stepNumberTextActive}>1</Text>
          </View>
          <Text style={styles.stepTitle}>设置信息</Text>
          <Text style={styles.stepDesc}>身高和目标</Text>
        </Animated.View>

        <Animated.View 
          style={styles.stepCard}
          entering={FadeInRight.delay(600).duration(400).springify()}
        >
          <View style={[styles.stepNumber, styles.stepNumberInactive]}>
            <Text style={styles.stepNumberTextInactive}>2</Text>
          </View>
          <Text style={styles.stepTitle}>记录体重</Text>
          <Text style={styles.stepDesc}>开始追踪</Text>
        </Animated.View>
      </View>

      {/* 主按钮 */}
      <AnimatedPressable
        style={[styles.primaryButton, buttonAnimStyle]}
        onPress={handleStartPress}
        entering={FadeInUp.delay(700).duration(400).springify()}
      >
        <Text style={styles.primaryButtonText}>开始设置 →</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 1,
    elevation: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  decorEmojis: {
    fontSize: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  stepNumberInactive: {
    backgroundColor: '#E2E8F0',
  },
  stepNumberTextActive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepNumberTextInactive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  primaryButton: {
    height: 52,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
