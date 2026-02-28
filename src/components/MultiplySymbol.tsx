import { css } from "../generated/css";

const symbol = css({
  display: "inline-block",
  position: "relative",
  width: "0.5em",
  height: "0.5em",
  transform: "rotate(45deg) scale(0.5)",
  _before: {
    content: '""',
    position: "absolute",
    width: "2px",
    height: "100%",
    left: "50%",
    top: "0",
    transform: "translateX(-50%)",
    bg: "currentColor",
  },
  _after: {
    content: '""',
    position: "absolute",
    height: "2px",
    width: "100%",
    top: "50%",
    left: "0",
    transform: "translateY(-50%)",
    bg: "currentColor",
  },
});

export default function MultiplySymbol() {
  return <span className={symbol} aria-hidden="true" />;
}
