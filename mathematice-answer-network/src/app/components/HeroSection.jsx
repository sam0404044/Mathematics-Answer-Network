import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles["triangle-left"]}></div>
      <div className={styles.circle}></div>
      <div className={styles["triangle-right"]}></div>
    </header>
  );
}
