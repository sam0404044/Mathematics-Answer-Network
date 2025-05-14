import styles from "./HeroSection.module.css";

export default function HeroSection() {
  return (
    <header className={styles.hero}>
      <img src="/img/hero1.png" className={styles.img1}></img>
      <img src="/img/hero2.png" className={styles.img2}></img>
      <img src="/img/hero3.png" className={styles.img3}></img>
      <img src="/img/hero4.png" className={styles.img4}></img>
      <img src="/img/hero5.png" className={styles.img5}></img>
      <img src="/img/hero6.png" className={styles.img6}></img>
      <img src="/img/hero7.png" className={styles.img7}></img>
      <img src="/img/hero8.png" className={styles.img8}></img>
      <img src="/img/hero9.png" className={styles.img9}></img>
      <img src="/img/hero10.png" className={styles.img10}></img>

      <div className={styles["triangle-left"]}></div>
      <div className={styles.circle}></div>
      <div className={styles["triangle-right"]}></div>
    </header>
  );
}
