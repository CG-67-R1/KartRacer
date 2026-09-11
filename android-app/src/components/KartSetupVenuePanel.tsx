import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ART } from '../assets/art';
import { ArtThumb } from './ArtThumb';
import { TrackPicker } from './TrackPicker';
import { getTrackById, type TrackDefinition } from '../data/tracks';
import {
  createSnapshot,
  diffSnapshots,
  diffSummary,
  formatSnapshotLapSummary,
  snapshotsForTrack,
  upsertSnapshot,
  type Conditions,
  type SetupSnapshot,
  type TrackDirection,
} from '../lib/setupEngine';
import {
  detectTrackAtCurrentLocation,
  requestForegroundLocationPermission,
} from '../location/trackGeofence';
import { type KartSetupSession } from '../storage/kartSetup';

const HERE_BEFORE_CAP = 5;

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function gripLabel(conditions: Conditions): string {
  return conditions.wet ? 'wet' : conditions.grip;
}

function catalogDirection(track: TrackDefinition): TrackDirection | undefined {
  if (track.direction === 'clockwise' || track.direction === 'anticlockwise') {
    return track.direction;
  }
  return undefined;
}

export function KartSetupVenuePanel({
  session,
  history,
  onConditions,
  onRestore,
  onHistoryChange,
  onSeeAll,
}: {
  session: KartSetupSession;
  history: SetupSnapshot[];
  onConditions: (patch: Partial<Conditions>) => void;
  onRestore: (snapshot: SetupSnapshot) => void;
  onHistoryChange: (history: SetupSnapshot[]) => void;
  onSeeAll: (trackId: string | null, trackName: string | null) => void;
}) {
  const [otherOpen, setOtherOpen] = useState(
    () => !session.conditions.trackId && Boolean(session.conditions.trackName?.trim())
  );
  const [detected, setDetected] = useState<{ trackId: string; name: string } | null>(null);
  const [detectHint, setDetectHint] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [label, setLabel] = useState('');
  const [note, setNote] = useState('');
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);

  useEffect(() => {
    if (!session.conditions.trackId && session.conditions.trackName?.trim()) {
      setOtherOpen(true);
    }
  }, [session.conditions.trackId, session.conditions.trackName]);

  const runDetect = useCallback(async (requestPermission: boolean) => {
    setDetectHint(null);
    setDetecting(true);
    try {
      if (requestPermission) {
        const granted = await requestForegroundLocationPermission();
        if (!granted) {
          setDetectHint(
            Platform.OS === 'web'
              ? 'Track detect works on a phone at the circuit.'
              : 'Location permission is needed to detect the track.'
          );
          return;
        }
      }
      const found = await detectTrackAtCurrentLocation();
      if (found) {
        setDetected({ trackId: found.match.trackId, name: found.match.name });
        return;
      }
      if (requestPermission) {
        setDetectHint(
          Platform.OS === 'web'
            ? 'Track detect works on a phone at the circuit.'
            : 'No catalog track near this location.'
        );
      }
    } catch {
      if (requestPermission) setDetectHint('Could not read location.');
    } finally {
      setDetecting(false);
    }
  }, []);

  useEffect(() => {
    void runDetect(false);
  }, [runDetect]);

  const pickerId = session.conditions.trackId ?? (otherOpen ? 'other' : null);
  const venueReady = Boolean(session.conditions.trackId || session.conditions.trackName?.trim());
  const atThisTrack = useMemo(
    () => snapshotsForTrack(history, session.conditions.trackId, session.conditions.trackName),
    [history, session.conditions.trackId, session.conditions.trackName]
  );
  const inline = atThisTrack.slice(0, HERE_BEFORE_CAP);
  const showDetect = Boolean(detected && detected.trackId !== session.conditions.trackId);

  const applyTrack = useCallback(
    (track: TrackDefinition) => {
      if (track.isOther) {
        setOtherOpen(true);
        onConditions({ trackId: null, trackName: null });
        return;
      }
      setOtherOpen(false);
      const direction = catalogDirection(track);
      onConditions({
        trackId: track.id,
        trackName: track.name,
        ...(direction ? { trackDirection: direction } : {}),
      });
    },
    [onConditions]
  );

  const confirmDetected = useCallback(() => {
    if (!detected) return;
    const catalog = getTrackById(detected.trackId);
    if (catalog) {
      applyTrack(catalog);
      return;
    }
    setOtherOpen(false);
    onConditions({ trackId: detected.trackId, trackName: detected.name });
  }, [applyTrack, detected, onConditions]);

  const saveSnapshot = useCallback(() => {
    const snapshot = createSnapshot({
      setup: session.setup,
      conditions: session.conditions,
      pressures: session.pressures,
      temps: session.temps,
      label: label || undefined,
      note,
    });
    onHistoryChange(upsertSnapshot(history, snapshot));
    setLabel('');
    setNote('');
    setSavedFlash('Snapshot saved on this device.');
  }, [history, label, note, onHistoryChange, session]);

  const currentAsSnap: SetupSnapshot = useMemo(
    () => ({
      id: 'current',
      createdAt: '',
      label: 'Current sheet',
      note: '',
      setup: session.setup,
      conditions: session.conditions,
      pressures: session.pressures,
      temps: session.temps,
    }),
    [session]
  );

  return (
    <View>
      <View style={styles.panelHead}>
        <ArtThumb source={ART.historyTrack} size={64} />
        <Text style={styles.panelTitle}>Track</Text>
      </View>
      <TrackPicker selectedTrackId={pickerId} onSelect={applyTrack} />
      {pickerId ? (
        <TouchableOpacity
          onPress={() => {
            setOtherOpen(false);
            onConditions({ trackId: null, trackName: null });
          }}
        >
          <Text style={styles.link}>Clear track</Text>
        </TouchableOpacity>
      ) : null}

      {otherOpen ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Venue name</Text>
          <TextInput
            style={styles.input}
            value={session.conditions.trackName ?? ''}
            onChangeText={(trackName) => onConditions({ trackName: trackName || null })}
            placeholder="e.g. club day / private hire"
            placeholderTextColor="#64748b"
          />
        </View>
      ) : null}

      {pickerId ? (
        <>
          <Text style={styles.fieldLabel}>Direction</Text>
          <View style={styles.chipWrap}>
            {(
              [
                ['clockwise', 'Clockwise'],
                ['anticlockwise', 'Anti-clockwise'],
              ] as const
            ).map(([value, text]) => {
              const on = session.conditions.trackDirection === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.chip, on ? styles.chipOn : null]}
                  onPress={() => onConditions({ trackDirection: value })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                >
                  <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>{text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      ) : null}

      {showDetect && detected ? (
        <View style={styles.detect}>
          <Text style={styles.detectText}>Detected: {detected.name}</Text>
          <TouchableOpacity style={styles.detectBtn} onPress={confirmDetected}>
            <Text style={styles.detectBtnText}>Use this track</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.secondary}
        onPress={() => void runDetect(true)}
        disabled={detecting}
      >
        <Text style={styles.secondaryText}>{detecting ? 'Checking location…' : 'Detect nearby track'}</Text>
      </TouchableOpacity>
      {detectHint ? <Text style={styles.hint}>{detectHint}</Text> : null}

      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Snapshot label (optional)</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder={session.setup.name}
          placeholderTextColor="#64748b"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Note (optional)</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Session, weather, what you changed…"
          placeholderTextColor="#64748b"
        />
      </View>
      <TouchableOpacity style={styles.save} onPress={saveSnapshot}>
        <Text style={styles.saveText}>Save snapshot</Text>
      </TouchableOpacity>
      {savedFlash ? <Text style={styles.ok}>{savedFlash}</Text> : null}

      {venueReady ? (
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <ArtThumb source={ART.historySnapshot} size={52} />
            <Text style={styles.panelTitle}>Here before</Text>
          </View>
          {inline.length === 0 ? (
            <Text style={styles.hint}>
              First time at this track — save a snapshot after the session.
            </Text>
          ) : (
            inline.map((item) => {
              const comparing = compareId === item.id;
              const rows = comparing ? diffSnapshots(currentAsSnap, item) : [];
              return (
                <View key={item.id} style={styles.historyItem}>
                  <Text style={styles.historyLabel}>{item.label}</Text>
                  <Text style={styles.hint}>
                    {formatWhen(item.createdAt)} · {gripLabel(item.conditions)}
                    {item.note ? ` · ${item.note}` : ''}
                  </Text>
                  {item.lapSummary ? (
                    <Text style={styles.hint}>{formatSnapshotLapSummary(item.lapSummary)}</Text>
                  ) : null}
                  <View style={styles.rowActions}>
                    <TouchableOpacity onPress={() => onRestore(item)}>
                      <Text style={styles.link}>Restore</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCompareId(comparing ? null : item.id)}>
                      <Text style={styles.link}>{comparing ? 'Hide compare' : 'Compare to current'}</Text>
                    </TouchableOpacity>
                  </View>
                  {comparing ? (
                    <View style={styles.diffBox}>
                      <Text style={styles.hint}>{diffSummary(rows)}</Text>
                      {rows.slice(0, 8).map((row) => (
                        <Text key={row.path} style={styles.diffRow}>
                          {row.label}: {row.from} → {row.to}
                        </Text>
                      ))}
                      {rows.length > 8 ? (
                        <Text style={styles.hint}>+{rows.length - 8} more in History</Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
          <TouchableOpacity
            onPress={() => onSeeAll(session.conditions.trackId, session.conditions.trackName)}
          >
            <Text style={styles.link}>See all in History</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.hint}>Pick a track to see setups you have saved here before.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  fieldLabel: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 44,
  },
  hint: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipOn: { borderColor: '#f59e0b', backgroundColor: '#422006' },
  chipText: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  chipTextOn: { color: '#fde68a' },
  detect: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 12,
    marginBottom: 10,
  },
  detectText: { color: '#e0f2fe', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  detectBtn: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectBtnText: { color: '#0f172a', fontWeight: '800' },
  secondary: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  secondaryText: { color: '#cbd5e1', fontWeight: '700' },
  save: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveText: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  ok: { color: '#86efac', fontSize: 13, marginBottom: 8 },
  historyItem: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 8,
  },
  historyLabel: { color: '#f8fafc', fontSize: 14, fontWeight: '700' },
  rowActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 6 },
  link: { color: '#fbbf24', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  diffBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  diffRow: { color: '#e2e8f0', fontSize: 12, marginBottom: 4 },
});
