import { useMemo, useState } from "react";
import {
  createSnapshot,
  diffSnapshots,
  diffSummary,
  removeSnapshot,
  restoreSnapshot,
  type SetupSnapshot,
} from "@kartracer/setup-engine";
import type { SessionState } from "../storage";

export function HistoryScreen({
  state,
  onChange,
}: {
  state: SessionState;
  onChange: (state: SessionState) => void;
}) {
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [fromId, setFromId] = useState("current");
  const [toId, setToId] = useState(state.history[0]?.id ?? "current");

  const currentSnap: SetupSnapshot = useMemo(
    () => ({
      id: "current",
      createdAt: "",
      label: "Current sheet",
      note: "",
      setup: state.setup,
      conditions: state.conditions,
      pressures: state.pressures,
      temps: state.temps,
    }),
    [state.setup, state.conditions, state.pressures, state.temps],
  );

  const resolve = (id: string): SetupSnapshot =>
    id === "current" ? currentSnap : (state.history.find((item) => item.id === id) ?? currentSnap);

  const save = () => {
    const snapshot = createSnapshot({
      setup: state.setup,
      conditions: state.conditions,
      pressures: state.pressures,
      temps: state.temps,
      label: label || undefined,
      note,
    });
    onChange({ ...state, history: [snapshot, ...state.history] });
    setLabel("");
    setNote("");
    setToId(snapshot.id);
  };

  const restore = (snapshot: SetupSnapshot) => {
    const restored = restoreSnapshot(snapshot);
    onChange({ ...state, ...restored });
  };

  const from = resolve(fromId);
  const to = resolve(toId);
  const rows = fromId === toId ? [] : diffSnapshots(from, to);

  return (
    <>
      <p className="notice">
        Snapshots stay on this device. Save before you change a lever so you can compare sessions.
      </p>
      <section className="panel">
        <h2>Save current sheet</h2>
        <div className="grid two">
          <div className="field">
            <label>
              Label
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={state.setup.name} />
            </label>
          </div>
          <div className="field">
            <label>
              Note
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Track, session, weather…" />
            </label>
          </div>
        </div>
        <div className="row-actions">
          <button className="btn primary" type="button" onClick={save}>
            Save snapshot
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Compare sheets</h2>
        <p className="muted">What changed between two snapshots — not a lap-time prediction.</p>
        <div className="grid two">
          <div className="field">
            <label>
              From
              <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
                <option value="current">Current sheet</option>
                {state.history.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="field">
            <label>
              To
              <select value={toId} onChange={(e) => setToId(e.target.value)}>
                <option value="current">Current sheet</option>
                {state.history.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {state.history.length === 0 ? (
          <p className="muted">Save at least one snapshot to diff against the current sheet.</p>
        ) : (
          <>
            <p>{diffSummary(rows)}</p>
            {rows.length > 0 && (
              <table className="diff-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.path}>
                      <td>{row.label}</td>
                      <td>{row.from}</td>
                      <td className="to">{row.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </section>

      <section className="panel">
        <h2>History</h2>
        {state.history.length === 0 && <p className="muted">No snapshots yet.</p>}
        {state.history.map((item) => (
          <div className="history-item" key={item.id}>
            <div>
              <strong>{item.label}</strong>
              <div className="muted">
                {new Date(item.createdAt).toLocaleString()} · {item.setup.wheelbase} · {item.conditions.wet ? "wet" : item.conditions.grip}
              </div>
              {item.note && <div className="muted">{item.note}</div>}
            </div>
            <div className="row-actions">
              <button className="btn" type="button" onClick={() => restore(item)}>
                Restore
              </button>
              <button
                className="btn danger"
                type="button"
                onClick={() => onChange({ ...state, history: removeSnapshot(state.history, item.id) })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
