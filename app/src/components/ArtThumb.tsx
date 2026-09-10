import React from 'react';
import { Image, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';

export function ArtThumb({
  source,
  size = 72,
  style,
}: {
  source: ImageSourcePropType;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={source}
      style={[{ width: size, height: size, borderRadius: 8, backgroundColor: '#11151C' }, style]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
    />
  );
}
