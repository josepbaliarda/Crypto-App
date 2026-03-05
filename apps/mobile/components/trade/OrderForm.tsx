import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useCreateTransaction } from '../../hooks/usePortfolio';
import { Colors } from '../../constants/colors';

interface OrderFormProps {
  coinSymbol: string;
  coinName: string;
  currentPrice: number;
}

export function OrderForm({ coinSymbol, coinName, currentPrice }: OrderFormProps) {
  const { colors } = useTheme();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const { mutate: createTx, isPending } = useCreateTransaction();

  const numAmount = parseFloat(amount) || 0;
  const total = numAmount * currentPrice;

  const handleSubmit = () => {
    if (numAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount');
      return;
    }
    createTx(
      { type: orderType, coinSymbol, amount: numAmount, priceUsd: currentPrice },
      {
        onSuccess: () => {
          Alert.alert('Success', `${orderType === 'buy' ? 'Bought' : 'Sold'} ${amount} ${coinSymbol}`);
          setAmount('');
        },
        onError: () => Alert.alert('Error', 'Transaction failed. Please try again.'),
      },
    );
  };

  return (
    <View>
      {/* Buy / Sell toggle */}
      <View style={[styles.toggle, { backgroundColor: colors.surface }]}>
        {(['buy', 'sell'] as const).map((type) => (
          <View
            key={type}
            style={[
              styles.toggleItem,
              orderType === type && {
                backgroundColor: type === 'buy' ? Colors.success : Colors.error,
              },
            ]}
          >
            <Text
              onPress={() => setOrderType(type)}
              style={[
                styles.toggleText,
                orderType === type ? styles.activeToggleText : { color: colors.textSecondary },
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
        ))}
      </View>

      <Input
        label={`Amount (${coinSymbol})`}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      <Button
        title={`${orderType === 'buy' ? 'Buy' : 'Sell'} ${coinSymbol}`}
        onPress={handleSubmit}
        loading={isPending}
        variant={orderType === 'buy' ? 'primary' : 'danger'}
        size="lg"
        style={{ marginTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: { fontSize: 15, fontWeight: '600' },
  activeToggleText: { color: '#FFFFFF' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 16, fontWeight: '600' },
});
