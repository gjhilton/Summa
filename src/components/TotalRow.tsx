import { css } from "../generated/css";
import { LsdStrings } from "../types/calculation";
import { workingRowNowrap } from "../styles/shared";
import PenceWorkingRow from "./PenceWorkingRow";
import Logo from "./Logo";
import CurrencyFields from "./CurrencyFields";
import ItemRow from "./ItemRow";

interface TotalRowProps {
  display: LsdStrings;
  totalPence: number;
  showWorking: boolean;
  isSubLevel?: boolean;
  itemCount?: number;
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

const workingAnnotationRow = css({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  width: "100%",
});

const summaPageText = css({
  fontFamily: "joscelyn",
  fontSize: "m",
  textAlign: "right",
});

export default function TotalRow({
  display,
  totalPence,
  showWorking,
  isSubLevel = false,
  itemCount,
}: TotalRowProps) {
  return (
    <ItemRow
      className={totalRow}
      title={
        <div className={summaCol}>
          <div className={summaMain}>
            {isSubLevel
              ? <span className={summaPageText}>Summa paginae</span>
              : <Logo size="S" />}
          </div>
          {showWorking && (
            <div className={workingAnnotationRow}>
              <span className={workingRowNowrap}>Items: {itemCount}</span>
              <PenceWorkingRow showWorking={showWorking} pence={totalPence} />
            </div>
          )}
        </div>
      }
      currency={
        <CurrencyFields
          values={display}
          showWorking={showWorking}
          noBorder
          fmtZero
          dimZero
          weightByZero
        />
      }
    />
  );
}
