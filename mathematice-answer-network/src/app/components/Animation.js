import { useEffect, useRef } from "react";
import styles from "./Animation.module.css";

export default function Animation() {
  const containerRef = useRef(null);

  useEffect(function () {
    if (!containerRef.current) return;

    const handleAnimationEnd = function (e) {
      if (e.target !== containerRef.current) return;
      containerRef.current.style.pointerEvents = "none";
    };

    containerRef.current.addEventListener("animationend", handleAnimationEnd);

    return () => {
      if (containerRef.current) containerRef.current.removeEventListener("animationend", handleAnimationEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles["animation-container"]}>
      <div className={styles["animation-triangle-left"]}></div>
      <h1 className={styles["animation-text"]}>MWBB</h1>
      <div className={styles["animation-triangle-right"]}></div>
    </div>
  );
}
