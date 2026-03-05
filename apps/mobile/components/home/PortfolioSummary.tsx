import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

interface PortfolioSummaryProps {
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
}

export function PortfolioSummaryCard({
  totalValue,
  totalPnl,
  totalPnlPercentage,
}: PortfolioSummaryProps) {
  const { colors } = useTheme();
  const isPositive = totalPnl >= 0;

  return (
    <View style={[styles.container, { backgroundColor: Colors.primary }]}>
      <Text style={styles.label}>Portfolio Value</Text>
      <Text style={styles.value}>${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
      <View style={styles.pnlRow}>
        <Text style={[styles.pnl, { color: isPositive ? '#90FF90' : '#FF9090' }]}>
          {isPositive ? '+' : ''}${totalPnl.toFixed(2)}
        </Text>
        <Text style={[styles.pnlPct, { color: isPositive ? '#90FF90' : '#FF9090' }]}>
          ({isPositive ? '+' : ''}{totalPnlPercentage.toFixed(2)}%)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  value: { color: '#FFFFFF', fontSize: 36, fontWeight: '700', marginTop: 4 },
  pnlRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  pnl: { fontSize: 15, fontWeight: '600' },
  pnlPct: { fontSize: 14 },
});
