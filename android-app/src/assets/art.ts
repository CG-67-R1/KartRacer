import type { ImageSourcePropType } from 'react-native';
import type { Symptom } from '../lib/setupEngine';

/** Placed KartRacer art only. HOLD / REGEN files stay off this module. */
export const ART = {
  tabAnalysis: require('../../assets/art/kr-tab-analysis.png'),
  tabTools: require('../../assets/art/kr-tab-tools.png'),
  toolGearing: require('../../assets/art/kr-tool-gearing.png'),
  chassisJackingLift: require('../../assets/art/kr-chassis-jacking-lift.png'),
  chassisPlanCorners: require('../../assets/art/kr-chassis-plan-corners.png'),
  pressureColdHot: require('../../assets/art/kr-pressure-cold-hot.png'),
  pressureCompoundWindow: require('../../assets/art/kr-pressure-compound-window.png'),
  tempLegendOmi: require('../../assets/art/kr-temp-legend-omi.png'),
  tempColdMiddle: require('../../assets/art/kr-temp-cold-middle.png'),
  tempHotMiddle: require('../../assets/art/kr-temp-hot-middle.png'),
  tempHotInner: require('../../assets/art/kr-temp-hot-inner.png'),
  tempHotOuter: require('../../assets/art/kr-temp-hot-outer.png'),
  gripGreen: require('../../assets/art/kr-grip-green.png'),
  gripNormal: require('../../assets/art/kr-grip-normal.png'),
  gripRubbered: require('../../assets/art/kr-grip-rubbered.png'),
  wetChecklist: require('../../assets/art/kr-wet-checklist.png'),
  leverRainMeister: require('../../assets/art/kr-lever-rain-meister.png'),
  adviceOneChange: require('../../assets/art/kr-advice-one-change.png'),
  adviceBlocked: require('../../assets/art/kr-advice-blocked.png'),
  tyreSlick: require('../../assets/art/kr-tyre-slick.png'),
  tyreWet: require('../../assets/art/kr-tyre-wet.png'),
  leverCaster: require('../../assets/art/kr-lever-caster.png'),
  leverCamber: require('../../assets/art/kr-lever-camber.png'),
  leverToe: require('../../assets/art/kr-lever-toe.png'),
  leverFrontTrack: require('../../assets/art/kr-lever-front-track.png'),
  leverAxle: require('../../assets/art/kr-lever-axle.png'),
  leverSeatPosition: require('../../assets/art/kr-lever-seat-position.png'),
  leverFrontRideHeight: require('../../assets/art/kr-lever-front-ride-height.png'),
  leverRearRideHeight: require('../../assets/art/kr-lever-rear-ride-height.png'),
  historySnapshot: require('../../assets/art/kr-history-snapshot.png'),
  historyTrack: require('../../assets/art/kr-history-track.png'),
  tabLogger: require('../../assets/art/kr-tab-logger.png'),
  loggerTrace: require('../../assets/art/kr-logger-trace.png'),
  toolMainJet: require('../../assets/art/kr-tool-main-jet.png'),
  toolTyreGauge: require('../../assets/art/kr-tool-tyre-gauge.png'),
  weatherSun: require('../../assets/art/kr-weather-sun.png'),
  weatherCloud: require('../../assets/art/kr-weather-cloud.png'),
} as const;

export const SYMPTOM_ART: Partial<Record<Symptom, ImageSourcePropType>> = {
  understeer_entry: require('../../assets/art/kr-symptom-understeer-entry.png'),
  oversteer_entry: require('../../assets/art/kr-symptom-oversteer-entry.png'),
  understeer_mid: require('../../assets/art/kr-symptom-understeer-mid.png'),
  oversteer_mid: require('../../assets/art/kr-symptom-oversteer-mid.png'),
  understeer_exit: require('../../assets/art/kr-symptom-understeer-exit.png'),
  oversteer_exit: require('../../assets/art/kr-symptom-oversteer-exit.png'),
  hop: require('../../assets/art/kr-symptom-hop.png'),
  chatter: require('../../assets/art/kr-symptom-chatter.png'),
  four_wheel_slide: require('../../assets/art/kr-symptom-slide.png'),
  too_much_side_bite: require('../../assets/art/kr-symptom-side-bite.png'),
  darty: require('../../assets/art/kr-symptom-darty.png'),
  one_direction_only: require('../../assets/art/kr-symptom-one-direction.png'),
};

export const HOTSPOT_ART: Record<string, ImageSourcePropType | undefined> = {
  pressures: ART.pressureColdHot,
  front_width: ART.leverFrontTrack,
  caster: ART.leverCaster,
  camber: ART.leverCamber,
  toe: ART.leverToe,
  axle_hubs: ART.leverAxle,
  seat: ART.leverSeatPosition,
  ride_height: ART.leverFrontRideHeight,
};

export function hotspotArtExtra(id: string): ImageSourcePropType | undefined {
  return id === 'ride_height' ? ART.leverRearRideHeight : undefined;
}
