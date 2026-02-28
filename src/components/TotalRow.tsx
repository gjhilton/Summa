import { css } from "../generated/css";
import { LsdStrings } from "../types/calculation";
import PenceWorkingRow from "./PenceWorkingRow";
import Logo from "./Logo";
import CurrencyFields from "./CurrencyFields";
import ItemRow from "./ItemRow";

interface TotalRowProps {
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

export default function TotalRow({ display, totalPence, showWorking }: TotalRowProps) {
  return (
    <ItemRow
      className={totalRow}
      title={
        <div className={summaCol}>
          <div className={summaMain}>
            <Logo size="S" />
          </div>
          <PenceWorkingRow showWorking={showWorking} pence={totalPence} />
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
