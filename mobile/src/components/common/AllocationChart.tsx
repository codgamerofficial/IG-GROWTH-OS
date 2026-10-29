// =============================================================================
// RIIQX Asset Allocation & Donut Chart Component
// SVG Donut Visualization • Segmented Distribution Bar • Interactive Legend
// Matches Design Mockups 1, 2, 3 & 5
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { AssetAllocationItem } from '../../services/calculations';
import { useRiiqx } from '../../context/RiiqxContext';
import { lightColors, darkColors } from '../../theme/colors';

interface AllocationChartProps {
  allocation: AssetAllocationItem[];
  totalValue: number;
}

export function AllocationChart({ allocation, totalValue }: AllocationChartProps) {
  const { isDarkMode, formatMoney } = useRiiqx();
  const theme = isDarkMode ? darkColors : lightColors;
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  if (!allocation || allocation.length === 0 || totalValue === 0) {
    return (
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          No asset holdings recorded yet.
        </Text>
      </View>
    );
  }

  // Calculate SVG arc paths for donut
  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeItem = allocation.find((a) => a.label === selectedAsset) || allocation[0];

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.cardBorder }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Asset Allocation</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {allocation.length} Asset Classes
        </Text>
      </View>

      {/* Segmented Progress Bar */}
      <View style={styles.segmentedBar}>
        {allocation.map((item, idx) => (
          <TouchableOpacity
            key={`bar_${idx}`}
            style={[
              styles.barSegment,
              {
                flex: Math.max(0.04, item.percentage),
                backgroundColor: item.color,
                opacity: selectedAsset && selectedAsset !== item.label ? 0.4 : 1,
              },
            ]}
            onPress={() => setSelectedAsset(selectedAsset === item.label ? null : item.label)}
            activeOpacity={0.7}
          />
        ))}
      </View>

      {/* Donut and Active Focus */}
      <View style={styles.chartRow}>
        <View style={styles.svgContainer}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {/* Background ring */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={isDarkMode ? '#2D3748' : '#F3F4F6'}
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Segments */}
              {allocation.map((item, idx) => {
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += item.percentage;

                const isSelected = selectedAsset === item.label;

                return (
                  <Circle
                    key={`slice_${idx}`}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="none"
                    strokeLinecap="round"
                    opacity={selectedAsset && !isSelected ? 0.35 : 1}
                  />
                );
              })}
            </G>
          </Svg>

          {/* Central Summary inside Donut */}
          <View style={styles.donutCenter}>
            <Text style={[styles.donutLabel, { color: theme.textMuted }]}>
              {activeItem.label}
            </Text>
            <Text style={[styles.donutPercent, { color: theme.textPrimary }]}>
              {activeItem.percentage}%
            </Text>
            <Text style={[styles.donutAmount, { color: theme.primary }]}>
              {formatMoney(activeItem.currentValue)}
            </Text>
          </View>
        </View>

        {/* Legend List */}
        <View style={styles.legendContainer}>
          {allocation.map((item, idx) => {
            const isSelected = selectedAsset === item.label;
            return (
              <TouchableOpacity
                key={`legend_${idx}`}
                style={[
                  styles.legendItem,
                  isSelected && {
                    backgroundColor: isDarkMode ? '#252D3D' : '#F3F4F6',
                    borderRadius: 8,
                    paddingHorizontal: 6,
                  },
                ]}
                onPress={() => setSelectedAsset(selectedAsset === item.label ? null : item.label)}
                activeOpacity={0.7}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <View style={styles.legendTextCol}>
                  <Text style={[styles.legendLabel, { color: theme.textPrimary }]} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={[styles.legendSub, { color: theme.textMuted }]}>
                    {item.count} holding{item.count > 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.legendValCol}>
                  <Text style={[styles.legendPercent, { color: theme.textPrimary }]}>
                    {item.percentage}%
                  </Text>
                  <Text style={[styles.legendAmount, { color: theme.textSecondary }]}>
                    {formatMoney(item.currentValue)}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
    gap: 2,
  },
  barSegment: {
    height: '100%',
    borderRadius: 2,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  svgContainer: {
    position: 'relative',
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  donutLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  donutPercent: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 1,
  },
  donutAmount: {
    fontSize: 11,
    fontWeight: '700',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 12,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendTextCol: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendSub: {
    fontSize: 10,
  },
  legendValCol: {
    alignItems: 'flex-end',
  },
  legendPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  legendAmount: {
    fontSize: 10,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
