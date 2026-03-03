// app/onboarding.tsx

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';
import { useWeightStore } from '@/stores/useWeightStore';
import WeightWelcomeCard from '@/components/weight/WeightWelcomeCard';
import WeightSetupWizard from '@/components/weight/WeightSetupWizard';
import ConfettiEffect from '@/components/ui/ConfettiEffect';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [wizardVisible, setWizardVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStartSetup = () => {
    setWizardVisible(true);
  };

  const handleWizardClose = () => {
    setWizardVisible(false);
  };

  const handleSetupComplete = (height: number, targetWeight: number, currentWeight: number, note?: string) => {
    const store = useWeightStore.getState();
    const today = dayjs().format('YYYY-MM-DD');
    
    store.setGoal({ ...store.goal, height, targetWeight, startWeight: currentWeight, startDate: today });
    store.addRecord(currentWeight, today, note);
    
    setShowConfetti(true);
    
    // 延迟跳转，让用户看到庆祝动画
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <WeightWelcomeCard onStartSetup={handleStartSetup} />
      </ScrollView>

      <WeightSetupWizard
        visible={wizardVisible}
        onClose={handleWizardClose}
        onComplete={handleSetupComplete}
      />

      <ConfettiEffect
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
});
