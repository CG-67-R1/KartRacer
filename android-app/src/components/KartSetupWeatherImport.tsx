import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ART } from '../assets/art';
import { getTrackCoords } from '../location/trackGeofenceMatch';
import { requestForegroundLocationPermission } from '../location/trackGeofence';
import { fetchTrackWeatherCurrent } from '../location/trackWeather';
import {
  applyWeather,
  conditionsAirDensity,
  type Conditions,
} from '../lib/setupEngine';
import { ArtOrPlaceholder } from './ArtOrPlaceholder';
import { OptionalNum, setupFormStyles } from './KartSetupForm';

export function KartSetupWeatherImport({
  conditions,
  onConditions,
}: {
  conditions: Conditions;
  onConditions: (patch: Partial<Conditions>) => void;
}) {
  const [hint, setHint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const density = conditionsAirDensity(conditions);
  const weatherArt =
    conditions.wet ? undefined : conditions.airTempC != null && conditions.airTempC >= 22 ? ART.weatherSun : ART.weatherCloud;

  const importWeather = async (force: boolean) => {
    setBusy(true);
    setHint(null);
    try {
      let coords = getTrackCoords(conditions.trackId);
      if (!coords) {
        const granted = await requestForegroundLocationPermission();
        if (!granted) {
          setHint(
            Platform.OS === 'web'
              ? 'Pick a catalog track to import weather, or use a phone at the circuit.'
              : 'Pick a track or allow location to import weather.'
          );
          return;
        }
        const Location = await import('expo-location');
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      }
      const current = await fetchTrackWeatherCurrent(coords.lat, coords.lng);
      if (!current) {
        setHint('Could not fetch weather.');
        return;
      }
      const next = applyWeather(
        conditions,
        {
          airTempC: current.airTempC,
          humidityPct: current.humidityPct,
          pressureHpa: current.pressureHpa,
          weatherCode: current.weatherCode,
          windKmh: current.windKmh,
        },
        force
      );
      onConditions({
        airTempC: next.airTempC,
        humidityPct: next.humidityPct,
        pressureHpa: next.pressureHpa,
        wet: next.wet,
      });
      setHint(current.summary);
    } catch {
      setHint('Could not fetch weather.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={setupFormStyles.panel}>
      <View style={styles.head}>
        <ArtOrPlaceholder source={weatherArt} label="Weather" size={56} />
        <Text style={setupFormStyles.panelTitle}>Weather import</Text>
      </View>
      <Text style={setupFormStyles.hint}>
        Fills empty air, humidity, and pressure from the venue pin. Does not overwrite a number you typed
        unless you tap overwrite. Track °C stays a probe reading.
      </Text>
      <View style={setupFormStyles.row}>
        <OptionalNum
          label="Air °C"
          value={conditions.airTempC}
          onChange={(airTempC) => onConditions({ airTempC })}
        />
        <OptionalNum
          label="Track °C"
          value={conditions.trackTempC}
          onChange={(trackTempC) => onConditions({ trackTempC })}
        />
      </View>
      <View style={setupFormStyles.row}>
        <OptionalNum
          label="Humidity %"
          value={conditions.humidityPct}
          onChange={(humidityPct) => onConditions({ humidityPct })}
        />
        <OptionalNum
          label="Pressure hPa"
          value={conditions.pressureHpa}
          onChange={(pressureHpa) => onConditions({ pressureHpa })}
        />
      </View>
      <OptionalNum
        label="Target tyre °C"
        value={conditions.targetTyreTempC}
        onChange={(targetTyreTempC) => {
          if (targetTyreTempC != null) onConditions({ targetTyreTempC });
        }}
      />
      <TouchableOpacity style={styles.btn} onPress={() => void importWeather(false)} disabled={busy}>
        <Text style={styles.btnText}>{busy ? 'Fetching…' : 'Import weather'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => void importWeather(true)} disabled={busy}>
        <Text style={styles.secondaryText}>Overwrite with fresh weather</Text>
      </TouchableOpacity>
      {hint ? <Text style={setupFormStyles.hint}>{hint}</Text> : null}
      {density ? (
        <View style={styles.rad}>
          <ArtOrPlaceholder label="RAD" size={44} />
          <Text style={styles.radText}>
            RAD {(density.relativeAirDensity * 100).toFixed(1)}% · density altitude {density.densityAltitudeM} m (
            {density.densityAltitudeFt} ft) · {density.densityKgM3} kg/m³
          </Text>
        </View>
      ) : (
        <Text style={setupFormStyles.hint}>
          RAD appears when air °C, humidity, and pressure are all present.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  btn: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  btnText: { color: '#0f172a', fontWeight: '800', fontSize: 16 },
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
  rad: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  radText: { color: '#e0f2fe', fontSize: 13, lineHeight: 18, flex: 1 },
});
