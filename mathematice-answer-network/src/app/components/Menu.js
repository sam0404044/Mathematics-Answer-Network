import styles from "./Menu.module.css";
import Link from "next/link";
import PlanIcon from "./icon/PlanIcon";
import QuestionBankIcon from "./icon/QuestionBankIcon-";
import StudyGuidesIcon from "./icon/StudyGuidesIcon";

export default function Menu({ onIsActive }) {
  return (
    <>
      <div className={styles["menu-box"]}>
        <h1 className={styles.h1}>Students</h1>
        <div className={styles.option}>
          <Link href="" className={styles.link}>
            <QuestionBankIcon />
            <button className={styles.btn}>Question Bank</button>
          </Link>
          <Link href="/PricingPlan" className={styles.link}>
            <PlanIcon />
            <button className={styles.btn}>My Plan</button>
          </Link>
          <Link href="/record" className={styles.link}>
            <StudyGuidesIcon />
            <button className={styles.btn}>Study Guides</button>
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
