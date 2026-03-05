import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

interface AddressDisplayProps {
  address: string;
}

export function AddressDisplay({ address }: AddressDisplayProps) {
  const { colors } = useTheme();

  const shortAddress = address
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : '';

  const handleCopy = async () => {
    // expo-clipboard may not always be available in managed workflow without config
    try {
      const Clipboard = require('expo-clipboard');
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied!', 'Address copied to clipboard');
    } catch {
      Alert.alert('Address', address);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.iconContainer}>
        <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
      </View>
      <Text style={[styles.address, { color: colors.text }]} numberOfLines={1}>
        {shortAddress}
      </Text>
      <TouchableOpacity onPress={handleCopy} style={styles.copyButton} activeOpacity={0.7}>
        <Ionicons name="copy-outline" size={18} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  address: { flex: 1, fontSize: 14, fontFamily: 'monospace' },
  copyButton: { padding: 6 },
});
