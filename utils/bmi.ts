// utils/bmi.ts

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function getBMILevel(bmi: number): { label: string; color: string; bgColor: string } {
  if (bmi < 18.5) {
    return { label: '偏瘦', color: '#3B82F6', bgColor: '#EFF6FF' };
  }
  if (bmi < 24) {
    return { label: '正常', color: '#10B981', bgColor: '#ECFDF5' };
  }
  if (bmi < 28) {
    return { label: '偏胖', color: '#F59E0B', bgColor: '#FFFBEB' };
  }
  return { label: '肥胖', color: '#EF4444', bgColor: '#FEF2F2' };
}
