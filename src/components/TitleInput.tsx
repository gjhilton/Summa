import { cx } from "../generated/css";
import { titleInput } from "../styles/shared";

interface TitleInputProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function TitleInput({ value, onChange, className, style }: TitleInputProps) {
  return (
    <input
      className={cx(titleInput, className)}
      style={style}
      value={value}
      placeholder="Item"
      aria-label="title (optional)"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
