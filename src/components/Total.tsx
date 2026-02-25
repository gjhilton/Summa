import { css } from "../generated/css";
import { LsdStrings } from "../types/calculation";
import { computeFieldWorking } from "../state/calculationLogic";
import { workingRowStyles } from "../styles/shared";
import Field from "./Field";
import LedgerRow from "./LedgerRow";
import Logo from "./Logo";

interface TotalProps {
  display: LsdStrings;
  totalPence: number;
  showWorking: boolean;
}

const totalRow = css({
  borderTopWidth: "medium",
  borderTopStyle: "solid",
  borderTopColor: "ink",
  marginBottom: "6rem",
  marginTop: "0.5rem",
  paddingTop: "2rem",
});

const summaCol = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  paddingLeft: "xs",
  paddingRight: "xs",
  gap: "xs",
});

const summaMain = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

const summaWorkingRow = css({
  ...workingRowStyles,
  whiteSpace: "nowrap",
});

const supD = css({ marginLeft: "2px" });

const dimmed = css({ opacity: "0.3" });

function fmt(v: string) {
  return v === "0" ? "—" : v;
}

export default function Total({
  display,
  totalPence,
  showWorking,
}: TotalProps) {
  const toNode = (result: ReturnType<typeof computeFieldWorking>) =>
    result ? (
      <>
        {result.prefix}
        {result.pence}
        <sup className={supD}>d</sup>
      </>
    ) : undefined;

  const working = showWorking
    ? {
        l: toNode(computeFieldWorking(display.l, "l")),
        s: toNode(computeFieldWorking(display.s, "s")),
        d: toNode(computeFieldWorking(display.d, "d")),
      }
    : undefined;

  return (
    <LedgerRow className={totalRow}>
      <span />
      <span />
      <div className={summaCol}>
        <div className={summaMain}>
          <Logo size="S" />
        </div>
        {showWorking && (
          <span className={summaWorkingRow}>
            {totalPence > 0 && (
              <>
                {totalPence}
                <sup className={supD}>d</sup> =
              </>
            )}
          </span>
        )}
      </div>
      <Field
        value={fmt(display.l)}
        label="l"
        noBorder
        weight={display.l !== "0" ? "bold" : "light"}
        showWorking={showWorking}
        working={working?.l}
        className={display.l === "0" ? dimmed : undefined}
      />
      <Field
        value={fmt(display.s)}
        label="s"
        noBorder
        weight={display.s !== "0" ? "bold" : "light"}
        showWorking={showWorking}
        working={working?.s}
        className={display.s === "0" ? dimmed : undefined}
      />
      <Field
        value={fmt(display.d)}
        label="d"
        noBorder
        weight={display.d !== "0" ? "bold" : "light"}
        showWorking={showWorking}
        working={working?.d}
        className={display.d === "0" ? dimmed : undefined}
      />
      <span />
    </LedgerRow>
  );
}
