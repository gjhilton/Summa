import { css } from "../generated/css";
import CalculationData from "../state/CalculationData";
import Footer from "./Footer";
import PageLayout from "./PageLayout";

interface MainScreenProps {
  onAbout: () => void;
  useItemWithQuantity: boolean;
}

const header = css({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginBottom: "5xl",
});

const aboutLink = css({
  fontSize: "s",
  cursor: "pointer",
  textDecoration: "underline",
  color: "ink",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  padding: 0,
  _hover: { opacity: 0.6 },
});

export default function MainScreen({
  onAbout,
  useItemWithQuantity,
}: MainScreenProps) {
  return (
    <PageLayout>
      <header className={header}>
        <button
          type="button"
          className={aboutLink}
          aria-label="About"
          onClick={onAbout}
        >
          About
        </button>
      </header>
      <CalculationData useItemWithQuantity={useItemWithQuantity} />
      <Footer />
    </PageLayout>
  );
}
