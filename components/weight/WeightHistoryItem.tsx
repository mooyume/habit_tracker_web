// components/weight/WeightHistoryItem.tsx

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import dayjs from 'dayjs';
import type { WeightRecord } from '@/types/weight';
import { Colors } from '@/constants/Colors';

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

interface WeightHistoryItemProps {
  record: WeightRecord;
  previousRecord?: WeightRecord;
  index: number;
  onDelete: (id: string) => void;
}

const WeightHistoryItem = React.memo<WeightHistoryItemProps>(({
  record,
  previousRecord,
  index,
  onDelete,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const change = previousRecord
    ? Math.round((record.weight - previousRecord.weight) * 10) / 10
    : null;

  const handleDelete = () => {
    Alert.alert(
      "确认删除",
      "确定要删除这条记录吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "删除",
          style: "destructive",
          onPress: () => onDelete(record.id)
        }
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.actionButtonText}>删除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const dotColor = change !== null && change < 0
    ? Colors.light.success
    : change !== null && change > 0
    ? Colors.light.error
    : Colors.light.textTertiary;

  const renderChangeText = () => {
    if (change === null) return null;
    if (change < 0) {
      return (
        <Text style={[styles.changeText, styles.decreaseText]}>
          ↓{Math.abs(change)}
        </Text>
      );
    }
    if (change > 0) {
      return (
        <Text style={[styles.changeText, styles.increaseText]}>
          ↑{Math.abs(change)}
        </Text>
      );
    }
    return (
      <Text style={[styles.changeText, styles.neutralText]}>
        →0.0
      </Text>
    );
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 50).duration(300)}>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
      >
        <View style={styles.container}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <View style={styles.middleContent}>
            <Text style={styles.dateText}>
              {dayjs(record.date).format('M月D日')} {WEEKDAYS[dayjs(record.date).day()]}
            </Text>
            <Text style={styles.weightText}>{record.weight} kg</Text>
          </View>
          <View style={styles.rightContent}>
            {renderChangeText()}
            {record.note && (
              <Text style={styles.noteText}>{record.note}</Text>
            )}
          </View>
        </View>
        <View style={styles.separator} />
      </Swipeable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  rightActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    backgroundColor: Colors.light.error,
  },
  actionButtonText: {
    color: Colors.light.card,
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.card,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  middleContent: {
    flex: 1,
    marginLeft: 12,
  },
  dateText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  weightText: {
    color: Colors.light.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  decreaseText: {
    color: Colors.light.success,
  },
  increaseText: {
    color: Colors.light.error,
  },
  neutralText: {
    color: Colors.light.textTertiary,
  },
  noteText: {
    color: Colors.light.textTertiary,
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.light.borderLight,
    marginLeft: 36,
  },
});

WeightHistoryItem.displayName = 'WeightHistoryItem';

export default WeightHistoryItem;
