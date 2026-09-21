import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, profileError } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email.includes('@')) return setError('Enter the email linked to your rider account.');
    if (password.length < 6) {
      setError('Use a password with at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (name.trim().length < 2 || phone.trim().length < 8) {
          setError('Enter your name and mobile number to request rider access.');
          return;
        }
        const hasSession = await signUp({ email, password, name, phone });
        setError(hasSession ? 'Your account was created. The rider profile must be linked by SwiftPex operations.' : 'Check your email to confirm your account, then sign in. Rider access still requires an approved rider profile.');
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Account creation failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 26 }]} keyboardShouldPersistTaps="handled">
         <View style={styles.brandRow}><View style={[styles.logo, { backgroundColor: colors.primary }]}><Feather name="navigation" size={20} color={colors.ink} /></View><View><Text style={[styles.brandName, { color: colors.foreground }]}>SWIFTDELIVERY</Text><Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>SWIFTPEX RIDER ACCESS</Text></View></View>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name="navigation" size={25} color={colors.ink} /></View>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>{mode === 'login' ? 'RIDER SIGN IN' : 'RIDER ACCESS'}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{mode === 'login' ? 'Welcome back.' : 'Request rider access.'}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Sign in with the Supabase account linked to your SwiftPex rider profile.</Text>
        <View style={styles.form}>
          {mode === 'signup' ? <><Text style={[styles.label, { color: colors.foreground }]}>Full name</Text><TextInput value={name} onChangeText={setName} placeholder="e.g. Kwame Asante" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} autoCapitalize="words" /></> : null}
          {mode === 'signup' ? <><Text style={[styles.label, { color: colors.foreground }]}>Mobile number</Text><TextInput value={phone} onChangeText={setPhone} placeholder="+233 24 000 0000" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} keyboardType="phone-pad" /></> : null}
          <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
          <TextInput value={email} onChangeText={(value) => { setEmail(value); setError(''); }} placeholder="rider@swiftpex.com" placeholderTextColor={colors.mutedForeground} style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} testID="input-email" />
          <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={(value) => { setPassword(value); setError(''); }}
            placeholder="Create a password"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            testID="input-password"
          />
          {error || profileError ? <Text style={[styles.error, { color: colors.destructive }]}>{error || profileError}</Text> : null}
          <Pressable onPress={submit} disabled={submitting} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && styles.pressed, submitting && styles.disabled]} testID="button-submit-auth">
            <Text style={[styles.buttonText, { color: colors.ink }]}>{submitting ? 'Please wait…' : mode === 'login' ? 'Sign in securely' : 'Create Supabase account'}</Text>
            <Feather name="arrow-right" size={17} color={colors.ink} />
          </Pressable>
          <Pressable onPress={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={styles.modeButton}><Text style={[styles.modeText, { color: colors.accentForeground }]}>{mode === 'login' ? 'Need rider access? Create an account' : 'Already have access? Sign in'}</Text></Pressable>
        </View>
        <View style={[styles.note, { backgroundColor: colors.yellowSoft }]}>
          <Feather name="shield" size={14} color={colors.accentForeground} />
          <Text style={[styles.noteText, { color: colors.accentForeground }]}>Only authenticated riders linked to SwiftPex can access jobs, earnings, or delivery actions.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 22, flexGrow: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 63 },
  logo: { width: 45, height: 45, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 15, letterSpacing: 2 },
  brandCaption: { fontFamily: 'Inter_600SemiBold', fontSize: 7, letterSpacing: 1.3, marginTop: 3 },
  heroIcon: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 19 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 33, lineHeight: 36, letterSpacing: -1.3, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 12, maxWidth: 310 },
  form: { marginTop: 29 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7, marginTop: 13 },
  input: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontFamily: 'Inter_400Regular', fontSize: 12 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 9 },
  button: { height: 51, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, marginTop: 20 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  note: { borderRadius: 13, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 'auto' },
  noteText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15 },
  modeButton: { alignItems: 'center', paddingVertical: 14 },
  modeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
});