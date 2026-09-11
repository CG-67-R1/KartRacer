import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { ART } from '../assets/art';
import { ArtThumb } from '../components/ArtThumb';
import { getTrackById } from '../data/tracks';
import {
  analyzeLogger,
  createSnapshot,
  firstGpsFix,
  formatLapTime,
  formatSnapshotLapSummary,
  lapTableRows,
  parseLoggerCsv,
  sessionConsistency,
  snapshotLapSummary,
  upsertSnapshot,
  type Conditions,
  type DistancePoint,
  type DriverChassisVerdict,
  type LoggerAnalysis,
  type LoggerLap,
} from '../lib/setupEngine';
import { findTrackByLocation } from '../location/trackGeofenceMatch';
import {
  loadKartSetupHistory,
  loadKartSetupSession,
  saveKartSetupHistory,
  saveKartSetupSession,
} from '../storage/kartSetup';
import { pickLoggerCsv } from '../utils/pickLoggerCsv';
import type { RiderCoachStackParamList } from './RiderCoachScreen';

type Nav = NativeStackNavigationProp<RiderCoachStackParamList, 'KartSessionUpload'>;

const VERDICT_KIND: Record<DriverChassisVerdict['kind'], string> = {
  driver: 'Driver',
  chassis: 'Chassis',
  engine: 'Engine',
  gearing: 'Gearing',
  mixed: 'Mixed',
  insufficient: 'Need more data',
};

function catalogDirection(
  direction: string | undefined
): Conditions['trackDirection'] | undefined {
  if (direction === 'clockwise' || direction === 'anticlockwise') return direction;
  return undefined;
}

