import type { ChassisSetup } from "@kartracer/setup-engine";
import { Field, LIMIT_OPTIONS, NumberField, SelectField } from "../components/Fields";

export function ChassisScreen({
  setup,
  onChange,
}: {
  setup: ChassisSetup;
  onChange: (setup: ChassisSetup) => void;
}) {
  const set = <K extends keyof ChassisSetup>(key: K, value: ChassisSetup[K]) =>
    onChange({ ...setup, [key]: value });

  return (
    <>
      <p className="notice">
        Numbers are class examples — confirm current regs. Log the kart as it sits, then analyse. One change at a time.
      </p>
      <section className="panel">
        <h2>Kart</h2>
        <div className="grid two">
          <Field label="Sheet name">
            <input value={setup.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Chassis brand">
            <input
              value={setup.chassisBrand}
              onChange={(e) => set("chassisBrand", e.target.value)}
              placeholder="OTK, CRG, …"
            />
          </Field>
          <SelectField
            label="Wheelbase"
            value={setup.wheelbase}
            onChange={(v) => set("wheelbase", v)}
            options={[
              { value: "1050", label: "1050 mm" },
              { value: "950", label: "950 mm" },
              { value: "bambino", label: "Bambino / 770" },
            ]}
          />
          <SelectField
            label="Tyres"
            value={setup.tyreType}
            onChange={(v) => set("tyreType", v)}
            options={[
              { value: "slick", label: "Slick" },
              { value: "wet", label: "Wet" },
            ]}
          />
          <SelectField
            label="Rims"
            value={setup.rimMaterial}
            onChange={(v) => set("rimMaterial", v)}
            options={[
              { value: "aluminium", label: "Aluminium" },
              { value: "magnesium", label: "Magnesium" },
            ]}
          />
        </div>
      </section>

      <section className="panel">
        <h2>Front</h2>
        <div className="grid three">
          <SelectField label="Front track" value={setup.frontTrack} options={LIMIT_OPTIONS} onChange={(v) => set("frontTrack", v)} />
          <SelectField label="Front ride height" value={setup.frontRideHeight} options={LIMIT_OPTIONS} onChange={(v) => set("frontRideHeight", v)} />
          <SelectField label="Front hub length" value={setup.frontHubLength} options={LIMIT_OPTIONS} onChange={(v) => set("frontHubLength", v)} />
          <NumberField label="Front hub spacers / side" value={setup.frontHubSpacers} onChange={(v) => set("frontHubSpacers", v)} />
          <NumberField label="Toe (mm, + = out)" value={setup.toeMm} step={0.5} onChange={(v) => set("toeMm", v)} />
          <NumberField label="Camber (mm, − = in)" value={setup.camberMm} step={0.5} onChange={(v) => set("camberMm", v)} />
          <SelectField label="Caster" value={setup.caster} options={LIMIT_OPTIONS} onChange={(v) => set("caster", v)} />
          <SelectField
            label="Ackermann"
            value={setup.ackermann}
            onChange={(v) => set("ackermann", v)}
            options={[
              { value: "inner", label: "Inner hole (more)" },
              { value: "mid", label: "Mid" },
              { value: "outer", label: "Outer hole (less)" },
            ]}
          />
          <SelectField
            label="Front torsion"
            value={setup.frontTorsion}
            onChange={(v) => set("frontTorsion", v)}
            options={[
              { value: "off", label: "Off" },
              { value: "fitted", label: "Fitted" },
            ]}
          />
          <SelectField
            label="Front bumper"
            value={setup.frontBumper}
            onChange={(v) => set("frontBumper", v)}
            options={[
              { value: "loose", label: "Loose" },
              { value: "tight", label: "Tight" },
            ]}
          />
        </div>
      </section>

      <section className="panel">
        <h2>Rear</h2>
        <div className="grid three">
          <SelectField label="Rear track" value={setup.rearTrack} options={LIMIT_OPTIONS} onChange={(v) => set("rearTrack", v)} />
          <SelectField label="Rear ride height" value={setup.rearRideHeight} options={LIMIT_OPTIONS} onChange={(v) => set("rearRideHeight", v)} />
          <SelectField label="Rear hub length" value={setup.rearHubLength} options={LIMIT_OPTIONS} onChange={(v) => set("rearHubLength", v)} />
          <SelectField
            label="Axle"
            value={setup.axleStiffness}
            onChange={(v) => set("axleStiffness", v)}
            options={[
              { value: "soft", label: "Soft" },
              { value: "medium", label: "Medium" },
              { value: "stiff", label: "Stiff" },
            ]}
          />
          <SelectField
            label="Rear torsion"
            value={setup.rearTorsion}
            onChange={(v) => set("rearTorsion", v)}
            options={[
              { value: "off", label: "Off" },
              { value: "loose", label: "Loose" },
              { value: "fitted_flat", label: "Fitted flat" },
              { value: "tight", label: "Tight" },
            ]}
          />
          <SelectField
            label="Third bearing"
            value={setup.thirdBearing}
            onChange={(v) => set("thirdBearing", v)}
            options={[
              { value: "none", label: "Not fitted" },
              { value: "loose", label: "Loose" },
              { value: "tight", label: "Tight" },
            ]}
          />
          <SelectField
            label="Side pods"
            value={setup.sidepods}
            onChange={(v) => set("sidepods", v)}
            options={[
              { value: "loose", label: "Bars loose in chassis" },
              { value: "tight", label: "Tight" },
            ]}
          />
          <SelectField
            label="Rear bumper"
            value={setup.rearBumper}
            onChange={(v) => set("rearBumper", v)}
            options={[
              { value: "loose", label: "Loose" },
              { value: "tight", label: "Tight" },
            ]}
          />
        </div>
        <div className="row-actions">
          <label className="muted">
            <input
              type="checkbox"
              checked={setup.fourthTorsion}
              onChange={(e) => set("fourthTorsion", e.target.checked)}
            />{" "}
            4th torsion bar fitted
          </label>
          <label className="muted">
            <input
              type="checkbox"
              checked={setup.rainMeister}
              onChange={(e) => set("rainMeister", e.target.checked)}
            />{" "}
            Rain Meister / wet helper
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Seat, ballast, notes</h2>
        <div className="grid three">
          <SelectField
            label="Seat position"
            value={setup.seatPosition}
            onChange={(v) => set("seatPosition", v)}
            options={[
              { value: "forward", label: "Forward" },
              { value: "mid", label: "Mid" },
              { value: "back", label: "Back" },
            ]}
          />
          <SelectField label="Seat height" value={setup.seatHeight} options={LIMIT_OPTIONS} onChange={(v) => set("seatHeight", v)} />
          <SelectField
            label="Seat struts"
            value={setup.seatStruts}
            onChange={(v) => set("seatStruts", v)}
            options={[
              { value: "none", label: "None" },
              { value: "one_per_side", label: "One per side" },
              { value: "two_per_side", label: "Two per side" },
              { value: "tight", label: "Tight extra" },
            ]}
          />
          <NumberField label="Driver weight (kg)" value={setup.driverWeightKg} onChange={(v) => set("driverWeightKg", v)} />
          <NumberField label="Ballast (kg)" value={setup.ballastKg} step={0.5} onChange={(v) => set("ballastKg", v)} />
          <SelectField
            label="Ballast fore / aft"
            value={setup.ballastForeAft}
            onChange={(v) => set("ballastForeAft", v)}
            options={[
              { value: "front", label: "Front" },
              { value: "mid", label: "Mid" },
              { value: "rear", label: "Rear" },
            ]}
          />
          <SelectField
            label="Ballast height"
            value={setup.ballastVertical}
            onChange={(v) => set("ballastVertical", v)}
            options={[
              { value: "low", label: "Low" },
              { value: "mid", label: "Mid" },
              { value: "high", label: "High" },
            ]}
          />
        </div>
        <Field label="Notes">
          <textarea value={setup.notes} onChange={(e) => set("notes", e.target.value)} />
        </Field>
      </section>
    </>
  );
}
