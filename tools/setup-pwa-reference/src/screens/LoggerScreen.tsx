import { useMemo, useState } from "react";
import {
  analyzeLogger,
  composeLoggerBriefing,
  formatLapTime,
  parseLoggerCsv,
  type DistancePoint,
  type LoggerAnalysis,
} from "@kartracer/setup-engine";
import type { SessionState } from "../storage";

export function LoggerScreen({ state }: { state: SessionState }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<LoggerAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const briefing = useMemo(() => {
    if (!analysis || !fileName) return null;
    return composeLoggerBriefing({
      fileName,
      analysis,
      setup: state.setup,
      conditions: state.conditions,
    });
  }, [analysis, fileName, state.setup, state.conditions]);

  const onFile = async (file: File) => {
    setCopied(false);
    if (file.name.toLowerCase().endsWith(".zip")) {
      setFileName(file.name);
      setAnalysis(null);
      setWarnings(["Unzip the Alfano/ADA archive and upload the CSV. Zip is not parsed in this build."]);
      return;
    }
    const text = await file.text();
    const parsed = parseLoggerCsv(text);
    const next = analyzeLogger(parsed.samples);
    setFileName(file.name);
    setWarnings([...parsed.warnings, ...next.warnings]);
    setAnalysis(next);
  };

  const best = analysis?.bestLapIndex != null ? analysis.laps[analysis.bestLapIndex] : null;
  const compare =
    analysis?.compareLapIndex != null ? analysis.laps[analysis.compareLapIndex] : null;

  return (
    <>
      <p className="notice">
        Upload a MyChron Race Studio 3 CSV (all channels). We parse it here and compute laps, then write a briefing from those numbers. The raw file is never sent to a language model.
      </p>
      <section className="panel">
        <h2>Import</h2>
        <div className="field">
          <label>
            Race Studio CSV
            <input
              type="file"
              accept=".csv,text/csv,text/plain,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
              }}
            />
          </label>
        </div>
        {warnings.map((w) => (
          <p key={w} className="warn">
            {w}
          </p>
        ))}
      </section>

      {analysis && (
        <section className="panel">
          <h2>Laps</h2>
          <p className="muted">
            {analysis.sampleCount} samples · {analysis.laps.length} timed laps. Best vs last (or next) lap.
          </p>
          {analysis.laps.length === 0 && <p className="warn">No laps timed. Need GPS Speed plus a lap marker, or a GPS loop.</p>}
          {analysis.laps.map((lap, i) => (
            <div className="check" key={lap.index}>
              <div>
                <strong>
                  Lap {lap.index} {i === analysis.bestLapIndex ? "· best" : ""}
                  {i === analysis.compareLapIndex && i !== analysis.bestLapIndex ? " · compare" : ""}
                </strong>
                <div className="muted">
                  {formatLapTime(lap.timeS)}
                  {lap.minSpeedKmh != null ? ` · min ${lap.minSpeedKmh.toFixed(1)} km/h` : ""}
                  {lap.maxRpm != null ? ` · ${lap.maxRpm.toFixed(0)} rpm` : ""}
                  {lap.avgWtC != null ? ` · WT ${lap.avgWtC.toFixed(0)} °C` : ""}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {best && compare && (
        <section className="panel">
          <h2>Speed vs lap distance</h2>
          <SpeedOverlay best={best.trace} compare={best === compare ? null : compare.trace} />
          <div className="chart-legend">
            <span>Yellow = best lap</span>
            {best !== compare && <span>White = compare lap</span>}
          </div>
        </section>
      )}

      {analysis && analysis.verdicts.length > 0 && (
        <section className="panel">
          <h2>Driver vs chassis</h2>
          {analysis.verdicts.map((v) => (
            <article className="advice" key={v.title}>
              <div className="kicker">{v.kind}</div>
              <strong>{v.title}</strong>
              <p>{v.why}</p>
              <div className="source">
                Source:{" "}
                <a href={v.kbSource} target="_blank" rel="noreferrer">
                  {v.kbSource}
                </a>
              </div>
            </article>
          ))}
        </section>
      )}

      {briefing && (
        <section className="panel">
          <h2>Grounded briefing</h2>
          {briefing.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="grid two">
            {briefing.facts.map((f) => (
              <div className="stat" key={f.label}>
                <span className="muted">{f.label}</span>
                <strong style={{ fontSize: 16 }}>{f.value}</strong>
              </div>
            ))}
          </div>
          <p className="muted">
            Optional: copy this prompt into ChatGPT. It contains only computed facts, not the CSV. Trackside use the briefing above — it works offline.
          </p>
          <textarea className="prompt-box" readOnly value={briefing.llmPrompt} />
          <div className="row-actions">
            <button
              className="btn"
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(briefing.llmPrompt);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy grounded prompt"}
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function SpeedOverlay({
  best,
  compare,
}: {
  best: DistancePoint[];
  compare: DistancePoint[] | null;
}) {
  const w = 640;
  const h = 160;
  const pad = 12;
  const speeds = [...best, ...(compare ?? [])].map((p) => p.speedKmh);
  const min = Math.min(...speeds);
  const max = Math.max(...speeds);
  const x = (d: number) => pad + d * (w - 2 * pad);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (h - 2 * pad);
  const path = (pts: DistancePoint[]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${x(p.dist).toFixed(1)},${y(p.speedKmh).toFixed(1)}`).join(" ");
  return (
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Speed overlay">
      <path d={path(best)} fill="none" stroke="#e8c547" strokeWidth="2.5" />
      {compare && <path d={path(compare)} fill="none" stroke="#e8edf5" strokeWidth="2" opacity="0.85" />}
    </svg>
  );
}
