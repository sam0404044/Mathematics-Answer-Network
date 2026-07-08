import styles from "./HeroSection.module.css";
import Image from "next/image";

export default function HeroSection() {
  return (
    <header className={styles.hero}>
      <Image src="/img/hero1.png" className={styles.img1} width={1024} height={1024} alt="" priority />
      <Image src="/img/hero2.png" className={styles.img2} width={1024} height={1024} alt="" priority />
      <Image src="/img/hero3.png" className={styles.img3} width={1024} height={1024} alt="" />
      <Image src="/img/hero4.png" className={styles.img4} width={1024} height={1024} alt="" />
      <Image src="/img/hero5.png" className={styles.img5} width={1024} height={1024} alt="" />
      <Image src="/img/hero6.png" className={styles.img6} width={1024} height={1536} alt="" />
      <Image src="/img/hero7.png" className={styles.img7} width={1024} height={1024} alt="" />
      <Image src="/img/hero8.png" className={styles.img8} width={1024} height={1024} alt="" />
      <Image src="/img/hero9.png" className={styles.img9} width={1024} height={1024} alt="" />
      <Image src="/img/hero10.png" className={styles.img10} width={1024} height={1024} alt="" />

      <div className={styles["triangle-left"]}></div>
      <div className={styles.circle}></div>
      <div className={styles["triangle-right"]}></div>
    </header>
  );
}
