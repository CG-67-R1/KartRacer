import type { Advice, AnalysisResult } from "@kartracer/setup-engine";
import { LEVER_LABELS } from "@kartracer/setup-engine";

export function AdviceList({ result }: { result: AnalysisResult }) {
  return (
    <div>
      <p className="notice">{result.reminder}</p>
      {result.warnings.map((warning) => (
        <p key={warning} className="warn">
          {warning}
        </p>
      ))}
      {result.advice.map((item, index) => (
        <AdviceCard key={item.id} item={item} first={index === 0} />
      ))}
      {result.blocked.length > 0 && (
        <div className="panel" style={{ marginTop: 12 }}>
          <h2>Already at the recorded limit</h2>
          {result.blocked.map((item) => (
            <AdviceCard key={item.id} item={item} blocked />
          ))}
        </div>
      )}
    </div>
  );
}

function AdviceCard({
  item,
  first,
  blocked,
}: {
  item: Advice;
  first?: boolean;
  blocked?: boolean;
}) {
  return (
    <article className={`advice${first ? " first" : ""}${blocked ? " blocked" : ""}`}>
      {first && !blocked && <div className="kicker">Do this first</div>}
      {blocked && <div className="kicker">Blocked by sheet</div>}
      <strong>{item.title}</strong>
      <div className="muted">
        {LEVER_LABELS[item.lever]} · {item.direction}
        {item.magnitude ? ` · ${item.magnitude}` : ""}
      </div>
      <p>{item.why}</p>
      {item.polarityNote === "950_may_invert" && (
        <p className="warn">
          950 / Bambino: axle polarity can invert versus 1050 literature. If this fails, try the opposite.
        </p>
      )}
      <div className="source">
        Source:{" "}
        <a href={item.kbSource} target="_blank" rel="noreferrer">
          {item.kbSource}
        </a>
      </div>
    </article>
  );
}
