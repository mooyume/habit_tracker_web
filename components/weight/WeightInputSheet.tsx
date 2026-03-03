// components/weight/WeightInputSheet.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideOutDown,
  withTiming,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
  createAnimatedComponent,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { Colors } from "@/constants/Colors";
import { WeightRecord } from "@/types/weight";

const AnimatedPressable = createAnimatedComponent(Pressable);

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const QUICK_TAGS = ["早起", "空腹", "运动后", "晚间", "餐后"];

interface WeightInputSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (weight: number, date: string, note?: string) => void;
  initialWeight: number;
  lastRecord?: WeightRecord;
  editingRecord?: WeightRecord;
}

const WeightInputSheet: React.FC<WeightInputSheetProps> = React.memo(
  ({ visible, onClose, onSave, initialWeight, lastRecord, editingRecord }) => {
    const insets = useSafeAreaInsets();
    const windowHeight = Dimensions.get("window").height;

    const [selectedDate, setSelectedDate] = useState<string>(
      editingRecord ? editingRecord.date : dayjs().format("YYYY-MM-DD")
    );
    const [weight, setWeight] = useState<number>(
      editingRecord ? editingRecord.weight : initialWeight > 0 ? initialWeight : 70.0
    );

    useEffect(() => {
      if (visible) {
        if (editingRecord) {
          setWeight(editingRecord.weight);
          setSelectedDate(editingRecord.date);
          setNote(editingRecord.note || "");
        } else {
          setWeight(initialWeight > 0 ? initialWeight : 70.0);
          setSelectedDate(dayjs().format("YYYY-MM-DD"));
          setNote("");
        }
        setWeightInputText("");
        setIsEditingWeight(false);
      }
    }, [visible]);
    const [weightInputText, setWeightInputText] = useState<string>("");
    const [isEditingWeight, setIsEditingWeight] = useState(false);
    const weightInputRef = useRef<TextInput>(null);
    const [note, setNote] = useState<string>(editingRecord?.note || "");

    const minusScale = useSharedValue(1);
    const plusScale = useSharedValue(1);
    const saveScale = useSharedValue(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const minusAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: minusScale.value }],
    }));

    const plusAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: plusScale.value }],
    }));

    const saveAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: saveScale.value }],
    }));

    const formatDate = (dateStr: string): string => {
      const date = dayjs(dateStr);
      const weekday = WEEKDAYS[date.day()];
      return `📅 ${date.format("YYYY年M月D日")} ${weekday}`;
    };

    const handleWeightChange = (delta: number) => {
      setWeight((prev) => {
        const newWeight = Math.max(20.0, Math.min(300.0, prev + delta));
        return Math.round(newWeight * 10) / 10;
      });
    };

    const startInterval = (delta: number) => {
      clearWeightInterval();
      handleWeightChange(delta);
      intervalRef.current = setInterval(() => {
        handleWeightChange(delta);
      }, 200);
    };

    const clearWeightInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleMinusPressIn = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      minusScale.value = withTiming(0.85, { duration: 80 });
      startInterval(-0.1);
    };

    const handleMinusPressOut = () => {
      minusScale.value = withSpring(1, { damping: 10, stiffness: 300 });
      clearWeightInterval();
    };

    const handlePlusPressIn = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      plusScale.value = withTiming(0.85, { duration: 80 });
      startInterval(0.1);
    };

    const handlePlusPressOut = () => {
      plusScale.value = withSpring(1, { damping: 10, stiffness: 300 });
      clearWeightInterval();
    };

    const handleSavePressIn = () => {
      saveScale.value = withTiming(0.95, { duration: 80 });
    };

    const handleSavePressOut = () => {
      saveScale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const handleWeightTextChange = (text: string) => {
      const filtered = text.replace(/[^0-9.]/g, "");
      const dotCount = (filtered.match(/\./g) || []).length;
      if (dotCount > 1) return;
      const parts = filtered.split(".");
      if (parts[1] && parts[1].length > 1) return;
      setWeightInputText(filtered);
    };

    const handleWeightInputFocus = () => {
      setIsEditingWeight(true);
      setWeightInputText(weight.toFixed(1));
    };

    const handleWeightInputBlur = () => {
      setIsEditingWeight(false);
      const parsed = parseFloat(weightInputText);
      if (!isNaN(parsed) && parsed >= 20.0 && parsed <= 300.0) {
        setWeight(Math.round(parsed * 10) / 10);
      }
      setWeightInputText("");
    };

    const handleSave = () => {
      let finalWeight = weight;
      if (isEditingWeight && weightInputText) {
        const parsed = parseFloat(weightInputText);
        if (!isNaN(parsed) && parsed >= 20.0 && parsed <= 300.0) {
          finalWeight = Math.round(parsed * 10) / 10;
          setWeight(finalWeight);
        }
        setIsEditingWeight(false);
        setWeightInputText("");
      }
      onSave(finalWeight, selectedDate, note || undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    };

    const handleTagPress = (tag: string) => {
      setNote(note === tag ? "" : tag);
    };

    useEffect(() => {
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

    return (
      <Modal visible={visible} transparent animationType="none">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              { minHeight: windowHeight * 0.6, marginBottom: insets.bottom },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheetContent}>
              <View style={styles.dragHandle} />
              <View style={styles.header}>
                <Text style={styles.title}>记录体重</Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close-circle" size={28} color={Colors.light.textTertiary} />
                </Pressable>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              </View>
              <View style={styles.weightInputContainer}>
                <View style={styles.weightRow}>
                  <AnimatedPressable
                    style={[styles.weightButton, minusAnimatedStyle]}
                    onPressIn={handleMinusPressIn}
                    onPressOut={handleMinusPressOut}
                  >
                    <Ionicons name="remove" size={24} color={Colors.light.textSecondary} />
                  </AnimatedPressable>
                  <Pressable onPress={() => weightInputRef.current?.focus()}>
                    <TextInput
                      ref={weightInputRef}
                      style={styles.weightText}
                      keyboardType="decimal-pad"
                      value={isEditingWeight ? weightInputText : weight.toFixed(1)}
                      onChangeText={handleWeightTextChange}
                      onFocus={handleWeightInputFocus}
                      onBlur={handleWeightInputBlur}
                      maxLength={5}
                      returnKeyType="done"
                      onSubmitEditing={() => weightInputRef.current?.blur()}
                    />
                  </Pressable>
                  <AnimatedPressable
                    style={[styles.weightButton, plusAnimatedStyle]}
                    onPressIn={handlePlusPressIn}
                    onPressOut={handlePlusPressOut}
                  >
                    <Ionicons name="add" size={24} color={Colors.light.textSecondary} />
                  </AnimatedPressable>
                </View>
                {lastRecord && (
                  <Text style={styles.lastRecordText}>
                    上次记录 {lastRecord.weight} kg
                  </Text>
                )}
              </View>
              <View style={styles.noteContainer}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="添加备注（可选）"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={note}
                  onChangeText={setNote}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.tagsScrollView}
                >
                  {QUICK_TAGS.map((tag) => (
                    <Pressable
                      key={tag}
                      style={[
                        styles.tag,
                        note === tag
                          ? styles.tagSelected
                          : styles.tagUnselected,
                      ]}
                      onPress={() => handleTagPress(tag)}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          note === tag
                            ? styles.tagTextSelected
                            : styles.tagTextUnselected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <AnimatedPressable
                style={[styles.saveButton, saveAnimatedStyle, { marginBottom: insets.bottom + 16 }]}
                onPressIn={handleSavePressIn}
                onPressOut={handleSavePressOut}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>保存记录 ✓</Text>
              </AnimatedPressable>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.light.borderLight,
    borderRadius: 2,
    marginTop: 12,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  dateContainer: {
    backgroundColor: Colors.light.borderLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  weightInputContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  weightButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.borderLight,
    justifyContent: "center",
    alignItems: "center",
  },
  weightText: {
    fontSize: 48,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
    color: Colors.light.textPrimary,
    marginHorizontal: 32,
  },
  lastRecordText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
    marginTop: 8,
  },
  noteContainer: {
    marginTop: 16,
  },
  noteInput: {
    backgroundColor: Colors.light.borderLight,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    fontSize: 14,
    color: Colors.light.textPrimary,
  },
  tagsScrollView: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagSelected: {
    backgroundColor: Colors.light.primaryBg,
  },
  tagUnselected: {
    backgroundColor: Colors.light.borderLight,
  },
  tagText: {
    fontSize: 13,
  },
  tagTextSelected: {
    color: Colors.light.primary,
  },
  tagTextUnselected: {
    color: Colors.light.textSecondary,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default WeightInputSheet;
