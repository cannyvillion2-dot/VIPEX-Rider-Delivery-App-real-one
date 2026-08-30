import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const logo = require('@/assets/images/vipex-logo.jpeg');
const providers = [
  { id: 'mtn', name: 'MTN MoMo', detail: 'Pay with your MTN wallet', colorKey: 'mtn' },
  { id: 'vodafone', name: 'Vodafone Cash', detail: 'Pay with your Vodafone wallet', colorKey: 'vodafone' },
  { id: 'airteltigo', name: 'AirtelTigo Money', detail: 'Pay with your AirtelTigo wallet', colorKey: 'airteltigo' },
];

export default function SubscriptionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('mtn');
  const [activated, setActivated] = useState(false);

  const activate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setActivated(true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 22 }} showsVerticalScrollIndicator={false}>
        <View style={styles.modalHeader}>
          <Image source={logo} style={styles.logo} />
          <Pressable onPress={() => router.back()} style={[styles.close, { backgroundColor: colors.secondary }]} testID="button-close-subscription"><Feather name="x" size={18} color={colors.foreground} /></Pressable>
        </View>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>RIDER ACTIVATION</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Keep your wheels{'\n'}moving.</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Activate your VIPEX rider account with a simple monthly plan.</Text>
        <View style={[styles.planCard, { backgroundColor: colors.charcoal }]}>
          <View style={styles.planTop}><View style={[styles.award, { backgroundColor: colors.primary }]}><Feather name="award" size={19} color={colors.ink} /></View><View style={[styles.popular, { backgroundColor: colors.primary }]}><Text style={[styles.popularText, { color: colors.ink }]}>RIDER PLAN</Text></View></View>
          <Text style={[styles.planName, { color: colors.white }]}>VIPEX Rider plan</Text>
          <View style={styles.priceRow}><Text style={[styles.currency, { color: colors.primary }]}>GH₵</Text><Text style={[styles.price, { color: colors.primary }]}>20</Text><Text style={[styles.month, { color: colors.mutedForeground }]}>/ month</Text></View>
          <View style={[styles.divider, { backgroundColor: colors.mutedForeground }]} />
          {['Unlimited delivery assignments', 'Real-time route tracking', 'Instant payout tracking', '24/7 rider support'].map((feature) => <View style={styles.feature} key={feature}><Feather name="check" size={14} color={colors.success} /><Text style={[styles.featureText, { color: colors.white }]}>{feature}</Text></View>)}
        </View>
        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>Choose your Mobile Money provider</Text>
        <View style={styles.providerList}>
          {providers.map((provider) => {
            const active = selected === provider.id;
            return <Pressable key={provider.id} onPress={() => { Haptics.selectionAsync(); setSelected(provider.id); }} style={[styles.providerRow, { backgroundColor: colors.card, borderColor: active ? colors.primary : colors.border }, active && { backgroundColor: colors.yellowSoft }]} testID={`button-provider-${provider.id}`}><View style={[styles.providerBadge, { backgroundColor: provider.id === 'mtn' ? colors.primary : provider.id === 'vodafone' ? colors.destructive : colors.success }]}><Text style={[styles.providerLetter, { color: colors.white }]}>{provider.id === 'mtn' ? 'M' : provider.id === 'vodafone' ? 'V' : 'A'}</Text></View><View style={{ flex: 1 }}><Text style={[styles.providerName, { color: colors.foreground }]}>{provider.name}</Text><Text style={[styles.providerDetail, { color: colors.mutedForeground }]}>{provider.detail}</Text></View><View style={[styles.radio, { borderColor: active ? colors.accentForeground : colors.border }]}>{active && <View style={[styles.radioFill, { backgroundColor: colors.primary }]} />}</View></Pressable>;
          })}
        </View>
        <Pressable onPress={activate} disabled={activated} style={({ pressed }) => [styles.payButton, { backgroundColor: activated ? colors.success : colors.primary }, pressed && styles.pressed]} testID="button-pay-mobile-money"><Feather name={activated ? 'check-circle' : 'smartphone'} size={18} color={activated ? colors.white : colors.ink} /><Text style={[styles.payText, { color: activated ? colors.white : colors.ink }]}>{activated ? 'Plan active' : 'Pay GH₵ 20 with Mobile Money'}</Text></Pressable>
        <View style={styles.secure}><Feather name="lock" size={13} color={colors.mutedForeground} /><Text style={[styles.secureText, { color: colors.mutedForeground }]}>Secure payment · {providers.find((provider) => provider.id === selected)?.name}</Text></View>
        {activated && <View style={[styles.successBanner, { backgroundColor: colors.yellowSoft }]}><Feather name="check" size={15} color={colors.success} /><Text style={[styles.successText, { color: colors.foreground }]}>You’re activated. Welcome to the VIPEX fleet.</Text></View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  logo: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#D9DAD3' },
  close: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 31, lineHeight: 33, letterSpacing: -1.2, marginTop: 8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17, marginTop: 11, marginBottom: 18 },
  planCard: { borderRadius: 19, padding: 18, marginBottom: 22 },
  planTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  award: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  popular: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6 },
  popularText: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 1 },
  planName: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 17 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 6 },
  currency: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginRight: 3 },
  price: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: -1.5 },
  month: { fontFamily: 'Inter_400Regular', fontSize: 10, marginLeft: 4 },
  divider: { height: 1, opacity: 0.35, marginVertical: 17 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 10 },
  providerList: { gap: 9, marginBottom: 18 },
  providerRow: { minHeight: 65, borderRadius: 14, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  providerBadge: { width: 35, height: 35, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  providerLetter: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  providerName: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  providerDetail: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  radioFill: { width: 10, height: 10, borderRadius: 5 },
  payButton: { height: 51, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  payText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 13 },
  secureText: { fontFamily: 'Inter_400Regular', fontSize: 9 },
  successBanner: { borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14 },
  successText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 10 },
  pressed: { opacity: 0.74, transform: [{ scale: 0.98 }] },
});