import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LEVER_LABELS, type Advice, type AnalysisResult } from '../lib/setupEngine';

export function KartSetupAdviceList({ result }: { result: AnalysisResult }) {
  return (
    <View>
      <Text style={styles.notice}>{result.reminder}</Text>
      {result.warnings.map((warning) => (
        <Text key={warning} style={styles.warn}>
          {warning}
        </Text>
      ))}
      {result.advice.map((item, index) => (
        <AdviceCard key={item.id} item={item} first={index === 0} />
      ))}
      {result.blocked.length > 0 ? (
        <View style={styles.blockedBlock}>
          <Text style={styles.blockedTitle}>Already at the recorded limit</Text>
          {result.blocked.map((item) => (
            <AdviceCard key={item.id} item={item} blocked />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function AdviceCard({
  item,
  first,
  blocked,
}: {
  item: Advice;
  first?: boolean;
  blocked?: boolean;
}) {
  return (
    <View style={[styles.card, first && !blocked ? styles.cardFirst : null, blocked ? styles.cardBlocked : null]}>
      {first && !blocked ? <Text style={styles.kicker}>Do this first</Text> : null}
      {blocked ? <Text style={styles.kickerMuted}>Blocked by sheet</Text> : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {LEVER_LABELS[item.lever]} · {item.direction}
        {item.magnitude ? ` · ${item.magnitude}` : ''}
      </Text>
      <Text style={styles.why}>{item.why}</Text>
      {item.polarityNote === '950_may_invert' ? (
        <Text style={styles.warn}>
          950 / Bambino: axle polarity can invert versus 1050 literature. If this fails, try the
          opposite.
        </Text>
      ) : null}
      <Text style={styles.source}>Source: {item.kbSource}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    color: '#93c5fd',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  warn: {
    color: '#fbbf24',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  blockedBlock: {
    marginTop: 12,
  },
  blockedTitle: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    padding: 12,
    marginBottom: 10,
  },
  cardFirst: {
    borderColor: '#f59e0b',
  },
  cardBlocked: {
    opacity: 0.7,
  },
  kicker: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  kickerMuted: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    color: '#cbd5e1',
    fontSize: 12,
    marginBottom: 6,
  },
  why: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  source: {
    color: '#64748b',
    fontSize: 11,
  },
});
