import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <TouchableOpacity onPress={toggle} style={styles.button} activeOpacity={0.7}>
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={Colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8, borderRadius: 8 },
});
