import styles from "./About.module.css";

export default function About() {
  return (
    <article className={styles.about}>
      <div className={styles.container}>
        <img src="/img/hero-img.png" className={styles.img} />
      </div>
      <h1 className={styles.h1}>關於我們</h1>
      <p className={styles.p}>
        數學答題王是一個專為國高中生設計的數學答題網站，無論你是在學校、家中都能隨時打開網站，進行即時答題、錯題複習！
        <br />
        <br />
        🔹 專為學生設計的學習體驗
        <br />
        題目涵蓋國高中重要單元，依難度主題分類，幫助學生練習與進步。
        <br />
        <br />
        🔹 錯題記錄與學習成就
        <br />
        系統自動紀錄錯誤題目，幫助學生精準掌握弱點，加速成長。
        <br />
        <br />
        🔹 更多互動功能
        <br />
        設計遊戲化「樹苗養成」、「個人化推薦題目」等進階互動模組！
      </p>
    </article>
  );
}
