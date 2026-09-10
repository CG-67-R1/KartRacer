import { useMemo, useState } from "react";
import {
  airDensity,
  analyzeCornerWeights,
  barToPsi,
  cToF,
  casterFromSweep,
  fuelMix,
  gearing,
  JETTING_DIRECTION,
  kgToLb,
  mmToIn,
  nextMainJet,
  planBallast,
  psiToBar,
  radPercentFromWeather,
} from "@kartracer/setup-engine";
import { NumberField } from "../components/Fields";

type ToolId = "weights" | "air" | "jetting" | "fuel" | "gearing" | "caster" | "units";

export function ToolsScreen() {
  const [tool, setTool] = useState<ToolId>("weights");

  return (
    <>
      <p className="notice">
        Technician tools: textbook formulas. No lap-time claims. Confirm class regs for fuel, weight, and gearing.
      </p>
      <div className="subtabs">
        {(
          [
            ["weights", "Weights"],
            ["air", "Air"],
            ["jetting", "Jetting"],
            ["fuel", "Fuel"],
            ["gearing", "Gearing"],
            ["caster", "Caster sweep"],
            ["units", "Units"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            className={`btn${tool === id ? " primary" : ""}`}
            type="button"
            onClick={() => setTool(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {tool === "weights" && <WeightsTool />}
      {tool === "air" && <AirTool />}
      {tool === "jetting" && <JettingTool />}
      {tool === "fuel" && <FuelTool />}
      {tool === "gearing" && <GearingTool />}
      {tool === "caster" && <CasterTool />}
      {tool === "units" && <UnitsTool />}
    </>
  );
}

function WeightsTool() {
  const [fl, setFl] = useState(21.5);
  const [fr, setFr] = useState(21.5);
  const [rl, setRl] = useState(28.5);
  const [rr, setRr] = useState(28.5);
  const weights = { fl, fr, rl, rr };
  const analysis = useMemo(() => analyzeCornerWeights(weights), [fl, fr, rl, rr]);
  const plan = useMemo(() => planBallast(weights), [fl, fr, rl, rr]);

  return (
    <section className="panel">
      <h2>Corner weights</h2>
      <p className="muted">
        Driver in full kit, race fuel, level pads, steering straight. Target ~43% front / 57% rear, 50/50 left-right.
      </p>
      <div className="grid four">
        <NumberField label="FL kg" value={fl} step={0.1} onChange={setFl} />
        <NumberField label="FR kg" value={fr} step={0.1} onChange={setFr} />
        <NumberField label="RL kg" value={rl} step={0.1} onChange={setRl} />
        <NumberField label="RR kg" value={rr} step={0.1} onChange={setRr} />
      </div>
      <div className="grid four" style={{ marginTop: 12 }}>
        <div className="stat">
          <span className="muted">Total</span>
          <strong>{analysis.totalKg} kg</strong>
        </div>
        <div className="stat">
          <span className="muted">Front / rear</span>
          <strong>
            {analysis.frontPct}% / {analysis.rearPct}%
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Left / right</span>
          <strong>
            {analysis.leftPct}% / {analysis.rightPct}%
          </strong>
        </div>
        <div className="stat">
          <span className="muted">Cross (FL+RR)</span>
          <strong>{analysis.crossPct}%</strong>
        </div>
      </div>
      {analysis.notes.map((note) => (
        <p key={note} className="muted">
          {note}
        </p>
      ))}
      <p>{plan.summary}</p>
      <div className="source">
        Source:{" "}
        <a href={plan.kbSource} target="_blank" rel="noreferrer">
          {plan.kbSource}
        </a>
      </div>
    </section>
  );
}

function AirTool() {
  const [tempC, setTempC] = useState(15);
  const [pressureHpa, setPressureHpa] = useState(1013.25);
  const [rh, setRh] = useState(50);
  const result = useMemo(
    () => airDensity({ tempC, pressureHpa, relativeHumidityPct: rh }),
    [tempC, pressureHpa, rh],
  );

  return (
    <section className="panel">
      <h2>Air density</h2>
      <div className="grid three">
        <NumberField label="Temp °C" value={tempC} step={0.1} onChange={setTempC} />
        <NumberField label="Pressure hPa" value={pressureHpa} step={0.1} onChange={setPressureHpa} />
        <NumberField label="RH %" value={rh} onChange={setRh} />
      </div>
      <div className="grid three" style={{ marginTop: 12 }}>
        <div className="stat">
          <span className="muted">Density</span>
          <strong>{result.densityKgM3} kg/m³</strong>
        </div>
        <div className="stat">
          <span className="muted">Relative air density</span>
          <strong>{result.relativeAirDensity}</strong>
        </div>
        <div className="stat">
          <span className="muted">Density altitude</span>
          <strong>
            {result.densityAltitudeM} m / {result.densityAltitudeFt} ft
          </strong>
        </div>
      </div>
      <p className="muted">RAD % = relative air density × 100. Use the Jetting tab with a stopwatch-proven baseline stamp.</p>
    </section>
  );
}

function JettingTool() {
  const [stamp, setStamp] = useState(60);
  const [radBase, setRadBase] = useState(94);
  const [tempC, setTempC] = useState(25);
  const [pressureHpa, setPressureHpa] = useState(1013.25);
  const [rh, setRh] = useState(50);
  const [radNew, setRadNew] = useState<number | null>(null);

  const computedRad = useMemo(
    () => radPercentFromWeather({ tempC, pressureHpa, relativeHumidityPct: rh }),
    [tempC, pressureHpa, rh],
  );
  const rad = radNew ?? computedRad;
  const result = useMemo(
    () => nextMainJet({ baselineStamp: stamp, radBasePct: radBase, radNewPct: rad }),
    [stamp, radBase, rad],
  );

  return (
    <section className="panel">
      <h2>Main jet from RAD</h2>
      <p className="muted">
        Baseline is a jet that was fast on the stopwatch at a known RAD. Hotter / higher / more humid → smaller jet.
        Confirm class stamps. Source: jetting and air density.
      </p>
      <div className="grid two">
        <NumberField label="Baseline stamp" value={stamp} onChange={setStamp} />
        <NumberField label="Baseline RAD %" value={radBase} step={0.1} onChange={setRadBase} />
        <NumberField label="Temp °C" value={tempC} step={0.1} onChange={setTempC} />
        <NumberField label="Pressure hPa" value={pressureHpa} step={0.1} onChange={setPressureHpa} />
        <NumberField label="RH %" value={rh} onChange={setRh} />
        <NumberField
          label="New RAD % (blank = from weather)"
          value={rad}
          step={0.1}
          onChange={setRadNew}
        />
      </div>
      <div className="grid three" style={{ marginTop: 12 }}>
        <div className="stat">
          <span className="muted">Today RAD</span>
          <strong>{rad.toFixed(1)}%</strong>
        </div>
        <div className="stat">
          <span className="muted">Suggested stamp</span>
          <strong>{result.suggestedStamp}</strong>
        </div>
        <div className="stat">
          <span className="muted">Flow factor</span>
          <strong>{result.flowFactor}</strong>
        </div>
      </div>
      <p>{result.summary}</p>
      <p className="muted">
        Direction: hotter → {JETTING_DIRECTION.hotter}; colder → {JETTING_DIRECTION.colder}. Peak 2-stroke power often
        near λ 0.86 (Micro/Mini nearer 1.0).
      </p>
      <div className="source">
        Source:{" "}
        <a href={result.kbSource} target="_blank" rel="noreferrer">
          {result.kbSource}
        </a>
      </div>
    </section>
  );
}

function FuelTool() {
  const [litres, setLitres] = useState(10);
  const [ratio, setRatio] = useState(50);
  const result = useMemo(() => fuelMix(litres, ratio), [litres, ratio]);

  return (
    <section className="panel">
      <h2>Fuel mix</h2>
      <div className="grid two">
        <NumberField label="Fuel litres" value={litres} step={0.1} onChange={setLitres} />
        <NumberField label="Ratio (fuel:oil)" value={ratio} onChange={setRatio} />
      </div>
      <p>{result.summary}</p>
      <div className="stat">
        <span className="muted">Oil</span>
        <strong>
          {result.oilMl} ml / {result.oilOz} fl oz
        </strong>
      </div>
    </section>
  );
}

function GearingTool() {
  const [front, setFront] = useState(11);
  const [rear, setRear] = useState(78);
  const [circ, setCirc] = useState(860);
  const [rpm, setRpm] = useState(13500);
  const result = useMemo(
    () => gearing({ frontTeeth: front, rearTeeth: rear, tyreCircumferenceMm: circ, engineRpm: rpm }),
    [front, rear, circ, rpm],
  );

  return (
    <section className="panel">
      <h2>Gearing / rollout</h2>
      <div className="grid two">
        <NumberField label="Front teeth" value={front} onChange={setFront} />
        <NumberField label="Rear teeth" value={rear} onChange={setRear} />
        <NumberField label="Tyre circumference mm" value={circ} onChange={setCirc} />
        <NumberField label="Engine rpm" value={rpm} onChange={setRpm} />
      </div>
      <div className="grid three" style={{ marginTop: 12 }}>
        <div className="stat">
          <span className="muted">Ratio</span>
          <strong>{result.ratio}:1</strong>
        </div>
        <div className="stat">
          <span className="muted">Rollout</span>
          <strong>{result.rolloutMm} mm</strong>
        </div>
        <div className="stat">
          <span className="muted">Speed at rpm</span>
          <strong>{result.speedAtRpmKmh ?? "—"} km/h</strong>
        </div>
      </div>
      <p>{result.summary}</p>
      <p className="warn">{result.wetSuggestion}</p>
      <div className="source">
        Source:{" "}
        <a href={result.kbSource} target="_blank" rel="noreferrer">
          {result.kbSource}
        </a>
      </div>
    </section>
  );
}

function CasterTool() {
  const [left, setLeft] = useState(8);
  const [right, setRight] = useState(8);
  const result = useMemo(() => casterFromSweep(left, right), [left, right]);

  return (
    <section className="panel">
      <h2>Caster sweep helper</h2>
      <p className="muted">
        Ruler on the floor pan, steer L/R, compare laser height. Match within ~2 mm. About 4 mm ≈ 1°. Approximate — scales with kart width and laser spacing.
      </p>
      <div className="grid two">
        <NumberField label="Left height mm" value={left} step={0.5} onChange={setLeft} />
        <NumberField label="Right height mm" value={right} step={0.5} onChange={setRight} />
      </div>
      <p className={result.matched ? "ok" : "warn"}>{result.summary}</p>
      <div className="source">
        Source:{" "}
        <a href={result.kbSource} target="_blank" rel="noreferrer">
          {result.kbSource}
        </a>
      </div>
    </section>
  );
}

function UnitsTool() {
  const [bar, setBar] = useState(1);
  const [c, setC] = useState(20);
  const [kg, setKg] = useState(100);
  const [mm, setMm] = useState(1050);
  const [psi, setPsi] = useState(14.5);

  return (
    <section className="panel">
      <h2>Unit conversion</h2>
      <div className="grid two">
        <NumberField label="Bar" value={bar} step={0.05} onChange={setBar} />
        <div className="stat">
          <span className="muted">PSI</span>
          <strong>{barToPsi(bar).toFixed(2)}</strong>
        </div>
        <NumberField label="PSI" value={psi} step={0.1} onChange={setPsi} />
        <div className="stat">
          <span className="muted">Bar</span>
          <strong>{psiToBar(psi).toFixed(3)}</strong>
        </div>
        <NumberField label="°C" value={c} onChange={setC} />
        <div className="stat">
          <span className="muted">°F</span>
          <strong>{cToF(c).toFixed(1)}</strong>
        </div>
        <NumberField label="kg" value={kg} step={0.1} onChange={setKg} />
        <div className="stat">
          <span className="muted">lb</span>
          <strong>{kgToLb(kg).toFixed(2)}</strong>
        </div>
        <NumberField label="mm" value={mm} onChange={setMm} />
        <div className="stat">
          <span className="muted">inches</span>
          <strong>{mmToIn(mm).toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
}
