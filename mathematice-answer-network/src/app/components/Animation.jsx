import { useEffect, useRef } from "react";
import styles from "./Animation.module.css";

export default function Animation() {
  const containerRef = useRef(null);

  useEffect(function () {
    const container = containerRef.current;
    if (!container) return;

    const handleAnimationEnd = function (e) {
      if (e.target !== container) return;
      container.style.pointerEvents = "none";
    };

    container.addEventListener("animationend", handleAnimationEnd);

    return () => {
      container.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles["animation-container"]}>
      <div className={styles["animation-triangle-left"]}></div>
      <h1 className={styles["animation-text"]}>數學答題王</h1>
      <div className={styles["animation-triangle-right"]}></div>
    </div>
  );
}