function SpeedOverlay({
  best,
  compare,
}: {
  best: DistancePoint[];
  compare: DistancePoint[] | null;
}) {
  const w = 320;
  const h = 120;
  const pad = 8;
  const speeds = [...best, ...(compare ?? [])].map((p) => p.speedKmh);
  if (speeds.length < 2) return null;
  const min = Math.min(...speeds);
  const max = Math.max(...speeds);
  const x = (d: number) => pad + d * (w - 2 * pad);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (h - 2 * pad);
  const path = (pts: DistancePoint[]) =>
    pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.dist).toFixed(1)},${y(p.speedKmh).toFixed(1)}`).join(' ');
  return (
    <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} accessibilityLabel="Speed overlay">
      <Path d={path(best)} fill="none" stroke="#f59e0b" strokeWidth="2.2" />
      {compare ? <Path d={path(compare)} fill="none" stroke="#e2e8f0" strokeWidth="1.8" opacity={0.85} /> : null}
    </Svg>
  );
}

export function KartSessionUploadScreen() {
  const navigation = useNavigation<Nav>();
  const [fileName, setFileName] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<LoggerAnalysis | null>(null);
  const [pickedLaps, setPickedLaps] = useState<number[]>([]);
  const [suggested, setSuggested] = useState<{ trackId: string; name: string } | null>(null);
  const [taggedName, setTaggedName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const consistency = useMemo(() => (analysis ? sessionConsistency(analysis) : null), [analysis]);
  const table = useMemo(() => (analysis ? lapTableRows(analysis) : []), [analysis]);

  const applyFile = useCallback(async (name: string, text: string) => {
    const parsed = parseLoggerCsv(text);
    const next = analyzeLogger(parsed.samples);
    setFileName(name);
    setWarnings([...parsed.warnings, ...next.warnings]);
    setAnalysis(next);
    setFlash(null);

    const start: number[] = [];
    if (next.bestLapIndex != null) start.push(next.laps[next.bestLapIndex].index);
    if (next.compareLapIndex != null) {
      const cmp = next.laps[next.compareLapIndex].index;
      if (!start.includes(cmp)) start.push(cmp);
    }
    setPickedLaps(start.slice(0, 2));

    const session = await loadKartSetupSession();
    const gps = firstGpsFix(parsed.samples);
    const match = gps ? findTrackByLocation(gps.lat, gps.lon) : null;
    if (match && match.trackId !== session.conditions.trackId) {
      setSuggested({ trackId: match.trackId, name: match.name });
      setTaggedName(session.conditions.trackName);
    } else {
      setSuggested(null);
      setTaggedName(match?.name ?? session.conditions.trackName);
    }
  }, []);

  const onPick = useCallback(async () => {
    setBusy(true);
    try {
      const picked = await pickLoggerCsv();
      if (!picked) return;
      if (picked.kind === 'zip') {
        setFileName(picked.name);
        setAnalysis(null);
        setSuggested(null);
        setTaggedName(null);
        setPickedLaps([]);
        setWarnings(['Unzip the Alfano/ADA archive and upload the CSV. Zip is not parsed in this build.']);
        return;
      }
      await applyFile(picked.name, picked.text);
    } finally {
      setBusy(false);
    }
  }, [applyFile]);

  const toggleLap = useCallback((lap: number) => {
    setPickedLaps((current) => {
      if (current.includes(lap)) return current.filter((n) => n !== lap);
      if (current.length < 2) return [...current, lap];
      return [current[1], lap];
    });
  }, []);

  const selectedLaps: LoggerLap[] = useMemo(() => {
    if (!analysis) return [];
    return pickedLaps
      .map((index) => analysis.laps.find((lap) => lap.index === index))
      .filter((lap): lap is LoggerLap => lap != null);
  }, [analysis, pickedLaps]);

  const tagTrack = useCallback(async () => {
    if (!suggested) return;
    const session = await loadKartSetupSession();
    const catalog = getTrackById(suggested.trackId);
    const direction = catalogDirection(catalog?.direction);
    await saveKartSetupSession({
      ...session,
      conditions: {
        ...session.conditions,
        trackId: suggested.trackId,
        trackName: catalog?.name ?? suggested.name,
        ...(direction ? { trackDirection: direction } : {}),
      },
    });
    const name = catalog?.name ?? suggested.name;
    setTaggedName(name);
    setFlash(`Tagged the current sheet as ${name}.`);
    setSuggested(null);
  }, [suggested]);

  const attachSnapshot = useCallback(async () => {
    if (!analysis) return;
    const [session, history] = await Promise.all([loadKartSetupSession(), loadKartSetupHistory()]);
    const summary = snapshotLapSummary(analysis);
    const snapshot = createSnapshot({
      setup: session.setup,
      conditions: session.conditions,
      pressures: session.pressures,
      temps: session.temps,
      label: fileName ? `${session.setup.name} · ${fileName}` : undefined,
      note: formatSnapshotLapSummary(summary),
      lapSummary: summary,
    });
    await saveKartSetupHistory(upsertSnapshot(history, snapshot));
    setFlash('Snapshot saved with lap evidence. Open Setup History to compare.');
  }, [analysis, fileName]);

  const venueLabel = taggedName ?? suggested?.name;
  const best = analysis?.bestLapIndex != null ? analysis.laps[analysis.bestLapIndex] : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.panelHead}>
        <ArtThumb source={ART.tabLogger} size={64} />
        <Text style={styles.notice}>
          Upload a MyChron Race Studio 3 CSV (all channels). Laps are computed on this device. The
          raw file is never sent to a language model, and this is not a lap-time predictor.
        </Text>
      </View>

      <TouchableOpacity style={styles.primary} onPress={() => void onPick()} disabled={busy}>
        <Text style={styles.primaryText}>{busy ? 'Opening…' : 'Choose CSV'}</Text>
      </TouchableOpacity>
      {fileName ? <Text style={styles.hint}>File: {fileName}</Text> : null}

      {warnings.map((warning) => (
        <Text key={warning} style={styles.warn}>
          {warning}
        </Text>
      ))}

      {suggested ? (
        <View style={styles.detect}>
          <Text style={styles.detectText}>Tag this session to {suggested.name}?</Text>
          <Text style={styles.hint}>GPS in the log matches this catalog track. Does not overwrite until you confirm.</Text>
          <TouchableOpacity style={styles.detectBtn} onPress={() => void tagTrack()}>
            <Text style={styles.detectBtnText}>Use {suggested.name}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {analysis && consistency ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Session</Text>
          <Text style={styles.body}>
            {venueLabel ? `${venueLabel} · ` : ''}
            {consistency.lapCount} timed lap{consistency.lapCount === 1 ? '' : 's'}
            {best ? ` · best ${formatLapTime(best.timeS)}` : ''}
            {consistency.consistencyPct != null
              ? ` · ${Math.round(consistency.consistencyPct)}% consistent`
              : ''}
          </Text>
          <Text style={styles.hint}>
            {analysis.sampleCount} samples. Consistency is how close the typical lap is to the best —
            not a race result.
          </Text>
          {consistency.insights.map((insight) => (
            <View key={insight.id} style={styles.insight}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.body}>{insight.detail}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {analysis && table.length > 0 ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Laps</Text>
          <Text style={styles.hint}>Tap two laps to compare. Yellow is selected.</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.cell, styles.cellLap, styles.cellHead]}>Lap</Text>
            <Text style={[styles.cell, styles.cellHead]}>Time</Text>
            <Text style={[styles.cell, styles.cellHead]}>+Best</Text>
            <Text style={[styles.cell, styles.cellHead]}>Top</Text>
            <Text style={[styles.cell, styles.cellHead]}>Min</Text>
          </View>
          {table.map((row) => {
            const on = pickedLaps.includes(row.lap);
            const isBest = analysis.bestLapIndex != null && analysis.laps[analysis.bestLapIndex]?.index === row.lap;
            return (
              <TouchableOpacity
                key={row.lap}
                style={[styles.tableRow, on ? styles.tableRowOn : null]}
                onPress={() => toggleLap(row.lap)}
              >
                <Text style={[styles.cell, styles.cellLap]}>
                  {row.lap}
                  {isBest ? ' ★' : ''}
                </Text>
                <Text style={styles.cell}>{row.time}</Text>
                <Text style={styles.cell}>{row.deltaToBest}</Text>
                <Text style={styles.cell}>{row.topSpeed}</Text>
                <Text style={styles.cell}>{row.minSpeed}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {selectedLaps.length === 2 ? (
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <ArtThumb source={ART.loggerTrace} size={52} />
            <Text style={styles.panelTitle}>
              Lap {selectedLaps[0].index} vs lap {selectedLaps[1].index}
            </Text>
          </View>
          <Text style={styles.body}>
            Δ time {(selectedLaps[1].timeS - selectedLaps[0].timeS).toFixed(3)} s
            {selectedLaps[0].maxSpeedKmh != null && selectedLaps[1].maxSpeedKmh != null
              ? ` · top ${selectedLaps[0].maxSpeedKmh.toFixed(0)} vs ${selectedLaps[1].maxSpeedKmh.toFixed(0)} km/h`
              : ''}
            {selectedLaps[0].minSpeedKmh != null && selectedLaps[1].minSpeedKmh != null
              ? ` · min ${selectedLaps[0].minSpeedKmh.toFixed(0)} vs ${selectedLaps[1].minSpeedKmh.toFixed(0)} km/h`
              : ''}
          </Text>
          <SpeedOverlay
            best={selectedLaps[0].trace}
            compare={selectedLaps[1].trace}
          />
          <Text style={styles.hint}>Amber = first selected lap · white = second. Speed vs lap distance.</Text>
        </View>
      ) : null}

      {analysis && analysis.verdicts.length > 0 ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Driver vs chassis</Text>
          {analysis.verdicts.map((verdict) => (
            <View key={`${verdict.kind}-${verdict.title}`} style={styles.verdict}>
              <Text style={styles.kicker}>{VERDICT_KIND[verdict.kind]}</Text>
              <Text style={styles.verdictTitle}>{verdict.title}</Text>
              <Text style={styles.body}>{verdict.why}</Text>
              <Text style={styles.source}>Source: {verdict.kbSource}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {analysis ? (
        <TouchableOpacity style={styles.save} onPress={() => void attachSnapshot()}>
          <Text style={styles.saveText}>Attach to snapshot</Text>
        </TouchableOpacity>
      ) : null}
      {flash ? <Text style={styles.ok}>{flash}</Text> : null}

      {analysis ? (
        <TouchableOpacity onPress={() => navigation.navigate('KartSetupHistory', {})}>
          <Text style={styles.link}>Open Setup History</Text>
        </TouchableOpacity>
      ) : null}

      {!analysis && warnings.length === 0 ? (
        <Text style={styles.hint}>
          Need Time plus GPS Speed or RPM. MyChron Race Studio 3 “all channels” CSV works. This does
          not promise a lap time from setup.
        </Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  notice: { color: '#93c5fd', fontSize: 14, lineHeight: 20, flex: 1 },
  hint: { color: '#94a3b8', fontSize: 12, lineHeight: 17, marginBottom: 8 },
  warn: { color: '#fbbf24', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  ok: { color: '#86efac', fontSize: 13, marginBottom: 8 },
  body: { color: '#e2e8f0', fontSize: 14, lineHeight: 20, marginBottom: 6 },
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
  primary: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryText: { color: '#0f172a', fontSize: 17, fontWeight: '800' },
  save: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  saveText: { color: '#f8fafc', fontSize: 16, fontWeight: '800' },
  detect: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
    padding: 12,
    marginBottom: 12,
  },
  detectText: { color: '#e0f2fe', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  detectBtn: {
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  detectBtnText: { color: '#0f172a', fontWeight: '800' },
  insight: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
    marginTop: 8,
  },
  insightTitle: { color: '#fde68a', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tableHead: { flexDirection: 'row', marginBottom: 4 },
  tableRow: {
    flexDirection: 'row',
    minHeight: 44,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingVertical: 8,
  },
  tableRowOn: { backgroundColor: 'rgba(245,158,11,0.12)' },
  cell: { flex: 1, color: '#e2e8f0', fontSize: 12 },
  cellLap: { flex: 0.6, fontWeight: '700' },
  cellHead: { color: '#94a3b8', fontWeight: '700' },
  verdict: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
    marginTop: 8,
  },
  kicker: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  verdictTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  source: { color: '#64748b', fontSize: 11 },
  link: { color: '#fbbf24', fontSize: 14, fontWeight: '700', marginBottom: 8 },
});
