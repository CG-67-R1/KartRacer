import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ART } from '../assets/art';
import { AppLogo } from '../components/AppLogo';
import { ArtThumb } from '../components/ArtThumb';
import { COMPACT_LOGO_SIZE } from '../constants/logoSizing';
import type { RiderCoachStackParamList } from './RiderCoachScreen';

type Nav = NativeStackNavigationProp<RiderCoachStackParamList, 'BikeSetupHub'>;

type Secondary = {
  title: string;
  description: string;
  art: (typeof ART)['tabTools'];
  onPress: () => void;
};

/** Hub: Kart Setup Tool is the primary action; other tools are secondary rows. */
export function BikeSetupHubScreen() {
  const navigation = useNavigation<Nav>();

  const secondary: Secondary[] = [
    {
      title: 'Kart Setup AI',
      description: 'Ask the setup coach',
      art: ART.tabTools,
      onPress: () => navigation.navigate('CoachChat', { mode: 'bikesetup' }),
    },
    {
      title: 'Setup History',
      description: 'Saved snapshots by track',
      art: ART.historySnapshot,
      onPress: () => navigation.navigate('KartSetupHistory', {}),
    },
    {
      title: 'Upload session',
      description: 'MyChron CSV lap analysis',
      art: ART.tabLogger,
      onPress: () => navigation.navigate('KartSessionUpload'),
    },
    {
      title: 'Gearing Guide',
      description: 'Sprockets and rollout',
      art: ART.toolGearing,
      onPress: () => navigation.navigate('GearingGuide'),
    },
    {
      title: 'Kart Setup Basics',
      description: 'What each lever does',
      art: ART.chassisJackingLift,
      onPress: () => navigation.navigate('BikeSetupBasics'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoRow}>
        <AppLogo size={COMPACT_LOGO_SIZE} />
      </View>

      <Text style={styles.sectionLabel}>Kart Setup</Text>
      <Text style={styles.privacyNote}>
        Setup tools keep your data private on this device. Save snapshots for later comparison, and
        share a setup as text via Messages only when you choose.
      </Text>

      <TouchableOpacity
        style={styles.primary}
        onPress={() => navigation.navigate('BikeBalanceSetup')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Kart Setup Tool"
      >
        <ArtThumb source={ART.tabAnalysis} size={72} />
        <View style={styles.primaryCopy}>
          <Text style={styles.primaryTitle}>Kart Setup Tool</Text>
          <Text style={styles.primaryDesc}>
            Symptoms, pressures, and temps — change one thing, then go back out.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#f59e0b" />
      </TouchableOpacity>

      {secondary.map((row) => (
        <TouchableOpacity
          key={row.title}
          style={styles.row}
          onPress={row.onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={row.title}
        >
          <ArtThumb source={row.art} size={48} />
          <View style={styles.rowCopy}>
            <Text style={styles.rowTitle}>{row.title}</Text>
            <Text style={styles.rowDesc}>{row.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  logoRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 4,
  },
  privacyNote: {
    fontSize: 13,
    color: '#93c5fd',
    lineHeight: 18,
    marginBottom: 14,
  },
  primary: {
    width: '100%',
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 104,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  primaryCopy: {
    flex: 1,
  },
  primaryTitle: {
    fontFamily: 'RaceSport',
    fontSize: 20,
    color: '#f8fafc',
    marginBottom: 6,
  },
  primaryDesc: {
    fontSize: 15,
    lineHeight: 20,
    color: '#cbd5e1',
  },
  row: {
    width: '100%',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 72,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 15,
    lineHeight: 20,
    color: '#94a3b8',
  },
});
