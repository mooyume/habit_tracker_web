// components/weight/WeightHistory.tsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { WeightRecord } from '@/types/weight';
import { Colors } from '@/constants/Colors';
import WeightHistoryItem from './WeightHistoryItem';

interface WeightHistoryProps {
  records: WeightRecord[];
  onDelete: (id: string) => void;
  showAll: boolean;
  onToggleShowAll: () => void;
}

const WeightHistory = React.memo<WeightHistoryProps>(({
  records,
  onDelete,
  showAll,
  onToggleShowAll,
}) => {
  const displayRecords = showAll ? records : records.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>历史记录</Text>
        <Pressable onPress={onToggleShowAll}>
          <Text style={styles.toggleText}>
            {showAll ? "收起" : "查看全部 >"}
          </Text>
        </Pressable>
      </View>
      <View style={styles.listContainer}>
        {records.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无记录</Text>
          </View>
        ) : (
          displayRecords.map((record, index) => {
            const previousRecord = displayRecords[index + 1];
            return (
              <WeightHistoryItem
                key={record.id}
                record={record}
                previousRecord={previousRecord}
                index={index}
                onDelete={onDelete}
              />
            );
          })
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    color: Colors.light.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: Colors.light.primary,
    fontSize: 14,
  },
  listContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.light.textTertiary,
    fontSize: 14,
  },
});

WeightHistory.displayName = 'WeightHistory';

export default WeightHistory;
