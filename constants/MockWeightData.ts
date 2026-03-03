// constants/MockWeightData.ts

import { WeightRecord, WeightGoal } from '@/types/weight';
import dayjs from 'dayjs';

const NOTES = ['早起空腹', '运动后', '晚间', '餐后', '早起'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateMockWeightRecords(): WeightRecord[] {
  // 临时返回空数组，用于测试空状态页面
  return [];
  
  // 原始生成逻辑已注释，测试完成后可恢复
  // const records: WeightRecord[] = [];
  // const today = dayjs();
  // const totalDays = 30;
  // const startWeight = 74.0;
  // const endWeight = 72.5;
  // const weightDrop = (startWeight - endWeight) / totalDays;

  // for (let i = totalDays; i >= 0; i--) {
  //   const seed = i * 137 + 42;
  //   const rand = seededRandom(seed);

  //   // 约 10% 的天数缺失
  //   if (rand < 0.1 && i !== 0 && i !== totalDays) {
  //     continue;
  //   }

  //   const date = today.subtract(i, 'day');
  //   const dateStr = date.format('YYYY-MM-DD');

  //   // 基准体重：线性下降 + 随机波动
  //   const baseWeight = startWeight - weightDrop * (totalDays - i);
  //   const fluctuation = (seededRandom(seed + 1) - 0.5) * 0.6; // ±0.3
  //   const weight = Math.round((baseWeight + fluctuation) * 10) / 10;

  //   // 约 20% 带备注
  //   const hasNote = seededRandom(seed + 2) < 0.2;
  //   const noteIndex = Math.floor(seededRandom(seed + 3) * NOTES.length);

  //   records.push({
  //     id: `weight-${dateStr}`,
  //     date: dateStr,
  //     weight: Math.max(71.5, Math.min(74.0, weight)),
  //     note: hasNote ? NOTES[noteIndex] : undefined,
  //     createdAt: date.hour(7).minute(30).toISOString(),
  //   });
  // }

  // return records;
}

export function generateMockWeightGoal(): WeightGoal {
  const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  return {
    targetWeight: 0,  // 临时设置为 0，用于测试完全空数据状态
    height: 175,
    startWeight: 74.0,
    startDate,
  };
}
