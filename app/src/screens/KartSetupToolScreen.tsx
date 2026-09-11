import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ART, SYMPTOM_ART } from '../assets/art';
import { ArtThumb } from '../components/ArtThumb';
import { KartSetupAdviceList } from '../components/KartSetupAdviceList';
import { KartSetupVenuePanel } from '../components/KartSetupVenuePanel';
import {
  SYMPTOM_LABELS,
  analyzePressures,
  analyzeTemps,
  compoundWindow,
  diagnoseDriving,
  pressureRules,
  restoreSnapshot,
  wetPaddockReminders,
  wetPresetChecklist,
  type AnalysisKind,
  type AnalysisResult,
  type ChassisSetup,
  type Conditions,
  type LimitState,
  type SetupSnapshot,
  type Symptom,
  type TyreCorner,
  type Wheelbase,
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

type Nav = NativeStackNavigationProp<RiderCoachStackParamList, 'BikeBalanceSetup'>;

const SYMPTOMS = Object.keys(SYMPTOM_LABELS) as Symptom[];
const CORNERS: { id: TyreCorner; label: string }[] = [
  { id: 'fl', label: 'FL' },
  { id: 'fr', label: 'FR' },
  { id: 'rl', label: 'RL' },
  { id: 'rr', label: 'RR' },
];

const COMPOUND_OPTIONS = Object.entries(pressureRules.compounds ?? {}).map(([value, spec]) => ({
  value,
  label: spec?.label ?? 'Unknown / not listed',
}));

function ChipRow<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; image?: ImageSourcePropType }[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, on ? styles.chipOn : null, opt.image ? styles.chipArt : null]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            {opt.image ? <ArtThumb source={opt.image} size={44} /> : null}
            <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function OptionalNum({
  label,
  value,
  onChange,
  stepHint,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  stepHint?: string;
}) {
  const [text, setText] = useState(value == null ? '' : String(value));

  useEffect(() => {
    setText(value == null ? '' : String(value));
  }, [value]);

  const commit = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed === '.' || trimmed === '-' || trimmed === '-.') {
      onChange(null);
      return;
    }
    const n = Number(trimmed);
    onChange(Number.isFinite(n) ? n : null);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        inputMode="decimal"
        placeholder={stepHint ?? '—'}
        placeholderTextColor="#64748b"
        value={text}
        onChangeText={setText}
        onEndEditing={commit}
        onBlur={commit}
      />
    </View>
  );
}

