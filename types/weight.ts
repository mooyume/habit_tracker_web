// types/weight.ts

export interface WeightRecord {
  id: string;
  date: string;           // "2024-12-17"
  weight: number;         // 72.5
  note?: string;          // "早起空腹"
  createdAt: string;      // ISO 时间戳
}

export interface WeightGoal {
  targetWeight: number;   // 目标体重 kg
  height: number;         // 身高 cm（用于BMI计算）
  startWeight: number;    // 开始时体重
  startDate: string;      // 开始日期
}

export interface WeightStats {
  current: number;
  previous: number;
  change: number;         // 与前一天对比
  weekChange: number;     // 本周变化
  monthChange: number;    // 本月变化
  highest: number;
  lowest: number;
  average: number;
  totalDays: number;      // 已记录天数
  bmi: number;
}

export interface ChartDataPoint {
  date: string;
  weight: number;
}
