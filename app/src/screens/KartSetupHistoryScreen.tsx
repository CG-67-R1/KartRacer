import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ART } from '../assets/art';
import { ArtThumb } from '../components/ArtThumb';
import { KeyboardAvoidingOverlay } from '../components/KeyboardSafeView';
import { TrackPicker } from '../components/TrackPicker';
import { type TrackDefinition } from '../data/tracks';
import {
  createSnapshot,
  diffSnapshots,
  diffSummary,
  formatSnapshotLapSummary,
  removeSnapshot,
  restoreSnapshot,
  snapshotsForTrack,
  upsertSnapshot,
  type SetupSnapshot,
} from '../lib/setupEngine';
import {
  defaultKartSetupSession,
  loadKartSetupHistory,
  loadKartSetupSession,
  saveKartSetupHistory,
  saveKartSetupSession,
  type KartSetupSession,
} from '../storage/kartSetup';
import type { RiderCoachStackParamList } from './RiderCoachScreen';

type Nav = NativeStackNavigationProp<RiderCoachStackParamList, 'KartSetupHistory'>;
type Route = RouteProp<RiderCoachStackParamList, 'KartSetupHistory'>;

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function gripLabel(snap: SetupSnapshot): string {
  return snap.conditions.wet ? 'wet' : snap.conditions.grip;
}

function currentAsSnapshot(session: KartSetupSession): SetupSnapshot {
  return {
    id: 'current',
    createdAt: '',
    label: 'Current sheet',
    note: '',
    setup: session.setup,
    conditions: session.conditions,
    pressures: session.pressures,
    temps: session.temps,
  };
}

