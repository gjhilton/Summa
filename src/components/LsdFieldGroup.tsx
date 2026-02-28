import { css } from "../generated/css";
import { LsdStrings, LsdBooleans } from "../types/calculation";
import { computeFieldWorking } from "../state/calculationLogic";
import { supD } from "../styles/shared";
import Field from "./Field";

interface LsdFieldGroupProps {
  values: LsdStrings;
  showWorking: boolean;
  hasError?: boolean;
  fieldErrors?: LsdBooleans;
  onChange?: (f: "l" | "s" | "d", v: string) => void;
  noBorder?: boolean;
  fmtZero?: boolean;
  dimZero?: boolean;
  weightByZero?: boolean;
}


const dimmedClass = css({ opacity: "0.3" });

function fmt(v: string) {
  return v === "0" ? "—" : v;
}

function renderWorkingNode(result: ReturnType<typeof computeFieldWorking>) {
  if (!result) return undefined;
  return (
    <>
      {result.prefix}
      {result.pence}
      <sup className={supD}>d</sup>
    </>
  );
}

function buildLsdWorking(
  values: LsdStrings,
  showWorking: boolean,
  hasError: boolean,
) {
  if (!showWorking || hasError) return undefined;
  return {
    l: renderWorkingNode(computeFieldWorking(values.l, "l")),
    s: renderWorkingNode(computeFieldWorking(values.s, "s")),
    d: renderWorkingNode(computeFieldWorking(values.d, "d")),
  };
}

export default function LsdFieldGroup({
  values,
  showWorking,
  hasError = false,
  fieldErrors,
  onChange,
  noBorder,
  fmtZero,
  dimZero,
  weightByZero,
}: LsdFieldGroupProps) {
  const working = buildLsdWorking(values, showWorking, hasError);
  return (
    <>
      {(["l", "s", "d"] as const).map((f) => {
        const isZero = values[f] === "0";
        return (
          <Field
            key={f}
            value={fmtZero ? fmt(values[f]) : values[f]}
            label={f}
            error={fieldErrors?.[f] ?? false}
            noBorder={noBorder}
            weight={weightByZero ? (isZero ? "light" : "bold") : undefined}
            className={dimZero && isZero ? dimmedClass : undefined}
            showWorking={showWorking}
            working={working?.[f]}
            onChange={onChange ? (v) => onChange(f, v) : undefined}
          />
        );
      })}
    </>
  );
}
