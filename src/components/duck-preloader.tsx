import { useLottie } from "lottie-react";
import mainLogoData from "../assets/main-logo.json";
import { useRef, useState } from "react";

export function DuckPreloader(
  props: Readonly<{ loading: boolean; persist: boolean }>,
) {
  const { loading, persist } = props;
  const hideTimer = useRef(null as number | null);
  const [completed, setCompleted] = useState(false);
  const lottieObj = useLottie({
    animationData: mainLogoData,
    loop: false,
    autoPlay: false,
    playsInline: false,
  });
  const { View: AnimationView } = lottieObj;
  if (!loading && !persist) {
    if (!completed && !hideTimer.current) {
      hideTimer.current = setTimeout(() => {
        setCompleted(true);
      }, 450);
    }
    if (completed) {
      return null;
    }
  }

  return (
    <div
      className={`duckLogo duckPreloader ${!persist ? "hideCompleted" : ""} ${
        loading ? "loading" : ""
      }`.trim()}
    >
      {AnimationView}
    </div>
  );
}