export function KartSetupHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [session, setSession] = useState<KartSetupSession>(defaultKartSetupSession);
  const [history, setHistory] = useState<SetupSnapshot[]>([]);
  const [ready, setReady] = useState(false);
  const [label, setLabel] = useState('');
  const [note, setNote] = useState('');
  const [fromId, setFromId] = useState('current');
  const [toId, setToId] = useState('current');
  const [pick, setPick] = useState<'from' | 'to' | null>(null);
  const [filterOther, setFilterOther] = useState(
    () => !route.params?.trackId && Boolean(route.params?.trackName?.trim())
  );
  const [filterTrackId, setFilterTrackId] = useState<string | null>(route.params?.trackId ?? null);
  const [filterTrackName, setFilterTrackName] = useState<string | null>(
    route.params?.trackName ?? null
  );

  const reload = useCallback(async () => {
    const [nextSession, nextHistory] = await Promise.all([
      loadKartSetupSession(),
      loadKartSetupHistory(),
    ]);
    setSession(nextSession);
    setHistory(nextHistory);
    setToId((current) => {
      if (current !== 'current' && nextHistory.some((item) => item.id === current)) return current;
      return nextHistory[0]?.id ?? 'current';
    });
    setReady(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload])
  );

  const persistHistory = useCallback(async (next: SetupSnapshot[]) => {
    setHistory(next);
    await saveKartSetupHistory(next);
  }, []);

  const filtered = useMemo(() => {
    if (filterTrackId || filterTrackName?.trim()) {
      return snapshotsForTrack(history, filterTrackId, filterTrackName);
    }
    return history;
  }, [filterTrackId, filterTrackName, history]);

  const resolve = useCallback(
    (id: string): SetupSnapshot => {
      if (id === 'current') return currentAsSnapshot(session);
      return history.find((item) => item.id === id) ?? currentAsSnapshot(session);
    },
    [history, session]
  );

  const from = resolve(fromId);
  const to = resolve(toId);
  const rows = fromId === toId ? [] : diffSnapshots(from, to);
  const pickerId = filterTrackId ?? (filterOther ? 'other' : null);
  const options: SetupSnapshot[] = [currentAsSnapshot(session), ...history];

  const applyFilter = (track: TrackDefinition) => {
    if (track.isOther) {
      setFilterOther(true);
      setFilterTrackId(null);
      setFilterTrackName(null);
      return;
    }
    setFilterOther(false);
    setFilterTrackId(track.id);
    setFilterTrackName(track.name);
  };

  const save = async () => {
    const snapshot = createSnapshot({
      setup: session.setup,
      conditions: session.conditions,
      pressures: session.pressures,
      temps: session.temps,
      label: label || undefined,
      note,
    });
    await persistHistory(upsertSnapshot(history, snapshot));
    setLabel('');
    setNote('');
    setToId(snapshot.id);
  };

  const restore = (snapshot: SetupSnapshot) => {
    Alert.alert('Restore this setup?', 'Loads it into the Kart Setup Tool.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        onPress: async () => {
          const restored = restoreSnapshot(snapshot);
          setSession(restored);
          await saveKartSetupSession(restored);
          navigation.navigate('BikeBalanceSetup');
        },
      },
    ]);
  };

  const remove = (id: string) => {
    Alert.alert('Delete snapshot?', 'This only removes it from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void persistHistory(removeSnapshot(history, id));
          if (fromId === id) setFromId('current');
          if (toId === id) setToId('current');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.panelHead}>
        <ArtThumb source={ART.historySnapshot} size={64} />
        <Text style={styles.notice}>
          Snapshots stay on this device. Save before you change a lever so you can compare sessions.
        </Text>
      </View>

      <Text style={styles.section}>Filter by track</Text>
      <TrackPicker selectedTrackId={pickerId} onSelect={applyFilter} />
      {filterOther ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Venue name</Text>
          <TextInput
            style={styles.input}
            value={filterTrackName ?? ''}
            onChangeText={(value) => setFilterTrackName(value || null)}
            placeholder="Match a hand-typed venue"
            placeholderTextColor="#64748b"
          />
        </View>
      ) : null}
      {pickerId || filterTrackName?.trim() ? (
        <TouchableOpacity
          onPress={() => {
            setFilterOther(false);
            setFilterTrackId(null);
            setFilterTrackName(null);
          }}
        >
          <Text style={styles.link}>Show all snapshots</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Save current sheet</Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Label</Text>
          <TextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder={session.setup.name}
            placeholderTextColor="#64748b"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Note</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="Track, session, weather…"
            placeholderTextColor="#64748b"
          />
        </View>
        <TouchableOpacity style={styles.primary} onPress={() => void save()} disabled={!ready}>
          <Text style={styles.primaryText}>Save snapshot</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Compare sheets</Text>
        <Text style={styles.hint}>What changed between two snapshots — not a lap-time prediction.</Text>
        <TouchableOpacity style={styles.pick} onPress={() => setPick('from')}>
          <Text style={styles.fieldLabel}>From</Text>
          <Text style={styles.pickValue}>{from.label}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pick} onPress={() => setPick('to')}>
          <Text style={styles.fieldLabel}>To</Text>
          <Text style={styles.pickValue}>{to.label}</Text>
        </TouchableOpacity>
        {history.length === 0 ? (
          <Text style={styles.hint}>Save at least one snapshot to diff against the current sheet.</Text>
        ) : (
          <>
            <Text style={styles.hint}>{diffSummary(rows)}</Text>
            {rows.map((row) => (
              <Text key={row.path} style={styles.diffRow}>
                {row.label}: {row.from} → {row.to}
              </Text>
            ))}
          </>
        )}
      </View>

      <View style={styles.panel}>
        <View style={styles.panelHead}>
          <ArtThumb source={ART.historyTrack} size={52} />
          <Text style={styles.panelTitle}>History</Text>
        </View>
        {!ready ? <Text style={styles.hint}>Loading…</Text> : null}
        {ready && filtered.length === 0 ? (
          <Text style={styles.hint}>
            {filterTrackId || filterTrackName?.trim()
              ? 'No snapshots at this track yet.'
              : 'No snapshots yet.'}
          </Text>
        ) : null}
        {filtered.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <Text style={styles.historyLabel}>{item.label}</Text>
            <Text style={styles.hint}>
              {formatWhen(item.createdAt)} · {item.setup.wheelbase} · {gripLabel(item)}
              {item.conditions.trackName ? ` · ${item.conditions.trackName}` : ''}
            </Text>
            {item.note ? <Text style={styles.hint}>{item.note}</Text> : null}
            {item.lapSummary ? (
              <Text style={styles.hint}>{formatSnapshotLapSummary(item.lapSummary)}</Text>
            ) : null}
            <View style={styles.rowActions}>
              <TouchableOpacity onPress={() => restore(item)}>
                <Text style={styles.link}>Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={styles.danger}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <Modal visible={pick != null} transparent animationType="slide">
        <KeyboardAvoidingOverlay style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choose snapshot</Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.option}
                  onPress={() => {
                    if (pick === 'from') setFromId(item.id);
                    if (pick === 'to') setToId(item.id);
                    setPick(null);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                  {item.createdAt ? (
                    <Text style={styles.hint}>{formatWhen(item.createdAt)}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancel} onPress={() => setPick(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingOverlay>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  notice: { color: '#93c5fd', fontSize: 14, lineHeight: 20, flex: 1 },
  section: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },
  panel: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  panelHead: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  panelTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', flex: 1, minWidth: 120 },
  field: { marginBottom: 10 },
  fieldLabel: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 44,
  },
  hint: { color: '#94a3b8', fontSize: 12, lineHeight: 17, marginBottom: 8 },
  primary: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  pick: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  pickValue: { color: '#f8fafc', fontSize: 15, fontWeight: '600' },
  diffRow: { color: '#e2e8f0', fontSize: 12, marginBottom: 4 },
  historyItem: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 8,
  },
  historyLabel: { color: '#f8fafc', fontSize: 15, fontWeight: '700' },
  rowActions: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  link: { color: '#fbbf24', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  danger: { color: '#f87171', fontSize: 14, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    padding: 20,
  },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: '#f8fafc', marginBottom: 12 },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  optionText: { fontSize: 16, fontWeight: '600', color: '#f8fafc' },
  cancel: { paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  cancelText: { fontSize: 16, color: '#94a3b8', fontWeight: '600' },
});
