import { useMemo, useState } from "react";
import {
  SYMPTOM_LABELS,
  analyzePressures,
  analyzeTemps,
  diagnoseDriving,
  wetPaddockReminders,
  wetPresetChecklist,
  type AnalysisKind,
  type Conditions,
  type Symptom,
  type TyreCorner,
  type TyrePressures,
  type TyreTemps,
} from "@kartracer/setup-engine";
import { AdviceList } from "../components/AdviceList";
import { NumberField, OptionalNumberField, SelectField } from "../components/Fields";
import type { SessionState } from "../storage";

const SYMPTOMS = Object.keys(SYMPTOM_LABELS) as Symptom[];
const CORNERS: { id: TyreCorner; label: string }[] = [
  { id: "fl", label: "FL" },
  { id: "fr", label: "FR" },
  { id: "rl", label: "RL" },
  { id: "rr", label: "RR" },
];

export function AnalysisScreen({
  state,
  onChange,
}: {
  state: SessionState;
  onChange: (state: SessionState) => void;
}) {
  const [mode, setMode] = useState<AnalysisKind>("driving");
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [ran, setRan] = useState(false);

  const setConditions = (conditions: Conditions) => onChange({ ...state, conditions });
  const setPressures = (pressures: TyrePressures) => onChange({ ...state, pressures });
  const setTemps = (temps: TyreTemps) => onChange({ ...state, temps });

  const result = useMemo(() => {
    if (!ran) return null;
    if (mode === "driving") return diagnoseDriving(state.setup, state.conditions, symptoms);
    if (mode === "pressure") return analyzePressures(state.setup, state.conditions, state.pressures);
    return analyzeTemps(state.setup, state.conditions, state.temps);
  }, [ran, mode, state.setup, state.conditions, state.pressures, state.temps, symptoms]);

  const toggle = (symptom: Symptom) => {
    setRan(false);
    setSymptoms((current) =>
      current.includes(symptom) ? current.filter((s) => s !== symptom) : [...current, symptom],
    );
  };

  const wetItems = wetPresetChecklist(state.setup);

  return (
    <>
      <p className="notice">
        Advisor mode: symptoms, pressures, and tyre temps. This is not a lap-time predictor. Confirm it is not the driver before rewriting the chassis.
      </p>
      <div className="subtabs">
        {(
          [
            ["driving", "Driving"],
            ["pressure", "Pressures"],
            ["temperature", "Temperatures"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={`btn${mode === id ? " primary" : ""}`}
            type="button"
            onClick={() => {
              setMode(id);
              setRan(false);
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="panel">
        <h2>Track / weather</h2>
        <div className="grid three">
          <SelectField
            label="Grip"
            value={state.conditions.grip}
            onChange={(v) => setConditions({ ...state.conditions, grip: v })}
            options={[
              { value: "green", label: "Green / low" },
              { value: "normal", label: "Normal dry" },
              { value: "rubbered", label: "Rubbered / high" },
            ]}
          />
          <SelectField
            label="Direction"
            value={state.conditions.trackDirection}
            onChange={(v) => setConditions({ ...state.conditions, trackDirection: v })}
            options={[
              { value: "clockwise", label: "Clockwise" },
              { value: "anticlockwise", label: "Anti-clockwise" },
            ]}
          />
          <SelectField
            label="Surface"
            value={state.conditions.wet ? "wet" : "dry"}
            onChange={(v: "dry" | "wet") =>
              setConditions({
                ...state.conditions,
                wet: v === "wet",
              })
            }
            options={[
              { value: "dry", label: "Dry" },
              { value: "wet", label: "Wet" },
            ]}
          />
          <OptionalNumberField
            label="Air temp °C"
            value={state.conditions.airTempC}
            onChange={(v) => setConditions({ ...state.conditions, airTempC: v })}
          />
          <OptionalNumberField
            label="Track temp °C"
            value={state.conditions.trackTempC}
            onChange={(v) => setConditions({ ...state.conditions, trackTempC: v })}
          />
          <NumberField
            label="Target tyre temp °C"
            value={state.conditions.targetTyreTempC}
            onChange={(v) => setConditions({ ...state.conditions, targetTyreTempC: v })}
          />
        </div>
      </section>

      {state.conditions.wet && (
        <section className="panel">
          <h2>Wet checklist</h2>
          <p className="muted">Does not rewrite the sheet. Tick through against what is actually on the kart.</p>
          {wetItems.map((item) => (
            <div className="check" key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <div className="muted">Target: {item.target}</div>
              </div>
              <div className={item.matched ? "ok" : "warn"}>{item.matched ? "Matched" : `Now: ${item.current}`}</div>
            </div>
          ))}
          <ul className="muted">
            {wetPaddockReminders().map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {mode === "driving" && (
        <section className="panel">
          <h2>Behaviour in corners</h2>
          <div className="choice-grid">
            {SYMPTOMS.map((symptom) => (
              <button
                key={symptom}
                type="button"
                className={`choice${symptoms.includes(symptom) ? " on" : ""}`}
                onClick={() => toggle(symptom)}
              >
                {SYMPTOM_LABELS[symptom]}
              </button>
            ))}
          </div>
        </section>
      )}

      {mode === "pressure" && (
        <section className="panel">
          <h2>Cold / hot pressures (bar)</h2>
          <div className="grid four">
            {CORNERS.map((corner) => (
              <OptionalNumberField
                key={`${corner.id}-c`}
                label={`${corner.label} cold`}
                step={0.05}
                value={state.pressures.cold[corner.id]}
                onChange={(v) =>
                  setPressures({
                    ...state.pressures,
                    cold: { ...state.pressures.cold, [corner.id]: v },
                  })
                }
              />
            ))}
            {CORNERS.map((corner) => (
              <OptionalNumberField
                key={`${corner.id}-h`}
                label={`${corner.label} hot`}
                step={0.05}
                value={state.pressures.hot[corner.id]}
                onChange={(v) =>
                  setPressures({
                    ...state.pressures,
                    hot: { ...state.pressures.hot, [corner.id]: v },
                  })
                }
              />
            ))}
          </div>
        </section>
      )}

      {mode === "temperature" && (
        <section className="panel">
          <h2>Pyrometer °C (outside / middle / inside)</h2>
          {CORNERS.map((corner) => (
            <div className="grid three" key={corner.id}>
              <OptionalNumberField
                label={`${corner.label} outside`}
                value={state.temps[corner.id].outside}
                onChange={(v) =>
                  setTemps({
                    ...state.temps,
                    [corner.id]: { ...state.temps[corner.id], outside: v },
                  })
                }
              />
              <OptionalNumberField
                label={`${corner.label} middle`}
                value={state.temps[corner.id].middle}
                onChange={(v) =>
                  setTemps({
                    ...state.temps,
                    [corner.id]: { ...state.temps[corner.id], middle: v },
                  })
                }
              />
              <OptionalNumberField
                label={`${corner.label} inside`}
                value={state.temps[corner.id].inside}
                onChange={(v) =>
                  setTemps({
                    ...state.temps,
                    [corner.id]: { ...state.temps[corner.id], inside: v },
                  })
                }
              />
            </div>
          ))}
        </section>
      )}

      <div className="row-actions">
        <button className="btn primary" type="button" onClick={() => setRan(true)}>
          Run analysis
        </button>
      </div>
      {result && (
        <section className="panel">
          <h2>Advice</h2>
          <AdviceList result={result} />
        </section>
      )}
    </>
  );
}
