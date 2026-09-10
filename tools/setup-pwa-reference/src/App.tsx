import { useEffect, useState } from "react";
import { RULES_VERSION } from "@kartracer/setup-engine";
import { AnalysisScreen } from "./screens/AnalysisScreen";
import { ChassisScreen } from "./screens/ChassisScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { LoggerScreen } from "./screens/LoggerScreen";
import { ToolsScreen } from "./screens/ToolsScreen";
import { defaultSession, loadSession, newSheet, saveSession, type SessionState } from "./storage";

type Tab = "chassis" | "history" | "analysis" | "logger" | "tools";

export function App() {
  const [tab, setTab] = useState<Tab>("chassis");
  const [state, setState] = useState<SessionState>(defaultSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadSession());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveSession(state);
  }, [state, ready]);

  return (
    <div className="app">
      <div className="stripe" />
      <header className="header">
        <div>
          <div className="brand">KARTRACER</div>
          <h1>Chassis setup</h1>
          <p className="lede">
            Advisor for handling and tyres, plus paddock calculators. Original KartRacer tool — not a clone of
            commercial setup apps.
          </p>
        </div>
        <div className="badge">Rules {RULES_VERSION.handling}</div>
      </header>
      <nav className="tabs">
        {(
          [
            ["chassis", "Chassis"],
            ["history", "History"],
            ["analysis", "Analysis"],
            ["logger", "Logger"],
            ["tools", "Tools"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={tab === id ? "active" : ""} type="button" onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>
      {tab === "chassis" && (
        <>
          <ChassisScreen setup={state.setup} onChange={(setup) => setState({ ...state, setup })} />
          <div className="row-actions">
            <button className="btn" type="button" onClick={() => setState(newSheet(state))}>
              New sheet
            </button>
          </div>
        </>
      )}
      {tab === "history" && <HistoryScreen state={state} onChange={setState} />}
      {tab === "analysis" && <AnalysisScreen state={state} onChange={setState} />}
      {tab === "logger" && <LoggerScreen state={state} />}
      {tab === "tools" && <ToolsScreen />}
    </div>
  );
}
