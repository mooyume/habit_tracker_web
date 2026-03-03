// components/weight/WeightFAB.tsx

import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface WeightFABProps {
  onPress: () => void;
  isEmpty?: boolean;
}

const WeightFAB = React.memo<WeightFABProps>(({ onPress, isEmpty = false }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.9, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View
      style={[styles.container, isEmpty && styles.containerEmpty]}
      entering={FadeInUp.delay(400).duration(500).springify()}
    >
      <AnimatedPressable
        style={[styles.button, animatedStyle]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Ionicons name="add" size={20} color={Colors.light.card} />
        <Text style={styles.buttonText}>记录</Text>
      </AnimatedPressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 24,
  },
  containerEmpty: {
    opacity: 0.5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: Colors.light.card,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
});

WeightFAB.displayName = 'WeightFAB';

export default WeightFAB;
