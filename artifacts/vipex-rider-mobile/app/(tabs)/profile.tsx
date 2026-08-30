import { Feather } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { router } from 'expo-router';

const logo = require('@/assets/images/vipex-logo.jpeg');

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 90 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>YOUR RIDER PROFILE</Text>
      <View style={styles.profileRow}>
        <Image source={logo} style={styles.profileLogo} />
        <View style={{ flex: 1 }}><Text style={[styles.title, { color: colors.foreground }]}>Kwame Asante</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>VIPEX rider since March 2024</Text><View style={styles.verified}><Feather name="check-circle" size={13} color={colors.success} /><Text style={[styles.verifiedText, { color: colors.success }]}>Verified rider</Text></View></View>
      </View>
      <View style={[styles.statusCard, { backgroundColor: colors.charcoal }]}>
        <View><Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>RIDER STATUS</Text><Text style={[styles.statusTitle, { color: colors.primary }]}>Active & online</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>Ready to receive nearby assignments.</Text></View>
        <View style={[styles.onlinePill, { backgroundColor: colors.success }]}><View style={[styles.statusDot, { backgroundColor: colors.white }]} /><Text style={[styles.onlineText, { color: colors.white }]}>LIVE</Text></View>
      </View>
      <Text style={[styles.eyebrow, { color: colors.mutedForeground, marginBottom: 9 }]}>RIDER DETAILS</Text>
      <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <DetailRow icon="phone" label="Phone number" value="+233 24 000 0000" colors={colors} />
        <DetailRow icon="map-pin" label="Region" value="Greater Accra" colors={colors} />
        <DetailRow icon="truck" label="Vehicle" value="Motor Okada" colors={colors} />
      </View>
      <Pressable style={[styles.planButton, { backgroundColor: colors.yellowSoft, borderColor: colors.primary }]} onPress={() => router.push('/subscription')} testID="button-profile-subscription">
        <View style={[styles.planIcon, { backgroundColor: colors.primary }]}><Feather name="award" size={17} color={colors.ink} /></View>
        <View style={{ flex: 1 }}><Text style={[styles.planTitle, { color: colors.foreground }]}>VIPEX Rider plan</Text><Text style={[styles.copy, { color: colors.mutedForeground }]}>Active until 18 July 2024</Text></View>
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      </Pressable>
      <Pressable style={styles.logout} onPress={() => router.replace('/')} testID="button-logout"><Feather name="log-out" size={16} color={colors.destructive} /><Text style={[styles.logoutText, { color: colors.destructive }]}>Log out</Text></Pressable>
      <Text style={[styles.footer, { color: colors.mutedForeground }]}>VIPEX PARCEL DELIVERY · GREATER ACCRA</Text>
    </ScrollView>
  );
}

function DetailRow({ icon, label, value, colors }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; colors: ReturnType<typeof useColors> }) {
  return <View style={[styles.detailRow, { borderBottomColor: colors.secondary }]}><View style={styles.detailLabel}><Feather name={icon} size={15} color={colors.mutedForeground} /><Text style={[styles.copy, { color: colors.mutedForeground }]}>{label}</Text></View><Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 18 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  profileRow: { flexDirection: 'row', gap: 13, alignItems: 'center', marginTop: 18, marginBottom: 21 },
  profileLogo: { width: 67, height: 67, borderRadius: 20, borderWidth: 1, borderColor: '#D9DAD3' },
  title: { fontFamily: 'Inter_700Bold', fontSize: 23, letterSpacing: -0.8 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  verifiedText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  statusCard: { borderRadius: 17, padding: 17, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  cardEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.3 },
  statusTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, marginTop: 7, marginBottom: 2 },
  onlinePill: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineText: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  detailCard: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 15, marginBottom: 13 },
  detailRow: { minHeight: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailValue: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  planButton: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  planIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  planTitle: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  logout: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, marginTop: 24, paddingVertical: 12 },
  logoutText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  footer: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.2, textAlign: 'center', marginTop: 27 },
});