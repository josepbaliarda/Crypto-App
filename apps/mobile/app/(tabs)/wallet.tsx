import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useQuery } from '@tanstack/react-query';
import { walletService } from '../../services/wallet.service';
import { AddressDisplay } from '../../components/wallet/AddressDisplay';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

export default function WalletScreen() {
  const { colors } = useTheme();
  const {
    data: wallet,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['wallet', 'primary'],
    queryFn: walletService.getPrimaryWallet,
  });

  const { data: balance } = useQuery({
    queryKey: ['wallet', 'balance', wallet?.id],
    queryFn: () => walletService.getBalance(wallet!.id),
    enabled: !!wallet?.id,
  });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Network', wallet?.network ?? 'sepolia')}
          style={[styles.networkBadge, { backgroundColor: Colors.primaryLight }]}
        >
          <Text style={[styles.networkText, { color: Colors.primary }]}>
            {wallet?.network ?? 'sepolia'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* QR Code Card */}
        <Card elevated style={styles.qrCard}>
          <Text style={[styles.qrLabel, { color: colors.textSecondary }]}>
            Your Ethereum Address
          </Text>
          <View style={styles.qrContainer}>
            {wallet?.address ? (
              <QRCode
                value={wallet.address}
                size={200}
                color={colors.text}
                backgroundColor={colors.card}
              />
            ) : (
              <View style={[styles.qrPlaceholder, { backgroundColor: colors.surface }]}>
                <Text style={{ color: colors.textSecondary }}>No wallet</Text>
              </View>
            )}
          </View>

          {wallet && <AddressDisplay address={wallet.address} />}
        </Card>

        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>ETH Balance</Text>
          <Text style={[styles.balanceValue, { color: colors.text }]}>
            {balance?.balance ?? '0.000000'} ETH
          </Text>
          <Text style={[styles.network, { color: colors.textSecondary }]}>
            on {balance?.network ?? wallet?.network ?? 'sepolia'}
          </Text>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Receive"
            variant="secondary"
            style={styles.actionBtn}
            onPress={() => Alert.alert('Receive', `Send ETH to:\n${wallet?.address}`)}
          />
          <Button
            title="Refresh"
            variant="ghost"
            style={styles.actionBtn}
            onPress={() => refetch()}
          />
        </View>

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
  title: { fontSize: 24, fontWeight: '700' },
  networkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  networkText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  scroll: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  qrCard: { alignItems: 'center', marginBottom: 16, gap: 16 },
  qrLabel: { fontSize: 14, fontWeight: '500' },
  qrContainer: {
    padding: 16,
    borderRadius: 12,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  balanceCard: { marginBottom: 16 },
  balanceLabel: { fontSize: 13, fontWeight: '500' },
  balanceValue: { fontSize: 32, fontWeight: '700', marginTop: 4 },
  network: { fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1 },
  bottomSpace: { height: 40 },
});
