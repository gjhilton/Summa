import { useState, useEffect } from "react";
import MainScreen from "./components/MainScreen";
import AboutScreen from "./components/AboutScreen";
import UnsupportedScreen from "./components/UnsupportedScreen";
import { usePreferences } from "./state/preferences";

const PORTRAIT_MOBILE = "(max-width: 600px) and (orientation: portrait)";

function useIsPortraitMobile() {
  const [matches, setMatches] = useState(
    () => window.matchMedia(PORTRAIT_MOBILE).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_MOBILE);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return matches;
}

const VISITED_KEY = "summa_visited";

export default function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    try {
      return !localStorage.getItem(VISITED_KEY);
    } catch {
      return false;
    }
  });
  const [screen, setScreen] = useState<"main" | "about">(() =>
    isFirstVisit ? "about" : "main",
  );
  const isPortraitMobile = useIsPortraitMobile();
  const [prefs, updatePrefs] = usePreferences();

  function handleGetStarted() {
    try {
      localStorage.setItem(VISITED_KEY, "1");
    } catch {
      /* ignore */
    }
    setIsFirstVisit(false);
    setScreen("main");
  }

  if (isPortraitMobile) return <UnsupportedScreen />;

  if (screen === "about") {
    return (
      <AboutScreen
        onClose={() => setScreen("main")}
        isFirstVisit={isFirstVisit}
        onGetStarted={handleGetStarted}
      />
    );
  }

  return (
    <MainScreen
      onAbout={() => setScreen("about")}
      useExtendedItem={prefs.useExtendedItem}
      onUseExtendedItemChange={(v) => updatePrefs({ useExtendedItem: v })}
    />
  );
}
