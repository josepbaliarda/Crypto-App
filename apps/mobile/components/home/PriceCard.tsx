import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import type { CoinPrice } from '@crypto-app/shared-types';

interface PriceCardProps {
  coin: CoinPrice;
}

export function PriceCard({ coin }: PriceCardProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => router.push(`/coin/${coin.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: coin.image }} style={styles.icon} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{coin.name}</Text>
        <Text style={[styles.symbol, { color: colors.textSecondary }]}>
          {coin.symbol.toUpperCase()}
        </Text>
      </View>
      <View style={styles.priceInfo}>
        <Text style={[styles.price, { color: colors.text }]}>
          ${coin.currentPrice.toLocaleString()}
        </Text>
        <Badge value={coin.priceChangePercentage24h} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  icon: { width: 40, height: 40, borderRadius: 20 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600' },
  symbol: { fontSize: 12, marginTop: 2 },
  priceInfo: { alignItems: 'flex-end' },
  price: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
});
