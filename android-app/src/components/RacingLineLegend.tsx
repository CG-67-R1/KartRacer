import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RACING_LINE_PHASES, racingLinePalette } from '../data/racingLines/colors';

type Props = {
  /** Palette actually drawn on the map; falls back to the shared ramp. */
  palette?: string[];
  compact?: boolean;
};

export function RacingLineLegend({ palette, compact = false }: Props) {
  const ramp = useMemo(
    () => (palette && palette.length > 0 ? palette : racingLinePalette()),
    [palette]
  );
  const labels = RACING_LINE_PHASES.map((phase) => `${phase.label} ${phase.color}`).join(', ');

  return (
    <View
      style={[styles.wrap, compact && styles.wrapCompact]}
      accessibilityRole="summary"
      accessibilityLabel={`Racing line colour key: ${labels}. Suggested line, not instruction.`}
    >
      {compact ? null : <Text style={styles.title}>Racing line</Text>}
      <View style={styles.ramp}>
        {ramp.map((color, index) => (
          <View key={`${color}-${index}`} style={[styles.rampSeg, { backgroundColor: color }]} />
        ))}
      </View>
      <View style={styles.row}>
        {RACING_LINE_PHASES.map((phase) => (
          <View key={phase.id} style={styles.item}>
            <View style={[styles.swatch, { backgroundColor: phase.color }]} />
            <Text style={styles.label}>{phase.label}</Text>
          </View>
        ))}
      </View>
      {compact ? null : (
        <Text style={styles.note}>Suggested line — not instruction, and no modelled lap time.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  wrapCompact: {
    marginTop: 8,
    marginHorizontal: 0,
    padding: 10,
    borderLeftWidth: 0,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  ramp: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  rampSeg: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  swatch: {
    width: 22,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  note: {
    marginTop: 8,
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
  },
});
