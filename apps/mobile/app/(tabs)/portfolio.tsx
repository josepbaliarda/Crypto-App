import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { usePortfolio } from '../../hooks/usePortfolio';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

export default function PortfolioScreen() {
  const { colors } = useTheme();
  const { data, isLoading, refetch } = usePortfolio();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  const isEmpty = !data || data.holdings.length === 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Portfolio</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Summary card */}
        {data && (
          <Card elevated style={styles.summaryCard}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Value</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${data.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <View style={styles.pnlRow}>
              <Text
                style={[
                  styles.pnlText,
                  { color: data.totalPnl >= 0 ? Colors.success : Colors.error },
                ]}
              >
                {data.totalPnl >= 0 ? '+' : ''}${data.totalPnl.toFixed(2)}
              </Text>
              <Badge value={data.totalPnlPercentage} size="md" />
            </View>
          </Card>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Holdings</Text>

        {isEmpty ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No holdings yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Start trading to see your portfolio here
            </Text>
          </View>
        ) : (
          data?.holdings.map((holding) => (
            <Card key={holding.coinSymbol} style={styles.holdingCard}>
              <View style={styles.holdingHeader}>
                <View style={[styles.symbolBadge, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={[styles.symbolText, { color: Colors.primary }]}>
                    {holding.coinSymbol.slice(0, 3)}
                  </Text>
                </View>
                <View style={styles.holdingInfo}>
                  <Text style={[styles.holdingSymbol, { color: colors.text }]}>
                    {holding.coinSymbol}
                  </Text>
                  <Text style={[styles.holdingAmount, { color: colors.textSecondary }]}>
                    {holding.amount.toFixed(6)} tokens
                  </Text>
                </View>
                <View style={styles.holdingValue}>
                  <Text style={[styles.holdingCurrentValue, { color: colors.text }]}>
                    ${holding.currentValue.toFixed(2)}
                  </Text>
                  <Badge value={holding.pnlPercentage} />
                </View>
              </View>
            </Card>
          ))
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
  summaryCard: { marginBottom: 24 },
  summaryLabel: { fontSize: 13, fontWeight: '500' },
  summaryValue: { fontSize: 32, fontWeight: '700', marginVertical: 6 },
  pnlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pnlText: { fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  holdingCard: { marginBottom: 10 },
  holdingHeader: { flexDirection: 'row', alignItems: 'center' },
  symbolBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: { fontSize: 13, fontWeight: '700' },
  holdingInfo: { flex: 1, marginLeft: 12 },
  holdingSymbol: { fontSize: 15, fontWeight: '600' },
  holdingAmount: { fontSize: 12, marginTop: 2 },
  holdingValue: { alignItems: 'flex-end' },
  holdingCurrentValue: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtitle: { fontSize: 14 },
  bottomSpace: { height: 40 },
});
