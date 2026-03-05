import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

const PIN_LENGTH = 6;

export default function PinScreen() {
  const { colors } = useTheme();
  const [pin, setPin] = useState<string[]>([]);

  const handlePress = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = [...pin, digit];
      setPin(newPin);
      if (newPin.length === PIN_LENGTH) {
        // PIN complete — navigate forward
        setTimeout(() => router.replace('/(tabs)'), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Enter PIN</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Set up a 6-digit PIN to secure your account
      </Text>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { borderColor: colors.border },
              i < pin.length && { backgroundColor: Colors.primary, borderColor: Colors.primary },
            ]}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.key,
              { backgroundColor: key === '' ? 'transparent' : colors.surface },
            ]}
            onPress={() => {
              if (key === 'del') handleDelete();
              else if (key !== '') handlePress(key);
            }}
            activeOpacity={0.7}
            disabled={key === ''}
          >
            <Text
              style={[
                styles.keyText,
                { color: key === 'del' ? Colors.error : colors.text },
              ]}
            >
              {key === 'del' ? '⌫' : key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 40 },
  dotsRow: { flexDirection: 'row', gap: 16, marginBottom: 48 },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontSize: 24, fontWeight: '500' },
});
