import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KartSetupSheetFields } from '../components/KartSetupSheetFields';
import { KartSetupVenuePanel } from '../components/KartSetupVenuePanel';
import { KartSetupWeatherImport } from '../components/KartSetupWeatherImport';
import type { ChassisSetup, Conditions, SetupSnapshot } from '../lib/setupEngine';
import { restoreSnapshot } from '../lib/setupEngine';
import {
  defaultKartSetupSession,
  loadKartSetupHistory,
  loadKartSetupSession,
  saveKartSetupHistory,
  saveKartSetupSession,
  type KartSetupSession,
} from '../storage/kartSetup';
import type { RiderCoachStackParamList } from './RiderCoachScreen';

type Nav = NativeStackNavigationProp<RiderCoachStackParamList, 'KartSetupSheet'>;

export function KartSetupSheetScreen() {
  const navigation = useNavigation<Nav>();
  const [session, setSession] = useState<KartSetupSession>(defaultKartSetupSession);
  const [history, setHistory] = useState<SetupSnapshot[]>([]);
  const [ready, setReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void Promise.all([loadKartSetupSession(), loadKartSetupHistory()]).then(([next, snaps]) => {
        if (!alive) return;
        setSession(next);
        setHistory(snaps);
        setReady(true);
      });
      return () => {
        alive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!ready) return;
    void saveKartSetupSession(session);
  }, [ready, session]);

  useEffect(() => {
    if (!ready) return;
    void saveKartSetupHistory(history);
  }, [history, ready]);

  const setSetup = (patch: Partial<ChassisSetup>) => {
    setSession((prev) => ({ ...prev, setup: { ...prev.setup, ...patch } }));
  };
  const setConditions = (patch: Partial<Conditions>) => {
    setSession((prev) => ({ ...prev, conditions: { ...prev.conditions, ...patch } }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.notice}>
        Full day sheet for engineers. Same session the advisor uses. Change one thing, then go back out.
      </Text>
      <KartSetupVenuePanel
        session={session}
        history={history}
        onConditions={setConditions}
        onRestore={(snapshot) => setSession(restoreSnapshot(snapshot))}
        onHistoryChange={setHistory}
        onSeeAll={(trackId, trackName) => navigation.navigate('KartSetupHistory', { trackId, trackName })}
      />
      <KartSetupWeatherImport conditions={session.conditions} onConditions={setConditions} />
      <KartSetupSheetFields setup={session.setup} onChange={setSetup} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  notice: { color: '#93c5fd', fontSize: 14, lineHeight: 20, marginBottom: 12 },
});
