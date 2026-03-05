import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  value: number;
  variant?: 'positive' | 'negative' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ value, variant, size = 'sm' }: BadgeProps) {
  const resolvedVariant = variant ?? (value >= 0 ? 'positive' : 'negative');

  return (
    <View style={[styles.badge, styles[resolvedVariant]]}>
      <Text style={[styles.text, styles[`text_${resolvedVariant}`], size === 'md' && styles.textMd]}>
        {value >= 0 ? '+' : ''}
        {value.toFixed(2)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  positive: { backgroundColor: '#E6FFE6' },
  negative: { backgroundColor: '#FFE6E6' },
  neutral: { backgroundColor: '#F3F4F6' },
  text: { fontSize: 11, fontWeight: '600' },
  text_positive: { color: '#00B300' },
  text_negative: { color: '#FF4B4B' },
  text_neutral: { color: '#6B7280' },
  textMd: { fontSize: 13 },
});
