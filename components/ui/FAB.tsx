// components/ui/FAB.tsx

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FAB() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    // 按下弹跳 + 旋转动画
    scale.value = withSequence(
        withTiming(0.8, { duration: 80 }),
        withSpring(1, { damping: 10, stiffness: 300 })
    );
    rotation.value = withSequence(
        withTiming(90, { duration: 150 }),
        withSpring(0, { damping: 12 })
    );

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 延迟跳转让动画播完
    setTimeout(() => {
      router.push('/create');
    }, 200);
  };

  return (
      <Animated.View
          entering={FadeInUp.delay(400).duration(500).springify()}
          style={styles.wrapper}
      >
        <AnimatedPressable
            onPress={handlePress}
            style={[styles.fab, animatedStyle]}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </AnimatedPressable>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 20,
    bottom: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
});
