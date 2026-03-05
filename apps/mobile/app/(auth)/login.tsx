import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLogin } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Colors } from '../../constants/colors';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { mutate: login, isPending, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) return;
    login({ email: email.trim(), password });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: Colors.primary }]}>
            <Text style={styles.logoText}>₿</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>CryptoApp</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            The easiest place to buy and sell crypto.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Password"
            placeholder="Your password"
            secureTextEntry
            leftIcon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <Text style={styles.errorText}>
              {(error as any)?.response?.data?.message ?? 'Login failed'}
            </Text>
          )}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isPending}
            size="lg"
            style={styles.loginButton}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            style={[styles.registerButton, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.registerText, { color: colors.text }]}>
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: { fontSize: 36, color: '#FFFFFF' },
  appName: { fontSize: 28, fontWeight: '700' },
  tagline: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  form: { gap: 4 },
  errorText: { color: '#FF4B4B', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  loginButton: { marginTop: 8 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 12 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  registerButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registerText: { fontSize: 15, fontWeight: '600' },
});
