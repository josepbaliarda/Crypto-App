import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../../hooks/usePortfolio';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';
import type { TransactionDto } from '@crypto-app/shared-types';

const TX_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  buy: 'arrow-down-circle',
  sell: 'arrow-up-circle',
  send: 'paper-plane',
  receive: 'download',
};

const TX_COLORS: Record<string, string> = {
  buy: Colors.success,
  sell: Colors.error,
  send: '#F59E0B',
  receive: Colors.primary,
};

function TransactionItem({ tx }: { tx: TransactionDto }) {
  const { colors } = useTheme();
  const icon = TX_ICONS[tx.type] ?? 'swap-horizontal';
  const color = TX_COLORS[tx.type] ?? colors.text;
  const isBuyOrReceive = tx.type === 'buy' || tx.type === 'receive';

  return (
    <View style={[styles.txItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.txIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.txInfo}>
        <Text style={[styles.txType, { color: colors.text }]}>
          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.coinSymbol}
        </Text>
        <Text style={[styles.txDate, { color: colors.textSecondary }]}>
          {new Date(tx.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>
      <View style={styles.txAmounts}>
        <Text style={[styles.txAmount, { color: colors.text }]}>
          {isBuyOrReceive ? '+' : '-'}{tx.amount} {tx.coinSymbol}
        </Text>
        <Text style={[styles.txUsd, { color: colors.textSecondary }]}>
          ${tx.totalUsd.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default function TransactionsScreen() {
  const { colors } = useTheme();
  const { data, isLoading } = useTransactions(100);

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <View style={styles.placeholder} />
      </View>

      {data?.data.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No transactions yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Your transaction history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem tx={item} />}
          contentContainerStyle={styles.list}
        />
      )}
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
  title: { flex: 1, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  placeholder: { width: 32 },
  list: { paddingHorizontal: 16 },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txType: { fontSize: 15, fontWeight: '600' },
  txDate: { fontSize: 12, marginTop: 2 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: 14, fontWeight: '600' },
  txUsd: { fontSize: 12, marginTop: 2 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});
