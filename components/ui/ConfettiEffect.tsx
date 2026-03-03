// components/ui/ConfettiEffect.tsx

import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Dimensions, Animated, Easing, View } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#EF4444', '#F97316', '#EAB308',
  '#22C55E', '#3B82F6', '#A855F7',
  '#EC4899', '#06B6D4',
];

const CONFETTI_COUNT = 30;

interface ConfettiPiece {
  id: number;
  color: string;
  startX: number;
  endX: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

function generatePieces(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
    id: i,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    startX: Math.random() * SCREEN_WIDTH,
    endX: (Math.random() - 0.5) * 100,
    size: 6 + Math.random() * 6,
    delay: Math.random() * 300,
    duration: 1500 + Math.random() * 1000,
    rotation: Math.random() * 720,
  }));
}

interface ConfettiPieceComponentProps {
  piece: ConfettiPiece;
}

function ConfettiPieceComponent({ piece }: ConfettiPieceComponentProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(piece.delay),
      Animated.timing(animValue, {
        toValue: 1,
        duration: piece.duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animValue, piece.delay, piece.duration]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, SCREEN_HEIGHT + 50],
  });

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, piece.endX],
  });

  const rotate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${piece.rotation}deg`],
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  return (
      <Animated.View
          style={[
            styles.piece,
            {
              left: piece.startX,
              width: piece.size,
              height: piece.size * 1.5,
              backgroundColor: piece.color,
              borderRadius: piece.size * 0.2,
              transform: [
                { translateY },
                { translateX },
                { rotate },
              ],
              opacity,
            },
          ]}
      />
  );
}

interface ConfettiEffectProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ visible, onComplete }: ConfettiEffectProps) {
  const pieces = useMemo(() => generatePieces(), [visible]);

  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
      <View style={styles.container} pointerEvents="none">
        {pieces.map((piece) => (
            <ConfettiPieceComponent key={piece.id} piece={piece} />
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});