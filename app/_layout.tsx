// app/_layout.tsx

import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useWeightStore } from '@/stores/useWeightStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  const records = useWeightStore((state) => state.records);
  const goal = useWeightStore((state) => state.goal);

  // 判断是否首次使用
  const isFirstTime = records.length === 0 && goal.targetWeight === 0;

  useEffect(() => {
    // 等待 store 初始化完成
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (isFirstTime && inAuthGroup) {
      // 首次使用，跳转到引导页
      router.replace('/onboarding');
    } else if (!isFirstTime && segments[0] === 'onboarding') {
      // 已完成设置，跳转到主页
      router.replace('/(tabs)');
    }
  }, [isFirstTime, segments, isReady]);

  return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
          >
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="create"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
            />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
