import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { ART } from '../assets/art';
import { ArtThumb } from './ArtThumb';
import { LEVER_LABELS, type Advice, type AnalysisResult } from '../lib/setupEngine';

function adviceArt(item: Advice, first?: boolean, blocked?: boolean): ImageSourcePropType {
  if (blocked) return ART.adviceBlocked;
  const blob = `${item.id} ${item.title} ${item.why}`.toLowerCase();
  if (/jack|inside.?rear.?lift/.test(blob)) return ART.chassisJackingLift;
  if (/cold_middle|cold middle/.test(blob)) return ART.tempColdMiddle;
  if (/hot_middle|hot middle/.test(blob)) return ART.tempHotMiddle;
  if (/hot_inner|hot inner/.test(blob)) return ART.tempHotInner;
  if (/hot_outer|hot outer/.test(blob)) return ART.tempHotOuter;
  if (first) return ART.adviceOneChange;
  return ART.adviceOneChange;
}

export function KartSetupAdviceList({
  result,
  showTrace,
}: {
  result: AnalysisResult;
  showTrace?: boolean;
}) {
  return (
    <View>
      {showTrace && result.trace.length > 0 ? (
        <View style={styles.trace}>
          <Text style={styles.traceTitle}>How the engine picked this</Text>
          {result.trace.map((step) => (
            <Text key={step.id} style={styles.traceRow}>
              {step.label}: {step.detail}
            </Text>
          ))}
        </View>
      ) : null}
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
  const [expanded, setExpanded] = useState(false);
  const showDetail = Boolean(first || blocked || expanded);

  return (
    <View style={[styles.card, first && !blocked ? styles.cardFirst : null, blocked ? styles.cardBlocked : null]}>
      <View style={styles.cardTop}>
        <View style={styles.cardCopy}>
          {first && !blocked ? <Text style={styles.kicker}>Do this first</Text> : null}
          {blocked ? <Text style={styles.kickerMuted}>Already at the limit</Text> : null}
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <ArtThumb source={adviceArt(item, first, blocked)} size={56} />
      </View>
      <Text style={styles.meta}>
        {LEVER_LABELS[item.lever]} · {item.direction}
        {item.magnitude ? ` · ${item.magnitude}` : ''}
      </Text>
      {!showDetail ? (
        <TouchableOpacity
          onPress={() => setExpanded(true)}
          accessibilityRole="button"
          accessibilityLabel="More about this change"
          accessibilityState={{ expanded: false }}
        >
          <Text style={styles.more}>More</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.why}>{item.why}</Text>
          {item.polarityNote === '950_may_invert' ? (
            <Text style={styles.warn}>
              950 / Bambino: axle polarity can invert versus 1050 literature. If this fails, try the
              opposite.
            </Text>
          ) : null}
          <Text style={styles.source}>Source: {item.kbSource}</Text>
          {!first && !blocked ? (
            <TouchableOpacity
              onPress={() => setExpanded(false)}
              accessibilityRole="button"
              accessibilityLabel="Hide extra detail"
              accessibilityState={{ expanded: true }}
            >
              <Text style={styles.more}>Less</Text>
            </TouchableOpacity>
          ) : null}
        </>
      )}
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
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  cardCopy: {
    flex: 1,
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
  more: {
    color: '#f59e0b',
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 6,
  },
  trace: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  traceTitle: {
    color: '#fde68a',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  traceRow: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 4,
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
