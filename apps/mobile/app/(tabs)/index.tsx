import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTopCoins } from '../../hooks/useMarket';
import { usePortfolio } from '../../hooks/usePortfolio';
import { PriceCard } from '../../components/home/PriceCard';
import { PortfolioSummaryCard } from '../../components/home/PortfolioSummary';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/auth.store';

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const { data: coins, isLoading: coinsLoading, refetch: refetchCoins } = useTopCoins(20);
  const { data: portfolio, refetch: refetchPortfolio } = usePortfolio();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCoins(), refetchPortfolio()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning,</Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.fullName?.split(' ')[0] ?? 'Trader'} 👋
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Portfolio summary */}
        {portfolio && (
          <PortfolioSummaryCard
            totalValue={portfolio.totalValue}
            totalPnl={portfolio.totalPnl}
            totalPnlPercentage={portfolio.totalPnlPercentage}
          />
        )}

        {/* Market section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Assets</Text>
        </View>

        {coinsLoading ? (
          <LoadingSpinner message="Loading prices..." />
        ) : (
          coins?.map((coin) => <PriceCard key={coin.id} coin={coin} />)
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  greeting: { fontSize: 13 },
  userName: { fontSize: 20, fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  section: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  bottomSpace: { height: 40 },
});
