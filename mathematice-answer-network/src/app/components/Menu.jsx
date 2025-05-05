import styles from "./Menu.module.css";
import Link from "next/link";
import PlanIcon from "./icon/PlanIcon";
import QuestionBankIcon from "./icon/QuestionBankIcon-";
import StudyGuidesIcon from "./icon/StudyGuidesIcon";

export default function Menu({ onIsActive }) {
  return (
    <>
      <div className={styles["menu-box"]}>
        <h1 className={styles.h1}>學生專區</h1>
        <div className={styles.option}>
          <Link href="/question-bank" className={styles.link}>
            <QuestionBankIcon />
            <button className={styles.btn}>歷年考古題</button>
          </Link>
          <Link href="/pricing-plan" className={styles.link}>
            <PlanIcon />
            <button className={styles.btn}>我的方案</button>
          </Link>
          <Link href="/record" className={styles.link}>
            <StudyGuidesIcon />
            <button className={styles.btn}>個人紀錄</button>
          </Link>
        </div>
      </div>
      <div
        className={styles.overlay}
        onClick={() => onIsActive((isActive) => !isActive)}
      ></div>
    </>
  );
}
