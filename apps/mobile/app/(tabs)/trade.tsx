import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTopCoins } from '../../hooks/useMarket';
import { OrderForm } from '../../components/trade/OrderForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';
import type { CoinPrice } from '@crypto-app/shared-types';

export default function TradeScreen() {
  const { colors } = useTheme();
  const { data: coins, isLoading } = useTopCoins(10);
  const [selectedCoin, setSelectedCoin] = useState<CoinPrice | null>(null);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Trade</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Coin selector */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Asset</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coinsRow}>
          {coins?.map((coin) => (
            <TouchableOpacity
              key={coin.id}
              style={[
                styles.coinChip,
                { backgroundColor: colors.surface, borderColor: colors.border },
                selectedCoin?.id === coin.id && {
                  borderColor: Colors.primary,
                  backgroundColor: Colors.primaryLight,
                },
              ]}
              onPress={() => setSelectedCoin(coin)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: coin.image }} style={styles.coinIcon} />
              <Text
                style={[
                  styles.coinSymbol,
                  { color: selectedCoin?.id === coin.id ? Colors.primary : colors.text },
                ]}
              >
                {coin.symbol.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedCoin ? (
          <View style={styles.orderSection}>
            {/* Selected coin info */}
            <View style={[styles.coinInfo, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Image source={{ uri: selectedCoin.image }} style={styles.coinInfoIcon} />
              <View style={styles.coinInfoText}>
                <Text style={[styles.coinInfoName, { color: colors.text }]}>{selectedCoin.name}</Text>
                <Text style={[styles.coinInfoPrice, { color: colors.textSecondary }]}>
                  ${selectedCoin.currentPrice.toLocaleString()}
                </Text>
              </View>
              <Badge value={selectedCoin.priceChangePercentage24h} size="md" />
            </View>

            <OrderForm
              coinSymbol={selectedCoin.symbol.toUpperCase()}
              coinName={selectedCoin.name}
              currentPrice={selectedCoin.currentPrice}
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
              Select an asset above to start trading
            </Text>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  coinsRow: { marginBottom: 24 },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    marginRight: 10,
    gap: 8,
  },
  coinIcon: { width: 28, height: 28, borderRadius: 14 },
  coinSymbol: { fontSize: 14, fontWeight: '600' },
  orderSection: { marginTop: 8 },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  coinInfoIcon: { width: 44, height: 44, borderRadius: 22 },
  coinInfoText: { flex: 1, marginLeft: 12 },
  coinInfoName: { fontSize: 16, fontWeight: '600' },
  coinInfoPrice: { fontSize: 14, marginTop: 2 },
  placeholder: { alignItems: 'center', paddingTop: 60 },
  placeholderText: { fontSize: 15, textAlign: 'center' },
  bottomSpace: { height: 40 },
});
