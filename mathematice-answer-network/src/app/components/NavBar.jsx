"use client";
import MenuIcon from "./icon/MenuIcon";
import SignUpLoginBtn from "./button/SignUpLoginBtn";
import styles from "./NavBar.module.css";
import Logo from "./icon/Logo";
import Link from "next/link";
import QuestionBankIcon from "./icon/QuestionBankIcon-";
import PlanIcon from "./icon/PlanIcon";
import StudyGuidesIcon from "./icon/StudyGuidesIcon";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isActive, setIsActive] = useState(false);
  const [isLogin, setIsLogin] = useState("loading");
  const [user, setUser] = useState("");

  useEffect(() => {
    const loginStatus = async function () {
      try {
        const res = await fetch("/api/user/me", { credentials: "include" });
        if (!res.ok) {
          setIsLogin(false);
          return;
        }
        const data = await res.json();
        if (data.uid) {
          setIsLogin(true);
          setUser(data.uid);
        } else {
          setIsLogin(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setIsLogin(false);
      }
    };
    loginStatus();
  }, []);

  return (
    <>
      <nav className={`${styles.navbar} ${isActive ? styles.active : ""}`}>
        <div className={styles.navbarcomponent}>
          <MenuIcon setIsActive={setIsActive} isActive={isActive} />
          <Logo setIsActive={setIsActive} />
        </div>
        {isLogin === "loading" ? null : isLogin ? (
          <div className={styles.navbarcomponent}>
            {!isActive && (
              <>
                {" "}
                <h1 className={styles.username}>歡迎回來: {user}</h1>{" "}
                <SignUpLoginBtn
                  type={"log-in"}
                  isActive={isActive}
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                >
                  登出
                </SignUpLoginBtn>
              </>
            )}
          </div>
        ) : (
          <div className={styles.navbarcomponent}>
            <SignUpLoginBtn
              type={"sign-up"}
              route={"/register"}
              isActive={isActive}
            >
              註冊
            </SignUpLoginBtn>
            <SignUpLoginBtn
              type={"log-in"}
              route={"/login"}
              isActive={isActive}
            >
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
          <div
            className={styles.overlay}
            onClick={() => setIsActive((isActive) => !isActive)}
          ></div>
        </>
      ) : (
        ""
      )}
    </>
  );
}
