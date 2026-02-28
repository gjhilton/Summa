import { css } from "../generated/css";
import { LsdStrings } from "../types/calculation";
import PenceWorkingRow from "./PenceWorkingRow";
import LedgerRow from "./LedgerRow";
import Logo from "./Logo";
import LsdFieldGroup from "./LsdFieldGroup";

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
  paddingLeft: "sm",
  paddingRight: "sm",
  gap: "xs",
});

const summaMain = css({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
});

export default function Total({
  display,
  totalPence,
  showWorking,
}: TotalProps) {
  return (
    <LedgerRow className={totalRow}>
      <span />
      <span />
      <div className={summaCol}>
        <div className={summaMain}>
          <Logo size="S" />
        </div>
        <PenceWorkingRow showWorking={showWorking} pence={totalPence} />
      </div>
      <LsdFieldGroup
        values={display}
        showWorking={showWorking}
        noBorder
        fmtZero
        dimZero
        weightByZero
      />
      <span />
    </LedgerRow>
  );
}
