import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

const logo = require('@/assets/images/vipex-logo.jpeg');

function ActionButton({
  icon,
  label,
  onPress,
  colors,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionButton,
        { borderColor: colors.border, backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
      testID={`button-${label.toLowerCase().replaceAll(' ', '-')}`}
    >
      <View style={[styles.actionIcon, { backgroundColor: colors.yellowSoft }]}>
        {icon}
      </View>
      <Text style={[styles.actionLabel, { color: colors.foreground }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RouteMap({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.map, { backgroundColor: colors.map }]}>
      <View style={[styles.mapBlock, styles.blockOne, { backgroundColor: colors.card }]} />
      <View style={[styles.mapBlock, styles.blockTwo, { backgroundColor: colors.card }]} />
      <View style={[styles.mapBlock, styles.blockThree, { backgroundColor: colors.card }]} />
      <View style={[styles.mapRoad, styles.roadOne, { backgroundColor: colors.white }]} />
      <View style={[styles.mapRoad, styles.roadTwo, { backgroundColor: colors.white }]} />
      <View style={[styles.routeLine, { borderColor: colors.primary }]} />
      <View style={[styles.pin, styles.pickupPin, { backgroundColor: colors.primary, borderColor: colors.ink }]}>
        <Feather name="package" size={12} color={colors.ink} />
      </View>
      <View style={[styles.pin, styles.dropPin, { backgroundColor: colors.charcoal, borderColor: colors.white }]}>
        <Feather name="map-pin" size={12} color={colors.primary} />
      </View>
      <View style={[styles.riderPin, { backgroundColor: colors.primary, borderColor: colors.white }]}>
        <MaterialCommunityIcons name="motorbike" size={18} color={colors.ink} />
      </View>
      <View style={[styles.mapTag, { backgroundColor: colors.card }]}>
        <View style={[styles.liveDot, { backgroundColor: colors.success }]} />
        <Text style={[styles.mapTagText, { color: colors.foreground }]}>LIVE ROUTE</Text>
      </View>
      <View style={[styles.distanceTag, { backgroundColor: colors.card }]}>
        <Feather name="navigation" size={11} color={colors.foreground} />
        <Text style={[styles.mapTagText, { color: colors.foreground }]}>3.8 km left</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(true);
  const [delivered, setDelivered] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const markDelivered = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDelivered(true);
    setNotice('Delivery marked as complete. GH₵ 32.00 added.');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 92 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.greeting}>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>TUESDAY · 18 JUNE</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Good morning, Kwame</Text>
          </View>
          <Pressable
            style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setNotice('You’re all caught up.')}
            testID="button-notifications"
          >
            <Feather name="bell" size={19} color={colors.foreground} />
          </Pressable>
        </View>

        <View style={styles.statusRow}>
          <Pressable
            style={styles.onlineToggle}
            onPress={() => {
              Haptics.selectionAsync();
              setIsOnline((value) => !value);
            }}
            testID="button-online-toggle"
          >
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.mutedForeground }]} />
            <Text style={[styles.statusText, { color: colors.foreground }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
            <View style={[styles.switchTrack, { backgroundColor: isOnline ? colors.success : colors.border }]}>
              <View style={[styles.switchThumb, isOnline && styles.switchThumbOn, { backgroundColor: colors.white }]} />
            </View>
          </Pressable>
          <Text style={[styles.statusHint, { color: colors.mutedForeground }]}>
            {isOnline ? 'Taking deliveries in Accra' : 'You’re off the road'}
          </Text>
        </View>

        <View style={[styles.earningsCard, { backgroundColor: colors.charcoal }]}>
          <View>
            <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>TODAY’S EARNINGS</Text>
            <Text style={[styles.earningsValue, { color: colors.primary }]}>GH₵ 186.50</Text>
          </View>
          <View style={[styles.cardDivider, { backgroundColor: colors.mutedForeground }]} />
          <View>
            <Text style={[styles.cardEyebrow, { color: colors.mutedForeground }]}>DELIVERIES</Text>
            <Text style={[styles.earningsValue, { color: colors.primary }]}>06 <Text style={[styles.earningsGoal, { color: colors.mutedForeground }]}>/ 10</Text></Text>
          </View>
          <Feather name="arrow-up-right" size={18} color={colors.primary} />
        </View>

        {!delivered ? (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>ACTIVE RUN</Text>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order #VP-4821</Text>
              </View>
              <View style={[styles.inTransit, { backgroundColor: colors.yellowSoft }]}>
                <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.inTransitText, { color: colors.accentForeground }]}>IN TRANSIT</Text>
              </View>
            </View>
            <RouteMap colors={colors} />
            <View style={styles.routeDetails}>
              <View style={styles.routeStop}>
                <View style={[styles.stopIcon, { backgroundColor: colors.yellowSoft }]}>
                  <Feather name="package" size={15} color={colors.accentForeground} />
                </View>
                <View style={styles.stopCopy}>
                  <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>PICK UP</Text>
                  <Text style={[styles.stopTitle, { color: colors.foreground }]}>VIPEX Hub · Osu</Text>
                </View>
                <Text style={[styles.stopTime, { color: colors.mutedForeground }]}>09:40</Text>
              </View>
              <View style={[styles.connector, { backgroundColor: colors.primary }]} />
              <View style={styles.routeStop}>
                <View style={[styles.stopIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="map-pin" size={15} color={colors.mutedForeground} />
                </View>
                <View style={styles.stopCopy}>
                  <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>DELIVER TO</Text>
                  <Text style={[styles.stopTitle, { color: colors.foreground }]}>12 Nii Nii Nyanchi St.</Text>
                </View>
                <Text style={[styles.stopTime, { color: colors.mutedForeground }]}>10:05</Text>
              </View>
            </View>
            <Pressable
              onPress={markDelivered}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.primary },
                pressed && styles.pressed,
              ]}
              testID="button-mark-delivered"
            >
              <Feather name="check" size={18} color={colors.ink} />
              <Text style={[styles.primaryButtonText, { color: colors.ink }]}>Mark delivered</Text>
            </Pressable>
          </>
        ) : (
          <View style={[styles.completeCard, { backgroundColor: colors.yellowSoft, borderColor: colors.primary }]}>
            <View style={[styles.completeIcon, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={22} color={colors.ink} />
            </View>
            <Text style={[styles.completeTitle, { color: colors.foreground }]}>Nice run, Kwame.</Text>
            <Text style={[styles.completeCopy, { color: colors.mutedForeground }]}>GH₵ 32.00 added to today’s earnings.</Text>
            <Pressable
              style={[styles.secondaryButton, { backgroundColor: colors.charcoal }]}
              onPress={() => setDelivered(false)}
              testID="button-next-delivery"
            >
              <Text style={[styles.secondaryButtonText, { color: colors.white }]}>View next run</Text>
              <Feather name="arrow-right" size={16} color={colors.white} />
            </Pressable>
          </View>
        )}

        <View style={styles.quickHeader}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>ON THE ROAD</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick actions</Text>
          </View>
          <Pressable onPress={() => router.push('/subscription')} testID="button-subscription-shortcut">
            <Text style={[styles.textLink, { color: colors.accentForeground }]}>View plan</Text>
          </Pressable>
        </View>
        <View style={styles.actionGrid}>
          <ActionButton
            colors={colors}
            label="New assignment"
            icon={<Feather name="zap" size={18} color={colors.accentForeground} />}
            onPress={() => setNotice('No nearby assignments right now.')}
          />
          <ActionButton
            colors={colors}
            label="Delivery history"
            icon={<Feather name="clock" size={18} color={colors.white} />}
            onPress={() => setNotice('Your completed deliveries will appear here.')}
          />
          <ActionButton
            colors={colors}
            label="Support"
            icon={<Feather name="headphones" size={18} color={colors.accentForeground} />}
            onPress={() => setNotice('Support is available 24/7.')}
          />
          <ActionButton
            colors={colors}
            label="Subscribe"
            icon={<Feather name="award" size={18} color={colors.accentForeground} />}
            onPress={() => router.push('/subscription')}
          />
        </View>
      </ScrollView>
      {notice ? (
        <Pressable
          style={[styles.notice, { backgroundColor: colors.charcoal }]}
          onPress={() => setNotice(null)}
          testID="button-dismiss-notice"
        >
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={[styles.noticeText, { color: colors.white }]}>{notice}</Text>
          <Feather name="x" size={15} color={colors.mutedForeground} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, gap: 0 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 17 },
  logo: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#D9DAD3' },
  greeting: { flex: 1 },
  eyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 21, letterSpacing: -0.7, marginTop: 3 },
  bellButton: { width: 42, height: 42, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 },
  onlineToggle: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  switchTrack: { width: 32, height: 18, borderRadius: 10, padding: 2, marginLeft: 2 },
  switchThumb: { width: 14, height: 14, borderRadius: 7 },
  switchThumbOn: { alignSelf: 'flex-end' },
  statusHint: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  earningsCard: { borderRadius: 19, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 17, marginBottom: 27 },
  cardEyebrow: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 1.3 },
  earningsValue: { fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 6, letterSpacing: -0.7 },
  earningsGoal: { fontFamily: 'Inter_500Medium', fontSize: 11, letterSpacing: 0 },
  cardDivider: { width: 1, height: 34, opacity: 0.35 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 11 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.5, marginTop: 4 },
  inTransit: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 7 },
  inTransitText: { fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 1 },
  map: { height: 180, borderRadius: 17, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#D9DAD3', marginBottom: 13 },
  mapBlock: { position: 'absolute', opacity: 0.65 },
  blockOne: { width: 92, height: 57, left: -9, top: 22, transform: [{ rotate: '-7deg' }] },
  blockTwo: { width: 86, height: 70, right: -8, top: 16, transform: [{ rotate: '12deg' }] },
  blockThree: { width: 108, height: 46, right: 51, bottom: 18, transform: [{ rotate: '-5deg' }] },
  mapRoad: { position: 'absolute', height: 14, width: '120%', opacity: 0.75 },
  roadOne: { left: -22, top: 80, transform: [{ rotate: '-19deg' }] },
  roadTwo: { left: -18, top: 127, transform: [{ rotate: '14deg' }] },
  routeLine: { position: 'absolute', width: 238, height: 102, left: 50, top: 21, borderWidth: 3, borderLeftColor: 'transparent', borderBottomColor: 'transparent', borderRadius: 60, transform: [{ rotate: '18deg' }] },
  pin: { position: 'absolute', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  pickupPin: { left: 22, top: 29 },
  dropPin: { right: 25, bottom: 26 },
  riderPin: { position: 'absolute', width: 35, height: 35, borderRadius: 18, left: '47%', top: '45%', alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  mapTag: { position: 'absolute', top: 10, right: 10, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  distanceTag: { position: 'absolute', bottom: 9, left: 9, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  mapTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 8, letterSpacing: 0.5 },
  routeDetails: { marginBottom: 14 },
  routeStop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stopIcon: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  stopCopy: { flex: 1 },
  stopTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 3 },
  stopTime: { fontFamily: 'Inter_500Medium', fontSize: 9 },
  connector: { width: 1, height: 11, marginLeft: 15, marginVertical: 2 },
  primaryButton: { height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 29 },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  completeCard: { borderRadius: 18, padding: 18, borderWidth: 1, marginBottom: 29 },
  completeIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  completeTitle: { fontFamily: 'Inter_700Bold', fontSize: 19, letterSpacing: -0.5 },
  completeCopy: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 5, marginBottom: 16 },
  secondaryButton: { borderRadius: 11, height: 42, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  secondaryButtonText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  quickHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 11 },
  textLink: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionButton: { width: '48.3%', minHeight: 78, borderRadius: 15, borderWidth: 1, padding: 11, justifyContent: 'space-between' },
  actionIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  notice: { position: 'absolute', left: 18, right: 18, bottom: 80, borderRadius: 14, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 9, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 7 },
  noticeText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11 },
});