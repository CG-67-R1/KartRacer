import React from 'react';
import { Text, View } from 'react-native';
import { ART } from '../assets/art';
import type { ChassisSetup, LimitState } from '../lib/setupEngine';
import { ChipRow, LIMIT_OPTIONS, OptionalNum, RequiredNum, TextField, ToggleRow, setupFormStyles } from './KartSetupForm';

export function KartSetupSheetFields({
  setup,
  onChange,
}: {
  setup: ChassisSetup;
  onChange: (patch: Partial<ChassisSetup>) => void;
}) {
  return (
    <View>
      <Text style={setupFormStyles.hint}>
        Log the kart as it sits. Numbers are class examples — confirm current regs. One change at a time.
      </Text>

      <Text style={setupFormStyles.section}>Kart</Text>
      <TextField label="Sheet name" value={setup.name} onChange={(name) => onChange({ name })} />
      <TextField
        label="Chassis brand"
        value={setup.chassisBrand}
        onChange={(chassisBrand) => onChange({ chassisBrand })}
        placeholder="OTK, CRG, …"
      />
      <TextField
        label="Class (optional)"
        value={setup.classId ?? ''}
        onChange={(classId) => onChange({ classId: classId || null })}
        placeholder="KA3, X30, Cadet 12…"
      />
      <Text style={setupFormStyles.fieldLabel}>Wheelbase</Text>
      <ChipRow
        value={setup.wheelbase}
        options={[
          { value: '1050', label: '1050 mm' },
          { value: '950', label: '950 mm' },
          { value: 'bambino', label: 'Bambino' },
        ]}
        onChange={(wheelbase) => onChange({ wheelbase })}
      />
      <Text style={setupFormStyles.fieldLabel}>Tyres</Text>
      <ChipRow
        value={setup.tyreType}
        options={[
          { value: 'slick', label: 'Slick', image: ART.tyreSlick },
          { value: 'wet', label: 'Wet', image: ART.tyreWet },
        ]}
        onChange={(tyreType) => onChange({ tyreType })}
      />
      <Text style={setupFormStyles.fieldLabel}>Rims</Text>
      <ChipRow
        value={setup.rimMaterial}
        options={[
          { value: 'aluminium', label: 'Aluminium', placeholder: 'Al rim' },
          { value: 'magnesium', label: 'Magnesium', placeholder: 'Mg rim' },
        ]}
        onChange={(rimMaterial) => onChange({ rimMaterial })}
      />
      <Text style={setupFormStyles.fieldLabel}>Engine</Text>
      <ChipRow
        value={setup.engineKind}
        options={[
          { value: 'two_stroke', label: '2-stroke (jetting)' },
          { value: 'sealed_4ss', label: 'Sealed / 4SS' },
        ]}
        onChange={(engineKind) => onChange({ engineKind })}
      />

      <Text style={setupFormStyles.section}>Front</Text>
      <Text style={setupFormStyles.fieldLabel}>Front track</Text>
      <ChipRow
        value={setup.frontTrack}
        options={LIMIT_OPTIONS}
        onChange={(frontTrack: LimitState) => onChange({ frontTrack })}
      />
      <Text style={setupFormStyles.fieldLabel}>Front ride height</Text>
      <ChipRow
        value={setup.frontRideHeight}
        options={LIMIT_OPTIONS}
        onChange={(frontRideHeight: LimitState) => onChange({ frontRideHeight })}
      />
      <Text style={setupFormStyles.fieldLabel}>Front hub length</Text>
      <ChipRow
        value={setup.frontHubLength}
        options={LIMIT_OPTIONS}
        onChange={(frontHubLength: LimitState) => onChange({ frontHubLength })}
      />
      <View style={setupFormStyles.row}>
        <RequiredNum
          label="Front hub spacers / side"
          value={setup.frontHubSpacers}
          onChange={(frontHubSpacers) => onChange({ frontHubSpacers })}
        />
        <RequiredNum label="Toe mm (+ = out)" value={setup.toeMm} stepHint="0.5" onChange={(toeMm) => onChange({ toeMm })} />
        <RequiredNum
          label="Camber mm (− = in)"
          value={setup.camberMm}
          stepHint="0.5"
          onChange={(camberMm) => onChange({ camberMm })}
        />
      </View>
      <Text style={setupFormStyles.fieldLabel}>Caster</Text>
      <ChipRow value={setup.caster} options={LIMIT_OPTIONS} onChange={(caster: LimitState) => onChange({ caster })} />
      <Text style={setupFormStyles.fieldLabel}>Ackermann</Text>
      <ChipRow
        value={setup.ackermann}
        options={[
          { value: 'inner', label: 'Inner (more)' },
          { value: 'mid', label: 'Mid' },
          { value: 'outer', label: 'Outer (less)' },
        ]}
        onChange={(ackermann) => onChange({ ackermann })}
      />
      <Text style={setupFormStyles.fieldLabel}>Front torsion</Text>
      <ChipRow
        value={setup.frontTorsion}
        options={[
          { value: 'off', label: 'Off' },
          { value: 'fitted', label: 'Fitted' },
        ]}
        onChange={(frontTorsion) => onChange({ frontTorsion })}
      />
      <Text style={setupFormStyles.fieldLabel}>Front bumper</Text>
      <ChipRow
        value={setup.frontBumper}
        options={[
          { value: 'loose', label: 'Loose' },
          { value: 'tight', label: 'Tight' },
        ]}
        onChange={(frontBumper) => onChange({ frontBumper })}
      />

      <Text style={setupFormStyles.section}>Rear</Text>
      <Text style={setupFormStyles.fieldLabel}>Rear track</Text>
      <ChipRow
        value={setup.rearTrack}
        options={LIMIT_OPTIONS}
        onChange={(rearTrack: LimitState) => onChange({ rearTrack })}
      />
      <Text style={setupFormStyles.fieldLabel}>Rear ride height</Text>
      <ChipRow
        value={setup.rearRideHeight}
        options={LIMIT_OPTIONS}
        onChange={(rearRideHeight: LimitState) => onChange({ rearRideHeight })}
      />
      <Text style={setupFormStyles.fieldLabel}>Rear hub length</Text>
      <ChipRow
        value={setup.rearHubLength}
        options={LIMIT_OPTIONS}
        onChange={(rearHubLength: LimitState) => onChange({ rearHubLength })}
      />
      <Text style={setupFormStyles.fieldLabel}>Axle</Text>
      <ChipRow
        value={setup.axleStiffness}
        options={[
          { value: 'soft', label: 'Soft' },
          { value: 'medium', label: 'Medium' },
          { value: 'stiff', label: 'Stiff' },
        ]}
        onChange={(axleStiffness) => onChange({ axleStiffness })}
      />
      <Text style={setupFormStyles.fieldLabel}>Rear torsion</Text>
      <ChipRow
        value={setup.rearTorsion}
        options={[
          { value: 'off', label: 'Off' },
          { value: 'loose', label: 'Loose' },
          { value: 'fitted_flat', label: 'Fitted flat' },
          { value: 'tight', label: 'Tight' },
        ]}
        onChange={(rearTorsion) => onChange({ rearTorsion })}
      />
      <Text style={setupFormStyles.fieldLabel}>Third bearing</Text>
      <ChipRow
        value={setup.thirdBearing}
        options={[
          { value: 'none', label: 'Not fitted' },
          { value: 'loose', label: 'Loose' },
          { value: 'tight', label: 'Tight' },
        ]}
        onChange={(thirdBearing) => onChange({ thirdBearing })}
      />
      <Text style={setupFormStyles.fieldLabel}>Side pods</Text>
      <ChipRow
        value={setup.sidepods}
        options={[
          { value: 'loose', label: 'Loose' },
          { value: 'tight', label: 'Tight' },
        ]}
        onChange={(sidepods) => onChange({ sidepods })}
      />
      <Text style={setupFormStyles.fieldLabel}>Rear bumper</Text>
      <ChipRow
        value={setup.rearBumper}
        options={[
          { value: 'loose', label: 'Loose' },
          { value: 'tight', label: 'Tight' },
        ]}
        onChange={(rearBumper) => onChange({ rearBumper })}
      />
      <ToggleRow
        label="4th torsion bar fitted"
        value={setup.fourthTorsion}
        onChange={(fourthTorsion) => onChange({ fourthTorsion })}
      />
      <ToggleRow
        label="Rain Meister / wet helper"
        value={setup.rainMeister}
        onChange={(rainMeister) => onChange({ rainMeister })}
      />

      <Text style={setupFormStyles.section}>Seat, ballast, notes</Text>
      <Text style={setupFormStyles.fieldLabel}>Seat position</Text>
      <ChipRow
        value={setup.seatPosition}
        options={[
          { value: 'forward', label: 'Forward' },
          { value: 'mid', label: 'Mid' },
          { value: 'back', label: 'Back' },
        ]}
        onChange={(seatPosition) => onChange({ seatPosition })}
      />
      <Text style={setupFormStyles.fieldLabel}>Seat height</Text>
      <ChipRow
        value={setup.seatHeight}
        options={LIMIT_OPTIONS}
        onChange={(seatHeight: LimitState) => onChange({ seatHeight })}
      />
      <Text style={setupFormStyles.fieldLabel}>Seat struts</Text>
      <ChipRow
        value={setup.seatStruts}
        options={[
          { value: 'none', label: 'None' },
          { value: 'one_per_side', label: 'One per side' },
          { value: 'two_per_side', label: 'Two per side' },
          { value: 'tight', label: 'Tight extra' },
        ]}
        onChange={(seatStruts) => onChange({ seatStruts })}
      />
      <View style={setupFormStyles.row}>
        <RequiredNum
          label="Driver kg"
          value={setup.driverWeightKg}
          onChange={(driverWeightKg) => onChange({ driverWeightKg })}
        />
        <RequiredNum
          label="Ballast kg"
          value={setup.ballastKg}
          stepHint="0.5"
          onChange={(ballastKg) => onChange({ ballastKg })}
        />
      </View>
      <Text style={setupFormStyles.fieldLabel}>Ballast fore / aft</Text>
      <ChipRow
        value={setup.ballastForeAft}
        options={[
          { value: 'front', label: 'Front' },
          { value: 'mid', label: 'Mid' },
          { value: 'rear', label: 'Rear' },
        ]}
        onChange={(ballastForeAft) => onChange({ ballastForeAft })}
      />
      <Text style={setupFormStyles.fieldLabel}>Ballast height</Text>
      <ChipRow
        value={setup.ballastVertical}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'mid', label: 'Mid' },
          { value: 'high', label: 'High' },
        ]}
        onChange={(ballastVertical) => onChange({ ballastVertical })}
      />
      <Text style={setupFormStyles.section}>Jet / premix baselines</Text>
      <View style={setupFormStyles.row}>
        <OptionalNum
          label="Baseline jet stamp"
          value={setup.baselineJetStamp}
          onChange={(baselineJetStamp) => onChange({ baselineJetStamp })}
        />
        <OptionalNum
          label="Baseline RAD %"
          value={setup.baselineRadPct}
          onChange={(baselineRadPct) => onChange({ baselineRadPct })}
        />
        <OptionalNum
          label="Premix ratio (20 = 20:1)"
          value={setup.premixRatio}
          onChange={(premixRatio) => onChange({ premixRatio })}
        />
      </View>
      <TextField
        label="Notes"
        value={setup.notes}
        onChange={(notes) => onChange({ notes })}
        multiline
        placeholder="What you changed, session, weather…"
      />
    </View>
  );
}
