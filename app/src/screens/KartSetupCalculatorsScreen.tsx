import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ART } from '../assets/art';
import { ArtOrPlaceholder } from '../components/ArtOrPlaceholder';
import { KartSetupWeatherImport } from '../components/KartSetupWeatherImport';
import { OptionalNum, RequiredNum, setupFormStyles } from '../components/KartSetupForm';
import {
  JETTING_DIRECTION,
  analyzeCornerWeights,
  barToPsi,
  cToF,
  casterFromSweep,
  conditionsAirDensity,
  fuelMix,
  kgToLb,
  mmToIn,
  nextMainJet,
  planBallast,
  psiToBar,
  radPercentFromWeather,
  type ChassisSetup,
  type Conditions,
} from '../lib/setupEngine';
import {
  defaultKartSetupSession,
  loadKartSetupSession,
  saveKartSetupSession,
  type KartSetupSession,
} from '../storage/kartSetup';

type ToolId = 'jetting' | 'fuel' | 'weights' | 'caster' | 'units';

const KA_FUEL_NOTE =
  'KA permits PULP (RON ≥ 95), E10, and named racing fuels; 4SS is PULP only. Oil list is homologation / CIK — confirm the meeting Supp Regs. Weather does not change the oil ratio.';

export function KartSetupCalculatorsScreen() {
  const [session, setSession] = useState<KartSetupSession>(defaultKartSetupSession);
  const [ready, setReady] = useState(false);
  const [tool, setTool] = useState<ToolId>('jetting');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      void loadKartSetupSession().then((next) => {
        if (!alive) return;
        setSession(next);
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

  const setSetup = (patch: Partial<ChassisSetup>) => {
    setSession((prev) => ({ ...prev, setup: { ...prev.setup, ...patch } }));
  };
  const setConditions = (patch: Partial<Conditions>) => {
    setSession((prev) => ({ ...prev, conditions: { ...prev.conditions, ...patch } }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.notice}>
        Technician tools: textbook formulas. No lap-time claims. Confirm class regs for fuel, weight, and jet stamps.
      </Text>
      <KartSetupWeatherImport conditions={session.conditions} onConditions={setConditions} />
      <View style={styles.tabs}>
        {(
          [
            ['jetting', 'Jet / RAD'],
            ['fuel', 'Premix'],
            ['weights', 'Scales'],
            ['caster', 'Caster'],
            ['units', 'Units'],
          ] as const
        ).map(([id, label]) => (
          <TouchableOpacity
            key={id}
            style={[styles.tab, tool === id ? styles.tabOn : null]}
            onPress={() => setTool(id)}
            accessibilityRole="button"
            accessibilityState={{ selected: tool === id }}
          >
            <Text style={[styles.tabText, tool === id ? styles.tabTextOn : null]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tool === 'jetting' ? (
        <JettingPanel session={session} onSetup={setSetup} onConditions={setConditions} />
      ) : null}
      {tool === 'fuel' ? <FuelPanel session={session} onSetup={setSetup} /> : null}
      {tool === 'weights' ? <WeightsPanel /> : null}
      {tool === 'caster' ? <CasterPanel /> : null}
      {tool === 'units' ? <UnitsPanel /> : null}
    </ScrollView>
  );
}

function JettingPanel({
  session,
  onSetup,
  onConditions,
}: {
  session: KartSetupSession;
  onSetup: (patch: Partial<ChassisSetup>) => void;
  onConditions: (patch: Partial<Conditions>) => void;
}) {
  const { setup, conditions } = session;
  const density = conditionsAirDensity(conditions);
  const radNow =
    density != null
      ? density.relativeAirDensity * 100
      : conditions.airTempC != null && conditions.pressureHpa != null && conditions.humidityPct != null
        ? radPercentFromWeather({
            tempC: conditions.airTempC,
            pressureHpa: conditions.pressureHpa,
            relativeHumidityPct: conditions.humidityPct,
          })
        : null;

  if (setup.engineKind === 'sealed_4ss') {
    return (
      <View style={setupFormStyles.panel}>
        <View style={styles.head}>
          <ArtOrPlaceholder source={ART.toolMainJet} label="Jet" size={56} />
          <Text style={setupFormStyles.panelTitle}>Sealed / 4SS</Text>
        </View>
        <Text style={setupFormStyles.hint}>
          No jetting conversation on a sealed engine. RAD is still useful as a density note — keep 4SS on PULP only.
        </Text>
        {radNow != null ? <Text style={styles.stat}>Today RAD {radNow.toFixed(1)}%</Text> : null}
      </View>
    );
  }

  const baselineStamp = setup.baselineJetStamp;
  const baselineRad = setup.baselineRadPct;
  const result =
    baselineStamp != null && baselineRad != null && radNow != null
      ? nextMainJet({ baselineStamp, radBasePct: baselineRad, radNewPct: radNow })
      : null;

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder source={ART.toolMainJet} label="Jet" size={56} />
        <ArtOrPlaceholder label="RAD" size={56} />
        <Text style={setupFormStyles.panelTitle}>Main jet from RAD</Text>
      </View>
      <Text style={setupFormStyles.hint}>
        Baseline is a jet that was fast on the stopwatch at a known RAD. Hotter / higher / more humid → smaller jet.
        Confirm class stamps.
      </Text>
      <View style={setupFormStyles.row}>
        <OptionalNum
          label="Baseline stamp"
          value={setup.baselineJetStamp}
          onChange={(baselineJetStamp) => onSetup({ baselineJetStamp })}
        />
        <OptionalNum
          label="Baseline RAD %"
          value={setup.baselineRadPct}
          onChange={(baselineRadPct) => onSetup({ baselineRadPct })}
        />
      </View>
      {radNow == null ? (
        <Text style={setupFormStyles.hint}>Import weather (or type air / humidity / hPa) to get today&apos;s RAD.</Text>
      ) : (
        <Text style={styles.stat}>Today RAD {radNow.toFixed(1)}%</Text>
      )}
      {result ? (
        <View>
          <Text style={styles.stat}>
            Suggested stamp {result.suggestedStamp} · flow factor {result.flowFactor} · {result.direction}
          </Text>
          <Text style={setupFormStyles.hint}>
            Worked: d_old {result.oldDiameterMm} mm → √(d² × {result.flowFactor}) = {result.newDiameterMm} mm → stamp{' '}
            {result.suggestedStamp} ({result.deltaStamps >= 0 ? '+' : ''}
            {result.deltaStamps} from {baselineStamp} @ {result.radBasePct}%).
          </Text>
          <Text style={styles.body}>{result.summary}</Text>
          <Text style={setupFormStyles.hint}>
            Direction: hotter → {JETTING_DIRECTION.hotter}; colder → {JETTING_DIRECTION.colder}.
          </Text>
          <Text style={styles.source}>Source: {result.kbSource}</Text>
        </View>
      ) : (
        <Text style={setupFormStyles.hint}>
          {radNow != null
            ? 'Enter a stopwatch-proven baseline stamp and the RAD it was run at. Until then this is direction only.'
            : null}
        </Text>
      )}
      {radNow != null && (baselineStamp == null || baselineRad == null) ? (
        <Text style={styles.body}>
          {conditions.airTempC != null && conditions.airTempC < 15
            ? `Colder air (${conditions.airTempC}°C) — typically a larger jet once you have a baseline.`
            : conditions.airTempC != null && conditions.airTempC > 28
              ? `Hotter air (${conditions.airTempC}°C) — typically a smaller jet once you have a baseline.`
              : 'Need a baseline stamp to suggest a number.'}
        </Text>
      ) : null}
      <View style={setupFormStyles.row}>
        <OptionalNum
          label="Air °C (override)"
          value={conditions.airTempC}
          onChange={(airTempC) => onConditions({ airTempC })}
        />
        <OptionalNum
          label="Humidity %"
          value={conditions.humidityPct}
          onChange={(humidityPct) => onConditions({ humidityPct })}
        />
        <OptionalNum
          label="hPa"
          value={conditions.pressureHpa}
          onChange={(pressureHpa) => onConditions({ pressureHpa })}
        />
      </View>
    </View>
  );
}

function FuelPanel({
  session,
  onSetup,
}: {
  session: KartSetupSession;
  onSetup: (patch: Partial<ChassisSetup>) => void;
}) {
  const [litres, setLitres] = useState(8);
  const ratio = session.setup.premixRatio ?? 20;
  const result = useMemo(() => fuelMix(litres, ratio), [litres, ratio]);

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder label="Fuel" size={56} />
        <Text style={setupFormStyles.panelTitle}>Premix (jug maths)</Text>
      </View>
      <Text style={setupFormStyles.hint}>{KA_FUEL_NOTE}</Text>
      <View style={setupFormStyles.row}>
        <RequiredNum label="Fuel litres" value={litres} stepHint="0.1" onChange={setLitres} />
        <OptionalNum
          label="Ratio (20 = 20:1)"
          value={session.setup.premixRatio}
          onChange={(premixRatio) => onSetup({ premixRatio })}
        />
      </View>
      <Text style={styles.stat}>
        {result.oilMl} ml oil · {result.oilOz} fl oz
      </Text>
      <Text style={styles.body}>{result.summary}</Text>
    </View>
  );
}

function WeightsPanel() {
  const [fl, setFl] = useState(21.5);
  const [fr, setFr] = useState(21.5);
  const [rl, setRl] = useState(28.5);
  const [rr, setRr] = useState(28.5);
  const weights = { fl, fr, rl, rr };
  const analysis = useMemo(() => analyzeCornerWeights(weights), [fl, fr, rl, rr]);
  const plan = useMemo(() => planBallast(weights), [fl, fr, rl, rr]);

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder label="Scales" size={56} />
        <Text style={setupFormStyles.panelTitle}>Corner weights</Text>
      </View>
      <Text style={setupFormStyles.hint}>
        Driver in full kit, race fuel, level pads, steering straight. Target ~43% front / 57% rear, 50/50 left-right.
      </Text>
      <View style={setupFormStyles.row}>
        <RequiredNum label="FL kg" value={fl} stepHint="0.1" onChange={setFl} />
        <RequiredNum label="FR kg" value={fr} stepHint="0.1" onChange={setFr} />
        <RequiredNum label="RL kg" value={rl} stepHint="0.1" onChange={setRl} />
        <RequiredNum label="RR kg" value={rr} stepHint="0.1" onChange={setRr} />
      </View>
      <Text style={styles.stat}>
        Total {analysis.totalKg} kg · F/R {analysis.frontPct}% / {analysis.rearPct}% · L/R {analysis.leftPct}% /{' '}
        {analysis.rightPct}% · cross {analysis.crossPct}%
      </Text>
      {analysis.notes.map((note) => (
        <Text key={note} style={setupFormStyles.hint}>
          {note}
        </Text>
      ))}
      <Text style={styles.body}>{plan.summary}</Text>
      <Text style={styles.source}>Source: {plan.kbSource}</Text>
    </View>
  );
}

function CasterPanel() {
  const [left, setLeft] = useState(8);
  const [right, setRight] = useState(8);
  const result = useMemo(() => casterFromSweep(left, right), [left, right]);

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder label="Caster" size={56} />
        <Text style={setupFormStyles.panelTitle}>Caster sweep</Text>
      </View>
      <Text style={setupFormStyles.hint}>
        Ruler on the floor pan, steer L/R, compare laser height. Match within ~2 mm. About 4 mm ≈ 1°. Approximate.
      </Text>
      <View style={setupFormStyles.row}>
        <RequiredNum label="Left height mm" value={left} stepHint="0.5" onChange={setLeft} />
        <RequiredNum label="Right height mm" value={right} stepHint="0.5" onChange={setRight} />
      </View>
      <Text style={result.matched ? styles.ok : styles.body}>{result.summary}</Text>
      <Text style={styles.source}>Source: {result.kbSource}</Text>
    </View>
  );
}

function UnitsPanel() {
  const [bar, setBar] = useState(1);
  const [psi, setPsi] = useState(14.5);
  const [c, setC] = useState(20);
  const [kg, setKg] = useState(100);
  const [mm, setMm] = useState(1050);

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder source={ART.toolTyreGauge} label="Units" size={56} />
        <Text style={setupFormStyles.panelTitle}>Unit conversion</Text>
      </View>
      <View style={setupFormStyles.row}>
        <RequiredNum label="Bar" value={bar} stepHint="0.05" onChange={setBar} />
        <Text style={styles.conv}>{barToPsi(bar).toFixed(2)} psi</Text>
      </View>
      <View style={setupFormStyles.row}>
        <RequiredNum label="PSI" value={psi} stepHint="0.1" onChange={setPsi} />
        <Text style={styles.conv}>{psiToBar(psi).toFixed(3)} bar</Text>
      </View>
      <View style={setupFormStyles.row}>
        <RequiredNum label="°C" value={c} onChange={setC} />
        <Text style={styles.conv}>{cToF(c).toFixed(1)} °F</Text>
      </View>
      <View style={setupFormStyles.row}>
        <RequiredNum label="kg" value={kg} stepHint="0.1" onChange={setKg} />
        <Text style={styles.conv}>{kgToLb(kg).toFixed(2)} lb</Text>
      </View>
      <View style={setupFormStyles.row}>
        <RequiredNum label="mm" value={mm} onChange={setMm} />
        <Text style={styles.conv}>{mmToIn(mm).toFixed(2)} in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },
  notice: { color: '#93c5fd', fontSize: 14, lineHeight: 20, marginBottom: 12 },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
  },
  tabOn: { borderColor: '#f59e0b' },
  tabText: { color: '#cbd5e1', fontWeight: '700', fontSize: 13 },
  tabTextOn: { color: '#fde68a' },
  head: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  stat: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  body: { color: '#e2e8f0', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  ok: { color: '#86efac', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  source: { color: '#64748b', fontSize: 11, marginTop: 4 },
  conv: { color: '#e2e8f0', fontSize: 15, fontWeight: '700', alignSelf: 'center', minWidth: 90 },
});
