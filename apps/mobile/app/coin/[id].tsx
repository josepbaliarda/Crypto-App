import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCoinDetail } from '../../hooks/useMarket';
import { OrderForm } from '../../components/trade/OrderForm';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useTheme } from '../../hooks/useTheme';

export default function CoinDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: coin, isLoading } = useCoinDetail(id);
  const [showTrade, setShowTrade] = useState(false);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!coin) return null;

  const price = coin.market_data?.current_price?.usd ?? 0;
  const change24h = coin.market_data?.price_change_percentage_24h ?? 0;
  const marketCap = coin.market_data?.market_cap?.usd ?? 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={{ uri: coin.image?.small }} style={styles.coinIcon} />
          <Text style={[styles.coinName, { color: colors.text }]}>{coin.name}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Price section */}
        <View style={styles.priceSection}>
          <Text style={[styles.price, { color: colors.text }]}>
            ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <Badge value={change24h} size="md" />
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Market Cap</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ${(marketCap / 1e9).toFixed(1)}B
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Symbol</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {coin.symbol?.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              #{coin.market_cap_rank ?? '—'}
            </Text>
          </View>
        </View>

        {/* Description */}
        {coin.description?.en && (
          <View style={styles.descSection}>
            <Text style={[styles.descTitle, { color: colors.text }]}>About</Text>
            <Text style={[styles.descText, { color: colors.textSecondary }]} numberOfLines={5}>
              {coin.description.en.replace(/<[^>]*>/g, '')}
            </Text>
          </View>
        )}

        {/* Trade toggle */}
        <TouchableOpacity
          style={[styles.tradeToggle, { backgroundColor: showTrade ? colors.surface : '#0052FF' }]}
          onPress={() => setShowTrade(!showTrade)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tradeToggleText, { color: showTrade ? colors.text : '#FFFFFF' }]}>
            {showTrade ? 'Hide Trade Form' : `Trade ${coin.symbol?.toUpperCase()}`}
          </Text>
        </TouchableOpacity>

        {showTrade && (
          <View style={[styles.tradeForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <OrderForm
              coinSymbol={coin.symbol?.toUpperCase() ?? ''}
              coinName={coin.name}
              currentPrice={price}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  coinIcon: { width: 28, height: 28, borderRadius: 14 },
  coinName: { fontSize: 17, fontWeight: '600' },
  placeholder: { width: 32 },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  priceSection: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  price: { fontSize: 36, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 12, marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: '600' },
  statDivider: { width: 1, alignSelf: 'stretch', marginHorizontal: 8 },
  descSection: { marginBottom: 20 },
  descTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  descText: { fontSize: 14, lineHeight: 20 },
  tradeToggle: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  tradeToggleText: { fontSize: 16, fontWeight: '600' },
  tradeForm: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  bottomSpace: { height: 40 },
});
