import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactNativeBiometrics from 'react-native-biometrics';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { COLORS, SPACING, TYPOGRAPHY, ACCESSIBILITY } from '../utils/constants';

const rnBiometrics = new ReactNativeBiometrics();

export const LoginScreen: React.FC = () => {
  const { login, settings } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [loginMode, setLoginMode] = useState<'credentials' | 'passcode'>('credentials');
  const [loading, setLoading] = useState(false);

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      const { available } = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert('Biometric Login', 'Biometric authentication not available on this device');
        return;
      }

      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        login();
      }
    } catch (error) {
      Alert.alert('Biometric Login', 'Biometric authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialLogin = () => {
    if (!username || !password) {
      Alert.alert('Login Error', 'Please enter both username and password');
      return;
    }

    // Demo credentials
    if (username === 'demo' && password === 'demo123') {
      login();
    } else {
      Alert.alert('Login Error', 'Invalid username or password');
    }
  };

  const handlePasscodeLogin = () => {
    if (passcode.length >= 4) {
      login();
    } else {
      Alert.alert('Login Error', 'Please enter a valid passcode');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>CC</Text>
          </View>
          <Text style={styles.title}>CareConnect</Text>
          <Text style={styles.subtitle}>Your health, simplified</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          {loginMode === 'credentials' ? (
            <>
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                testID="username-input"
              />

              <View>
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  testID="password-input"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <Button
                title="Sign In"
                onPress={handleCredentialLogin}
                variant="primary"
                size="large"
                fullWidth
                testID="login-button"
              />

              <Text style={styles.demoText}>
                Demo credentials: username: <Text style={styles.demoBold}>demo</Text>, password:{' '}
                <Text style={styles.demoBold}>demo123</Text>
              </Text>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or sign in with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Alternative Login Methods */}
              {settings.biometricEnabled && (
                <Button
                  title="Biometric Authentication"
                  onPress={handleBiometricLogin}
                  variant="ghost"
                  size="large"
                  fullWidth
                  loading={loading}
                  testID="biometric-button"
                />
              )}

              <Button
                title="Use Passcode"
                onPress={() => setLoginMode('passcode')}
                variant="ghost"
                size="large"
                fullWidth
                testID="passcode-mode-button"
              />
            </>
          ) : (
            <>
              <Input
                label="Enter Passcode"
                value={passcode}
                onChangeText={setPasscode}
                placeholder="••••"
                keyboardType="number-pad"
                secureTextEntry
                maxLength={6}
                testID="passcode-input"
                style={styles.passcodeInput}
              />

              <Button
                title="Sign In"
                onPress={handlePasscodeLogin}
                variant="primary"
                size="large"
                fullWidth
                disabled={passcode.length < 4}
                testID="passcode-login-button"
              />

              <Button
                title="Back to Username/Password"
                onPress={() => {
                  setLoginMode('credentials');
                  setPasscode('');
                }}
                variant="ghost"
                size="large"
                fullWidth
                testID="back-button"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: {
    fontSize: 48,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.surface,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxlarge,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.large,
    color: COLORS.textSecondary,
  },
  formContainer: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: 40,
    padding: SPACING.sm,
  },
  demoText: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  demoBold: {
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.sizes.small,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
  },
  passcodeInput: {
    textAlign: 'center',
    fontSize: TYPOGRAPHY.sizes.xxlarge,
    letterSpacing: 8,
  },
});