export function KartSetupToolScreen() {
  const navigation = useNavigation<Nav>();
  const [session, setSession] = useState<KartSetupSession>(defaultKartSetupSession);
  const [history, setHistory] = useState<SetupSnapshot[]>([]);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<AnalysisKind>('driving');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [ran, setRan] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void Promise.all([loadKartSetupSession(), loadKartSetupHistory()]).then(([next, snaps]) => {
        if (!alive) return;
        setSession(next);
        setHistory(snaps);
        setReady(true);
        setRan(false);
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

  const setSetup = useCallback((patch: Partial<ChassisSetup>) => {
    setRan(false);
    setSession((prev) => ({ ...prev, setup: { ...prev.setup, ...patch } }));
  }, []);

  const setConditions = useCallback((patch: Partial<Conditions>) => {
    setRan(false);
    setSession((prev) => ({ ...prev, conditions: { ...prev.conditions, ...patch } }));
  }, []);

  const result: AnalysisResult | null = useMemo(() => {
    if (!ran) return null;
    if (mode === 'driving') return diagnoseDriving(session.setup, session.conditions, symptoms);
    if (mode === 'pressure') return analyzePressures(session.setup, session.conditions, session.pressures);
    return analyzeTemps(session.setup, session.conditions, session.temps);
  }, [ran, mode, session, symptoms]);

  const window = compoundWindow(session.setup);
  const wetItems = session.conditions.wet ? wetPresetChecklist(session.setup) : [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.notice}>
        Advisor for symptoms, pressures, and tyre temps. This is not a lap-time predictor. Confirm
        it is not the driver before rewriting the chassis. Change one thing, then go back out.
      </Text>

      <Text style={styles.section}>Track</Text>
      <KartSetupVenuePanel
        session={session}
        history={history}
        onConditions={setConditions}
        onRestore={(snapshot) => {
          setRan(false);
          setSession(restoreSnapshot(snapshot));
        }}
        onHistoryChange={setHistory}
        onSeeAll={(trackId, trackName) =>
          navigation.navigate('KartSetupHistory', { trackId, trackName })
        }
      />

      <Text style={styles.section}>On the kart now</Text>
      <Text style={styles.fieldLabel}>Wheelbase</Text>
      <ChipRow
        value={session.setup.wheelbase}
        options={[
          { value: '1050' as Wheelbase, label: '1050' },
          { value: '950' as Wheelbase, label: '950' },
          { value: 'bambino' as Wheelbase, label: 'Bambino' },
        ]}
        onChange={(wheelbase) => setSetup({ wheelbase })}
      />
      <Text style={styles.fieldLabel}>Front track</Text>
      <ChipRow
        value={session.setup.frontTrack}
        options={[
          { value: 'min' as LimitState, label: 'Narrow' },
          { value: 'mid' as LimitState, label: 'Mid' },
          { value: 'max' as LimitState, label: 'Wide' },
        ]}
        onChange={(frontTrack) => setSetup({ frontTrack })}
      />
      <Text style={styles.fieldLabel}>Caster</Text>
      <ChipRow
        value={session.setup.caster}
        options={[
          { value: 'min' as LimitState, label: 'Low' },
          { value: 'mid' as LimitState, label: 'Mid' },
          { value: 'max' as LimitState, label: 'High' },
        ]}
        onChange={(caster) => setSetup({ caster })}
      />
      <Text style={styles.fieldLabel}>Axle</Text>
      <ChipRow
        value={session.setup.axleStiffness}
        options={[
          { value: 'soft', label: 'Soft' },
          { value: 'medium', label: 'Medium' },
          { value: 'stiff', label: 'Stiff' },
        ]}
        onChange={(axleStiffness) => setSetup({ axleStiffness })}
      />
      <Text style={styles.fieldLabel}>Tyre compound</Text>
      <ChipRow
        value={session.setup.tyreCompound}
        options={COMPOUND_OPTIONS}
        onChange={(tyreCompound) => {
          const kind = pressureRules.compounds?.[tyreCompound]?.type;
          setSetup({
            tyreCompound,
            tyreType: kind === 'wet' || kind === 'slick' ? kind : session.setup.tyreType,
          });
        }}
      />
      {window ? (
        <View style={styles.hintRow}>
          <ArtThumb source={ART.pressureCompoundWindow} size={52} />
          <Text style={styles.hint}>
            {window.label}: {window.coldBar.min.toFixed(2)}–{window.coldBar.max.toFixed(2)} bar cold (
            {window.coldPsi.min}–{window.coldPsi.max} psi).
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>Unknown compound uses the generic 0.8–1.5 bar band.</Text>
      )}

      <Text style={styles.section}>Weather</Text>
      <Text style={styles.fieldLabel}>Grip</Text>
      <ChipRow
        value={session.conditions.grip}
        options={[
          { value: 'green', label: 'Green / low', image: ART.gripGreen },
          { value: 'normal', label: 'Normal dry', image: ART.gripNormal },
          { value: 'rubbered', label: 'Rubbered / high', image: ART.gripRubbered },
        ]}
        onChange={(grip) => setConditions({ grip })}
      />
      <Text style={styles.fieldLabel}>Surface</Text>
      <ChipRow
        value={session.conditions.wet ? 'wet' : 'dry'}
        options={[
          { value: 'dry', label: 'Dry', image: ART.tyreSlick },
          { value: 'wet', label: 'Wet', image: ART.tyreWet },
        ]}
        onChange={(surface) => setConditions({ wet: surface === 'wet' })}
      />
      <View style={styles.row}>
        <OptionalNum
          label="Air °C"
          value={session.conditions.airTempC}
          onChange={(airTempC) => setConditions({ airTempC })}
        />
        <OptionalNum
          label="Track °C"
          value={session.conditions.trackTempC}
          onChange={(trackTempC) => setConditions({ trackTempC })}
        />
      </View>

      {session.conditions.wet ? (
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <ArtThumb source={ART.wetChecklist} size={64} />
            <Text style={styles.panelTitle}>Wet checklist</Text>
          </View>
          <View style={styles.hintRow}>
            <ArtThumb source={ART.leverRainMeister} size={44} />
            <Text style={styles.hint}>Rain Meister / wet helper bar — fit if the class allows it.</Text>
          </View>
          {wetItems.map((item) => (
            <Text key={item.id} style={item.matched ? styles.ok : styles.warn}>
              {item.matched ? 'Matched' : 'Check'} · {item.label} (now {item.current}, target {item.target})
            </Text>
          ))}
          {wetPaddockReminders().map((item) => (
            <Text key={item} style={styles.hint}>
              {item}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.tabs}>
        {(
          [
            ['driving', 'Driving'],
            ['pressure', 'Pressures'],
            ['temperature', 'Temps'],
          ] as const
        ).map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[styles.tab, mode === id ? styles.tabOn : null]}
            onPress={() => {
              setMode(id);
              setRan(false);
            }}
          >
            <Text style={[styles.tabText, mode === id ? styles.tabTextOn : null]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === 'driving' ? (
        <View>
          <Text style={styles.panelTitle}>Behaviour in corners</Text>
          <View style={styles.chipWrap}>
            {SYMPTOMS.map((symptom) => {
              const on = symptoms.includes(symptom);
              const art = SYMPTOM_ART[symptom];
              return (
                <TouchableOpacity
                  key={symptom}
                  style={[styles.chip, on ? styles.chipOn : null, art ? styles.chipArt : null]}
                  onPress={() => {
                    setRan(false);
                    setSymptoms((current) =>
                      current.includes(symptom)
                        ? current.filter((s) => s !== symptom)
                        : [...current, symptom]
                    );
                  }}
                >
                  {art ? <ArtThumb source={art} size={48} /> : null}
                  <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>
                    {SYMPTOM_LABELS[symptom]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {mode === 'pressure' ? (
        <View>
          <View style={styles.panelHead}>
            <ArtThumb source={ART.pressureColdHot} size={64} />
            <ArtThumb source={ART.chassisPlanCorners} size={64} />
            <Text style={styles.panelTitle}>Cold / hot pressures (bar)</Text>
          </View>
          <View style={styles.grid}>
            {CORNERS.map((corner) => (
              <OptionalNum
                key={`${corner.id}-c`}
                label={`${corner.label} cold`}
                stepHint="0.05"
                value={session.pressures.cold[corner.id]}
                onChange={(v) => {
                  setRan(false);
                  setSession((prev) => ({
                    ...prev,
                    pressures: {
                      ...prev.pressures,
                      cold: { ...prev.pressures.cold, [corner.id]: v },
                    },
                  }));
                }}
              />
            ))}
            {CORNERS.map((corner) => (
              <OptionalNum
                key={`${corner.id}-h`}
                label={`${corner.label} hot`}
                stepHint="0.05"
                value={session.pressures.hot[corner.id]}
                onChange={(v) => {
                  setRan(false);
                  setSession((prev) => ({
                    ...prev,
                    pressures: {
                      ...prev.pressures,
                      hot: { ...prev.pressures.hot, [corner.id]: v },
                    },
                  }));
                }}
              />
            ))}
          </View>
        </View>
      ) : null}

      {mode === 'temperature' ? (
        <View>
          <View style={styles.panelHead}>
            <ArtThumb source={ART.tempLegendOmi} size={64} />
            <ArtThumb source={ART.chassisPlanCorners} size={64} />
            <Text style={styles.panelTitle}>Pyrometer °C (outside / middle / inside)</Text>
          </View>
          {CORNERS.map((corner) => (
            <View key={corner.id} style={styles.row}>
              <OptionalNum
                label={`${corner.label} out`}
                value={session.temps[corner.id].outside}
                onChange={(outside) => {
                  setRan(false);
                  setSession((prev) => ({
                    ...prev,
                    temps: {
                      ...prev.temps,
                      [corner.id]: { ...prev.temps[corner.id], outside },
                    },
                  }));
                }}
              />
              <OptionalNum
                label={`${corner.label} mid`}
                value={session.temps[corner.id].middle}
                onChange={(middle) => {
                  setRan(false);
                  setSession((prev) => ({
                    ...prev,
                    temps: {
                      ...prev.temps,
                      [corner.id]: { ...prev.temps[corner.id], middle },
                    },
                  }));
                }}
              />
              <OptionalNum
                label={`${corner.label} in`}
                value={session.temps[corner.id].inside}
                onChange={(inside) => {
                  setRan(false);
                  setSession((prev) => ({
                    ...prev,
                    temps: {
                      ...prev.temps,
                      [corner.id]: { ...prev.temps[corner.id], inside },
                    },
                  }));
                }}
              />
            </View>
          ))}
        </View>
      ) : null}

      <TouchableOpacity style={styles.run} onPress={() => setRan(true)} activeOpacity={0.85}>
        <Text style={styles.runText}>Run analysis</Text>
      </TouchableOpacity>

      {result ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Advice</Text>
          <KartSetupAdviceList result={result} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  notice: { color: '#93c5fd', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  section: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 8,
  },
  fieldLabel: { color: '#e2e8f0', fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  hint: { color: '#94a3b8', fontSize: 12, lineHeight: 17, marginBottom: 8, flex: 1 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
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
  chipArt: { alignItems: 'center', minWidth: 92, paddingVertical: 10 },
  chipText: { color: '#cbd5e1', fontSize: 13, fontWeight: '600' },
  chipTextOn: { color: '#fde68a' },
  row: { flexDirection: 'row', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  field: { flex: 1, minWidth: 70, marginBottom: 10 },
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
  tabs: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabOn: { borderColor: '#f59e0b' },
  tabText: { color: '#cbd5e1', fontWeight: '700' },
  tabTextOn: { color: '#fde68a' },
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
  ok: { color: '#86efac', fontSize: 13, marginBottom: 4 },
  warn: { color: '#fbbf24', fontSize: 13, marginBottom: 4 },
  run: {
    marginTop: 8,
    marginBottom: 16,
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runText: { color: '#0f172a', fontSize: 17, fontWeight: '800' },
});
