import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';

const logo = require('@/assets/images/vipex-logo.jpeg');

export default function PendingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 34, paddingBottom: insets.bottom + 28 }]}
    >
      <Image source={logo} style={styles.logo} />
      <View style={[styles.icon, { backgroundColor: colors.yellowSoft }]}>
        <Feather name="clock" size={28} color={colors.accentForeground} />
      </View>
      <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>APPLICATION RECEIVED</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>We’re checking{'\n'}your details.</Text>
      <Text style={[styles.copy, { color: colors.mutedForeground }]}>
        Thanks, {user?.name?.split(' ')[0] || 'Rider'}. Our team is reviewing your rider application. We’ll send a text when you’re cleared to ride.
      </Text>
      <View style={[styles.steps, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Step colors={colors} done label="Application submitted" detail="Just now" />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Step colors={colors} label="Team review" detail="Usually within 24 hours" />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Step colors={colors} label="Start delivering" detail="After verification" />
      </View>
      <Pressable
        onPress={() => router.push('/subscription')}
        style={({ pressed }) => [styles.button, { backgroundColor: colors.primary }, pressed && styles.pressed]}
        testID="button-view-activation"
      >
        <Text style={[styles.buttonText, { color: colors.ink }]}>View activation plan</Text>
        <Feather name="arrow-right" size={17} color={colors.ink} />
      </Pressable>
      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.secondaryButton} testID="button-continue-dashboard">
        <Text style={[styles.secondaryText, { color: colors.mutedForeground }]}>Continue to rider dashboard</Text>
      </Pressable>
    </ScrollView>
  );
}

function Step({ colors, done, label, detail }: { colors: ReturnType<typeof useColors>; done?: boolean; label: string; detail: string }) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepIcon, { backgroundColor: done ? colors.primary : colors.secondary }]}>
        <Feather name={done ? 'check' : 'circle'} size={13} color={done ? colors.ink : colors.mutedForeground} />
      </View>
      <View>
        <Text style={[styles.stepLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.stepDetail, { color: colors.mutedForeground }]}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 22 },
  logo: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, borderColor: '#D9DAD3', marginBottom: 72 },
  icon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 32, lineHeight: 35, letterSpacing: -1.2, marginTop: 8 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 14, maxWidth: 320 },
  steps: { borderWidth: 1, borderRadius: 17, padding: 16, marginTop: 30 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  stepIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  stepDetail: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  line: { width: 1, height: 17, marginLeft: 13, marginVertical: 4 },
  button: { height: 51, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9, marginTop: 'auto' },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  secondaryButton: { alignItems: 'center', paddingVertical: 16 },
  secondaryText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
});