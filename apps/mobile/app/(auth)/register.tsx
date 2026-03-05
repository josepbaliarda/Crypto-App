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
import { useRegister } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { mutate: register, isPending, error } = useRegister();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordError('');
    register({ email: email.trim(), password, fullName: fullName.trim() });
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
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join millions of users buying and selling crypto
        </Text>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon="person-outline"
            value={fullName}
            onChangeText={setFullName}
          />
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
            placeholder="At least 8 characters"
            secureTextEntry
            leftIcon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
          />
          <Input
            label="Confirm Password"
            placeholder="Repeat your password"
            secureTextEntry
            leftIcon="shield-checkmark-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={passwordError}
          />

          {error && (
            <Text style={styles.errorText}>
              {(error as any)?.response?.data?.message ?? 'Registration failed'}
            </Text>
          )}

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isPending}
            size="lg"
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.loginLinkText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
              <Text style={{ color: '#0052FF', fontWeight: '600' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 32 },
  form: { gap: 4 },
  errorText: { color: '#FF4B4B', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  registerButton: { marginTop: 8 },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginLinkText: { fontSize: 14 },
});
