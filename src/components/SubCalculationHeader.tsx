import { css } from "../generated/css";
import { IdPath } from "../state/calculationLogic";

interface SubCalculationHeaderProps {
  breadcrumbs: Array<{ id: string; title: string; path: IdPath }>;
  title: string;
  onTitleChange: (v: string) => void;
  onNavigate: (path: IdPath) => void;
}

const header = css({
  display: "flex",
  flexDirection: "column",
  gap: "sm",
  marginBottom: "lg",
  paddingBottom: "lg",
  borderBottomWidth: "thin",
  borderBottomStyle: "solid",
  borderBottomColor: "ink",
});

const breadcrumbRow = css({
  display: "flex",
  alignItems: "center",
  gap: "xs",
  fontSize: "s",
  flexWrap: "wrap",
});

const breadcrumbBtn = css({
  background: "transparent",
  borderWidth: "0",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: "inherit",
  color: "inherit",
  opacity: "0.6",
  padding: "0",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  _hover: { opacity: "1" },
});

const breadcrumbSep = css({
  opacity: "0.4",
  userSelect: "none",
});

const breadcrumbCurrent = css({
  opacity: "0.8",
});

const heading = css({
  fontSize: "m",
  fontStyle: "italic",
  opacity: "0.5",
  userSelect: "none",
});

const titleInput = css({
  width: "100%",
  background: "transparent",
  borderWidth: "0",
  outlineWidth: "0",
  fontSize: "xl",
  fontFamily: "inherit",
  color: "inherit",
  _placeholder: { opacity: "0.3" },
});

export default function SubCalculationHeader({
  breadcrumbs,
  title,
  onTitleChange,
  onNavigate,
}: SubCalculationHeaderProps) {
  return (
    <div className={header}>
      <nav className={breadcrumbRow} aria-label="Breadcrumb">
        {breadcrumbs.slice(0, -1).map((crumb) => (
          <span key={crumb.id || "root"} style={{ display: "contents" }}>
            <button
              type="button"
              className={breadcrumbBtn}
              onClick={() => onNavigate(crumb.path)}
            >
              {crumb.title}
            </button>
            <span className={breadcrumbSep} aria-hidden="true">/</span>
          </span>
        ))}
        {breadcrumbs.length > 0 && (
          <span className={breadcrumbCurrent}>
            {breadcrumbs[breadcrumbs.length - 1].title}
          </span>
        )}
      </nav>
      <div className={heading}>Summa paginae</div>
      <input
        className={titleInput}
        value={title}
        placeholder="Untitled sub-calculation"
        onChange={(e) => onTitleChange(e.target.value)}
        aria-label="Sub-calculation title"
      />
    </div>
  );
}
