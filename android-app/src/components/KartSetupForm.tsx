import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { ArtOrPlaceholder } from './ArtOrPlaceholder';

export function ChipRow<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; image?: ImageSourcePropType; placeholder?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => {
        const on = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, on ? styles.chipOn : null, opt.image || opt.placeholder ? styles.chipArt : null]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            {opt.image || opt.placeholder ? (
              <ArtOrPlaceholder source={opt.image} label={opt.placeholder ?? opt.label} size={44} />
            ) : null}
            <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function OptionalNum({
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

export function RequiredNum({
  label,
  value,
  onChange,
  stepHint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  stepHint?: string;
}) {
  return (
    <OptionalNum
      label={label}
      value={value}
      stepHint={stepHint}
      onChange={(next) => {
        if (next != null) onChange(next);
      }}
    />
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.fieldWide}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline ? styles.multiline : null]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        multiline={multiline}
      />
    </View>
  );
}

export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.toggle, value ? styles.chipOn : null]}
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={[styles.chipText, value ? styles.chipTextOn : null]}>
        {value ? 'On' : 'Off'} · {label}
      </Text>
    </TouchableOpacity>
  );
}

export const LIMIT_OPTIONS = [
  { value: 'min' as const, label: 'Min' },
  { value: 'mid' as const, label: 'Mid' },
  { value: 'max' as const, label: 'Max' },
  { value: 'unknown' as const, label: 'Unknown' },
];

export const setupFormStyles = StyleSheet.create({
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
  hint: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 8 },
  panel: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  panelTitle: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

const styles = StyleSheet.create({
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
  field: { flex: 1, minWidth: 70, marginBottom: 10 },
  fieldWide: { width: '100%', marginBottom: 10 },
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
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  toggle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    marginRight: 8,
  },
});
