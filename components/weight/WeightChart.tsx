// components/weight/WeightChart.tsx

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Dimensions,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Svg,
  Line,
  Circle,
  Polyline,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  G,
  Polygon,
} from 'react-native-svg';
import dayjs from 'dayjs';
import { Colors } from '@/constants/Colors';
import { ChartDataPoint } from '@/types/weight';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CHART_HEIGHT = 220;
const CHART_PADDING_LEFT = 36;
const CHART_PADDING_RIGHT = 36;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 30;
const CHART_DRAW_HEIGHT = 150;

const TARGET_LINE_COLOR = '#F97316';
const TOOLTIP_BG_COLOR = '#1E293B';

interface WeightChartProps {
  chartData: ChartDataPoint[];
  targetWeight: number;
  range: 'week' | 'month' | 'year';
  onRangeChange: (range: 'week' | 'month' | 'year') => void;
}

function WeightChart({
  chartData,
  targetWeight,
  range,
  onRangeChange,
}: WeightChartProps) {
  const [componentWidth, setComponentWidth] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const chartWidth = useMemo(() => {
    return Math.max(0, componentWidth - CHART_PADDING_LEFT - CHART_PADDING_RIGHT);
  }, [componentWidth]);

  const { yAxisMin, yAxisMax, yAxisStep } = useMemo(() => {
    if (chartData.length === 0) {
      return { yAxisMin: 60, yAxisMax: 80, yAxisStep: 5 };
    }
    const weights = chartData.map((d) => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const yAxisMin = Math.floor(min - 2);
    const yAxisMax = Math.ceil(max + 2);
    const yAxisStep = (yAxisMax - yAxisMin) / 4;
    return { yAxisMin, yAxisMax, yAxisStep };
  }, [chartData]);

  const yValueToY = useCallback(
    (value: number) => {
      const range = yAxisMax - yAxisMin;
      const normalized = (value - yAxisMin) / range;
      return CHART_PADDING_TOP + CHART_DRAW_HEIGHT - normalized * CHART_DRAW_HEIGHT;
    },
    [yAxisMin, yAxisMax]
  );

  const xIndexToX = useCallback(
    (index: number, totalPoints: number) => {
      if (totalPoints <= 1) return CHART_PADDING_LEFT + chartWidth / 2;
      return CHART_PADDING_LEFT + (index / (totalPoints - 1)) * chartWidth;
    },
    [chartWidth]
  );

  const xAxisLabels = useMemo(() => {
    if (range === 'week') {
      return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    }
    if (range === 'month') {
      return ['1日', '7日', '14日', '21日', '28日'];
    }
    return ['1月', '3月', '5月', '7月', '9月', '11月'];
  }, [range]);

  const xAxisLabelPositions = useMemo(() => {
    const positions: { x: number; label: string }[] = [];
    const labelCount = xAxisLabels.length;
    for (let i = 0; i < labelCount; i++) {
      let x: number;
      if (labelCount <= 1) {
        x = CHART_PADDING_LEFT + chartWidth / 2;
      } else {
        x = CHART_PADDING_LEFT + (i / (labelCount - 1)) * chartWidth;
      }
      positions.push({ x, label: xAxisLabels[i] });
    }
    return positions;
  }, [xAxisLabels, chartWidth]);

  const chartSegments = useMemo(() => {
    if (chartData.length === 0) return [];

    const totalPoints = chartData.length;

    const segments: {
      points: { point: ChartDataPoint; globalIndex: number }[];
      coordinates: { x: number; y: number }[];
    }[] = [];

    let currentSegment: { point: ChartDataPoint; globalIndex: number }[] = [
      { point: chartData[0], globalIndex: 0 },
    ];

    for (let i = 1; i < chartData.length; i++) {
      const prevDate = dayjs(chartData[i - 1].date);
      const currDate = dayjs(chartData[i].date);
      const dayDiff = currDate.diff(prevDate, 'day');

      if (dayDiff > 1) {
        if (currentSegment.length > 0) {
          const coordinates = currentSegment.map((item) => ({
            x: xIndexToX(item.globalIndex, totalPoints),
            y: yValueToY(item.point.weight),
          }));
          segments.push({ points: currentSegment, coordinates });
        }
        currentSegment = [{ point: chartData[i], globalIndex: i }];
      } else {
        currentSegment.push({ point: chartData[i], globalIndex: i });
      }
    }

    if (currentSegment.length > 0) {
      const coordinates = currentSegment.map((item) => ({
        x: xIndexToX(item.globalIndex, totalPoints),
        y: yValueToY(item.point.weight),
      }));
      segments.push({ points: currentSegment, coordinates });
    }

    return segments;
  }, [chartData, xIndexToX, yValueToY]);

  const allDataPoints = useMemo(() => {
    return chartData.map((point, index) => ({
      ...point,
      index,
    }));
  }, [chartData]);

  const handleRangeChange = useCallback(
    (newRange: 'week' | 'month' | 'year') => {
      if (newRange !== range) {
        onRangeChange(newRange);
      }
    },
    [range, onRangeChange]
  );

  const handleTouchStart = useCallback(
    (event: NativeSyntheticEvent<NativeTouchEvent>) => {
      const { locationX } = event.nativeEvent;
      const touchX = locationX - CHART_PADDING_LEFT;

      if (touchX < 0 || touchX > chartWidth || allDataPoints.length === 0) {
        return;
      }

      let closestIndex = 0;
      let minDistance = Infinity;
      const totalPoints = allDataPoints.length;

      for (let i = 0; i < totalPoints; i++) {
        const pointX = xIndexToX(i, totalPoints) - CHART_PADDING_LEFT;
        const distance = Math.abs(pointX - touchX);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      setSelectedIndex(closestIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [allDataPoints, chartSegments, chartWidth, xIndexToX]
  );

  const handleTouchMove = useCallback(
    (event: NativeSyntheticEvent<NativeTouchEvent>) => {
      handleTouchStart(event);
    },
    [handleTouchStart]
  );

  const handleTouchEnd = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const getPointCoordinates = useCallback(
    (point: ChartDataPoint, globalIndex: number) => {
      const totalPoints = chartData.length;
      return {
        x: xIndexToX(globalIndex, totalPoints),
        y: yValueToY(point.weight),
      };
    },
    [chartData.length, xIndexToX, yValueToY]
  );

  const getPrevDayWeight = useCallback(
    (currentPoint: ChartDataPoint) => {
      const currentDate = dayjs(currentPoint.date);
      const prevDate = currentDate.subtract(1, 'day');
      const prevPoint = chartData.find((p) => dayjs(p.date).isSame(prevDate, 'day'));
      return prevPoint ? prevPoint.weight : null;
    },
    [chartData]
  );

  const selectedPoint = useMemo(() => {
    if (selectedIndex === null || allDataPoints.length === 0) return null;
    return allDataPoints[selectedIndex];
  }, [selectedIndex, allDataPoints]);

  const selectedCoordinates = useMemo(() => {
    if (!selectedPoint) return null;
    return getPointCoordinates(selectedPoint, selectedIndex ?? 0);
  }, [selectedPoint, selectedIndex, getPointCoordinates]);

  const prevDayWeight = useMemo(() => {
    if (!selectedPoint) return null;
    return getPrevDayWeight(selectedPoint);
  }, [selectedPoint, getPrevDayWeight]);

  const weightChange = useMemo(() => {
    if (prevDayWeight === null || !selectedPoint) return null;
    const change = selectedPoint.weight - prevDayWeight;
    return change;
  }, [prevDayWeight, selectedPoint]);

  const tooltipWidth = 100;
  const headerHeight = 50;
  const tooltipStyle = useMemo(() => {
    if (!selectedCoordinates || componentWidth === 0) return {};
    let tooltipX = selectedCoordinates.x - tooltipWidth / 2;
    const tooltipY = Math.max(headerHeight + 10, selectedCoordinates.y + headerHeight - 50);
    if (tooltipX < 4) {
      tooltipX = 4;
    } else if (tooltipX + tooltipWidth > componentWidth - 4) {
      tooltipX = componentWidth - tooltipWidth - 4;
    }
    return {
      left: tooltipX,
      top: tooltipY,
    };
  }, [selectedCoordinates, componentWidth]);

  const showTargetLine = useMemo(() => {
    return targetWeight > 0 && targetWeight >= yAxisMin && targetWeight <= yAxisMax;
  }, [targetWeight, yAxisMin, yAxisMax]);

  const targetLineY = useMemo(() => {
    return yValueToY(targetWeight);
  }, [targetWeight, yValueToY]);

  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(600)}
      style={styles.card}
      onLayout={(e) => {
        const width = e.nativeEvent.layout.width;
        setComponentWidth(width);
      }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>体重趋势</Text>
        <View style={styles.rangeButtons}>
          <Pressable
            style={[styles.rangeButton, range === 'week' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('week')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === 'week' ? styles.rangeButtonTextActive : styles.rangeButtonTextInactive,
              ]}
            >
              周
            </Text>
          </Pressable>
          <Pressable
            style={[styles.rangeButton, range === 'month' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('month')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === 'month' ? styles.rangeButtonTextActive : styles.rangeButtonTextInactive,
              ]}
            >
              月
            </Text>
          </Pressable>
          <Pressable
            style={[styles.rangeButton, range === 'year' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('year')}
          >
            <Text
              style={[
                styles.rangeButtonText,
                range === 'year' ? styles.rangeButtonTextActive : styles.rangeButtonTextInactive,
              ]}
            >
              年
            </Text>
          </Pressable>
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(300)} key={range} style={styles.chartContainer}>
        {chartData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>暂无数据</Text>
          </View>
        ) : (
          <Pressable
            style={styles.chartPressable}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <AnimatedSvg width={componentWidth} height={CHART_HEIGHT}>
              <Defs>
                <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={Colors.light.primary} stopOpacity={0.15} />
                  <Stop offset="100%" stopColor={Colors.light.primary} stopOpacity={0.01} />
                </LinearGradient>
              </Defs>

              {Array.from({ length: 5 }).map((_, i) => {
                const value = yAxisMax - i * yAxisStep;
                const y = yValueToY(value);
                return (
                  <React.Fragment key={`grid-${i}`}>
                    <Line
                      x1={CHART_PADDING_LEFT}
                      y1={y}
                      x2={CHART_PADDING_LEFT + chartWidth}
                      y2={y}
                      stroke={Colors.light.borderLight}
                      strokeWidth={1}
                      strokeDasharray="4,4"
                    />
                    <SvgText
                      x={CHART_PADDING_LEFT - 8}
                      y={y + 3}
                      fontSize={10}
                      fill={Colors.light.textTertiary}
                      textAnchor="end"
                    >
                      {value.toFixed(1)}
                    </SvgText>
                  </React.Fragment>
                );
              })}

              {chartSegments.map((segment, segIndex) => (
                <React.Fragment key={`segment-${segIndex}`}>
                  <Polyline
                    points={segment.coordinates.map((c) => `${c.x},${c.y}`).join(' ')}
                    stroke={Colors.light.primary}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <Polygon
                    points={[
                      ...segment.coordinates.map((c) => `${c.x},${c.y}`),
                      `${segment.coordinates[segment.coordinates.length - 1].x},${CHART_PADDING_TOP + CHART_DRAW_HEIGHT}`,
                      `${segment.coordinates[0].x},${CHART_PADDING_TOP + CHART_DRAW_HEIGHT}`,
                    ].join(' ')}
                    fill="url(#chartGradient)"
                    stroke="none"
                  />
                </React.Fragment>
              ))}

              {showTargetLine && (
                <>
                  <Line
                    x1={CHART_PADDING_LEFT}
                    y1={targetLineY}
                    x2={CHART_PADDING_LEFT + chartWidth}
                    y2={targetLineY}
                    stroke={TARGET_LINE_COLOR}
                    strokeWidth={1.5}
                    strokeDasharray="6,4"
                  />
                  <SvgText
                    x={CHART_PADDING_LEFT + chartWidth + 5}
                    y={targetLineY + 3}
                    fontSize={10}
                    fill={TARGET_LINE_COLOR}
                  >
                    目标
                  </SvgText>
                </>
              )}

              {allDataPoints.map((point, idx) => {
                const coords = getPointCoordinates(point, idx);
                const isSelected = idx === selectedIndex;
                return (
                  <Circle
                    key={`point-${idx}`}
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 6 : 4}
                    fill={Colors.light.primary}
                    stroke={Colors.light.card}
                    strokeWidth={2}
                  />
                );
              })}

              {selectedIndex !== null && selectedCoordinates && (
                <Line
                  x1={selectedCoordinates.x}
                  y1={CHART_PADDING_TOP}
                  x2={selectedCoordinates.x}
                  y2={CHART_PADDING_TOP + CHART_DRAW_HEIGHT}
                  stroke={Colors.light.textTertiary}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              )}
              {xAxisLabelPositions.map((item, index) => {
                let anchor: 'start' | 'middle' | 'end' = 'middle';
                if (index === 0) anchor = 'start';
                if (index === xAxisLabelPositions.length - 1) anchor = 'end';
                return (
                  <SvgText
                    key={`x-label-${index}`}
                    x={item.x}
                    y={CHART_PADDING_TOP + CHART_DRAW_HEIGHT + 18}
                    fontSize={10}
                    fill={Colors.light.textTertiary}
                    textAnchor={anchor}
                  >
                    {item.label}
                  </SvgText>
                );
              })}
            </AnimatedSvg>

          </Pressable>
        )}
      </Animated.View>

      {selectedIndex !== null && selectedPoint && selectedCoordinates && (
        <View style={[styles.tooltip, tooltipStyle]}>
          <Text style={styles.tooltipDate}>
            {dayjs(selectedPoint.date).format('M/D')}
          </Text>
          <Text style={styles.tooltipWeight}>{selectedPoint.weight.toFixed(1)} kg</Text>
          {weightChange !== null && (
            <Text
              style={[
                styles.tooltipChange,
                weightChange > 0 ? styles.tooltipChangeUp : styles.tooltipChangeDown,
              ]}
            >
              {weightChange > 0 ? '+' : ''}
              {weightChange.toFixed(1)} kg
            </Text>
          )}
        </View>
      )}
    </Animated.View>
  );
}

export default React.memo(WeightChart);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  rangeButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.light.borderLight,
    borderRadius: 20,
    padding: 4,
  },
  rangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  rangeButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  rangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rangeButtonTextActive: {
    color: '#FFFFFF',
  },
  rangeButtonTextInactive: {
    color: Colors.light.textTertiary,
  },
  chartContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  chartPressable: {
    height: CHART_HEIGHT,
    overflow: 'hidden',
  },
  emptyState: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.textTertiary,
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: TOOLTIP_BG_COLOR,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 100,
    zIndex: 10,
  },
  tooltipDate: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
  tooltipWeight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tooltipChange: {
    fontSize: 11,
    fontWeight: '500',
  },
  tooltipChangeUp: {
    color: Colors.light.error,
  },
  tooltipChangeDown: {
    color: Colors.light.success,
  },
});
