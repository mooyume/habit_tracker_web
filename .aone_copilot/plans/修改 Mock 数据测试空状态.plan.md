### 修改 Mock 数据测试空状态 ###
临时修改 MockWeightData.ts 中的 mock 数据为空数组，用于测试体重页面的空状态展示效果

# 修改 Mock 数据测试空状态执行计划

## 一、修改目标

临时将 `constants/MockWeightData.ts` 中的 mock 数据改为空数组，测试体重页面的空状态展示。

## 二、修改步骤

### 2.1 修改 generateMockWeightRecords 函数
**文件**：`constants/MockWeightData.ts`

**修改点**：
将 `generateMockWeightRecords()` 函数直接返回空数组：

```typescript
export function generateMockWeightRecords(): WeightRecord[] {
  return [];
}
```

**说明**：
- 保留函数签名不变
- 注释掉原有的生成逻辑（或直接删除）
- 直接返回空数组 `[]`

### 2.2 验证效果

修改后重新加载应用，应该看到：
1. **WeightStatusCard**：显示 `——`，无变化值，无 BMI，有目标卡片
2. **WeightEmptyState**：显示 ⚖️ + "开始记录体重" + 引导文案
3. **隐藏组件**：WeightChart、WeightStatsRow、WeightHistory 不显示
4. **FAB 按钮**：正常显示，可点击录入

### 2.3 恢复数据（测试完成后）

测试完成后，恢复 `generateMockWeightRecords()` 函数的原始实现，或使用 Git 撤销修改。

## 三、注意事项

1. 这是临时修改，仅用于测试空状态
2. 测试完成后记得恢复原始数据
3. 可以使用 `git checkout constants/MockWeightData.ts` 快速恢复


updateAtTime: 2026/2/14 15:27:06

planId: 

plan_status: review