import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const logo = require('@/assets/images/vipex-logo.jpeg');
const regions = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
];

type RiderRow = {
  id: string;
  full_name: string;
  phone: string;
  region: string;
  vehicle_type: string;
  status: string;
  subscription_status: string;
  is_online: boolean;
};

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveRider } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [vehicleType, setVehicleType] = useState('Motor Okada');
  const [region, setRegion] = useState('');
  const [regionPickerVisible, setRegionPickerVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords dont match');
      return;
    }
    if (name.trim().length < 2) {
      setError('Enter your full name to continue.');
      return;
    }
    if (phone.trim().length < 8) {
      setError('Enter a valid phone number to continue.');
      return;
    }
    if (!region) {
      setError('Choose your region to continue.');
      return;
    }
    if (password.length < 6) {
      setError('Choose a password with at least 6 characters.');
      return;
    }
    if (!supabase) {
      setError('Supabase is not configured for this app.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: insertError } = await supabase
        .from('riders')
        .insert({
          full_name: name.trim(),
          phone: phone.trim(),
          password,
          region,
          vehicle_type: vehicleType.trim() || 'Motor Okada',
          status: 'pending_verification',
          subscription_status: 'inactive',
          is_online: false,
        })
        .select()
        .single<RiderRow>();

      if (insertError || !data) {
        console.error(insertError);
        Alert.alert('Error', insertError?.message || 'Could not create your rider account.');
        return;
      }

      const rider = {
        id: data.id,
        name: data.full_name,
        phone: data.phone,
        region: data.region,
        vehicleType: data.vehicle_type,
        status: data.status,
        subscriptionStatus: data.subscription_status,
        isOnline: data.is_online,
        subscriptionActive: data.subscription_status === 'active',
      };
      await saveRider(rider);
      router.replace('/pending');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Account creation failed. Please try again.';
      console.error(cause);
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 26, paddingBottom: insets.bottom + 26 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <Image source={logo} style={styles.logo} />
          <View><Text style={[styles.brandName, { color: colors.foreground }]}>VIPEX</Text><Text style={[styles.brandCaption, { color: colors.mutedForeground }]}>PARCEL DELIVERY</Text></View>
        </View>
        <View style={[styles.heroIcon, { backgroundColor: colors.primary }]}><Feather name="navigation" size={25} color={colors.ink} /></View>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>RIDER START</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Create your rider account.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Set up your profile once, then get on the road with VIPEX.</Text>
        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.foreground }]}>Full name</Text>
          <TextInput
            value={name}
            onChangeText={(value) => { setName(value); setError(''); }}
            placeholder="e.g. Kwame Asante"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            autoCapitalize="words"
            autoCorrect={false}
            testID="input-full-name"
          />
          <Text style={[styles.label, { color: colors.foreground }]}>Mobile number</Text>
          <TextInput
            value={phone}
            onChangeText={(value) => { setPhone(value); setError(''); }}
            placeholder="+233 24 000 0000"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            keyboardType="phone-pad"
            autoCorrect={false}
            testID="input-phone"
          />
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
          <Text style={[styles.label, { color: colors.foreground }]}>Confirm password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={(value) => { setConfirmPassword(value); setError(''); }}
            placeholder="Repeat your password"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            testID="input-confirm-password"
          />
          <Text style={[styles.label, { color: colors.foreground }]}>Vehicle type</Text>
          <TextInput
            value={vehicleType}
            onChangeText={(value) => { setVehicleType(value); setError(''); }}
            placeholder="Motor Okada"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            autoCapitalize="words"
            autoCorrect={false}
            testID="input-vehicle-type"
          />
          <Text style={[styles.label, { color: colors.foreground }]}>Region</Text>
          <Pressable
            onPress={() => setRegionPickerVisible(true)}
            style={[styles.input, styles.regionSelector, { backgroundColor: colors.card, borderColor: colors.border }]}
            testID="button-select-region"
          >
            <Text style={[styles.regionValue, { color: region ? colors.foreground : colors.mutedForeground }]}>{region || 'Select your region'}</Text>
            <Feather name="chevron-down" size={17} color={colors.mutedForeground} />
          </Pressable>
          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
          <Pressable onPress={handleCreateAccount} disabled={submitting} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && styles.pressed, submitting && styles.disabled]} testID="button-create-account">
            <Text style={[styles.buttonText, { color: colors.ink }]}>{submitting ? 'Creating account…' : 'Create rider account'}</Text>
            <Feather name="arrow-right" size={17} color={colors.ink} />
          </Pressable>
        </View>
        <View style={[styles.note, { backgroundColor: colors.yellowSoft }]}>
          <Feather name="shield" size={14} color={colors.accentForeground} />
          <Text style={[styles.noteText, { color: colors.accentForeground }]}>Your account stays on this device. You can log out anytime from Profile.</Text>
        </View>
      </ScrollView>
      <Modal visible={regionPickerVisible} transparent animationType="slide" onRequestClose={() => setRegionPickerVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.regionModal, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <View><Text style={[styles.modalEyebrow, { color: colors.mutedForeground }]}>GHANA</Text><Text style={[styles.modalTitle, { color: colors.foreground }]}>Choose your region</Text></View>
              <Pressable onPress={() => setRegionPickerVisible(false)} style={[styles.modalClose, { backgroundColor: colors.secondary }]} testID="button-close-region-picker"><Feather name="x" size={17} color={colors.foreground} /></Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {regions.map((item) => {
                const isSelected = item === region;
                return <Pressable key={item} onPress={() => { setRegion(item); setRegionPickerVisible(false); setError(''); }} style={[styles.regionOption, { borderBottomColor: colors.secondary }]} testID={`button-region-${item.toLowerCase().replaceAll(' ', '-')}`}><Text style={[styles.regionOptionText, { color: colors.foreground }]}>{item}</Text>{isSelected ? <Feather name="check" size={17} color={colors.success} /> : null}</Pressable>;
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 22, flexGrow: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 63 },
  logo: { width: 45, height: 45, borderRadius: 14, borderWidth: 1, borderColor: '#D9DAD3' },
  brandName: { fontFamily: 'Inter_700Bold', fontSize: 15, letterSpacing: 2 },
  brandCaption: { fontFamily: 'Inter_600SemiBold', fontSize: 7, letterSpacing: 1.3, marginTop: 3 },
  heroIcon: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 19 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 33, lineHeight: 36, letterSpacing: -1.3, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 12, maxWidth: 310 },
  form: { marginTop: 29 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginBottom: 7, marginTop: 13 },
  input: { minHeight: 49, borderWidth: 1, borderRadius: 13, paddingHorizontal: 14, fontFamily: 'Inter_400Regular', fontSize: 12 },
  regionSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0 },
  regionValue: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 9 },
  button: { height: 51, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, marginTop: 20 },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  note: { borderRadius: 13, padding: 12, flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 'auto' },
  noteText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.55 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  regionModal: { maxHeight: '82%', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 19, paddingBottom: 22 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 },
  modalEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.4 },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, marginTop: 4 },
  modalClose: { width: 35, height: 35, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  regionOption: { minHeight: 48, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  regionOptionText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
});