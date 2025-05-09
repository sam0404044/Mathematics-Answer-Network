import MenuIcon from "./icon/MenuIcon";
import SignUpLoginBtn from "./button/SignUpLoginBtn";
import styles from "./NavBar.module.css";
import Logo from "./icon/Logo";
import Link from "next/link";
import QuestionBankIcon from "./icon/QuestionBankIcon-";
import PlanIcon from "./icon/PlanIcon";
import StudyGuidesIcon from "./icon/StudyGuidesIcon";
import { useState } from "react";

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <nav className={`${styles.navbar} ${isActive ? styles.active : ""}`}>
        <div className={styles.navbarcomponent}>
          <MenuIcon setIsActive={setIsActive} isActive={isActive} />
          <Logo setIsActive={setIsActive} />
        </div>
        {isActive ? (
          ""
        ) : (
          <div className={styles.navbarcomponent}>
            <SignUpLoginBtn type={"sign-up"} route={"/register"}>
              註冊
            </SignUpLoginBtn>
            <SignUpLoginBtn type={"log-in"} route={"/login"}>
              登入
            </SignUpLoginBtn>
          </div>
        )}
      </nav>
      {isActive ? (
        <>
          <div className={styles["menu-box"]}>
            <h1 className={styles.h1}>學生專區</h1>
            <div className={styles.option}>
              <Link href="/question-bank" className={styles.link}>
                <QuestionBankIcon />
                <button className={styles.btn}>歷年考古題</button>
              </Link>
              <Link href="/pricingPlan" className={styles.link}>
                <PlanIcon />
                <button className={styles.btn}>我的方案</button>
              </Link>
              <Link href="/record" className={styles.link}>
                <StudyGuidesIcon />
                <button className={styles.btn}>個人紀錄</button>
              </Link>
            </div>
          </div>
          <div className={styles.overlay} onClick={() => setIsActive((isActive) => !isActive)}></div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
