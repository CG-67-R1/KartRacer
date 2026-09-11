import React from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { ArtThumb } from './ArtThumb';

export function ArtOrPlaceholder({
  source,
  label,
  size = 48,
}: {
  source?: ImageSourcePropType;
  label: string;
  size?: number;
}) {
  if (source) {
    return <ArtThumb source={source} size={size} />;
  }
  return (
    <View
      style={[styles.box, { width: size, height: size }]}
      accessibilityRole="image"
      accessibilityLabel={`${label} (placeholder)`}
    >
      <Text style={styles.text} numberOfLines={3}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
