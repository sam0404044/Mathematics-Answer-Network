"use client";
import MenuIcon from "./icon/MenuIcon";
import SignUpLoginBtn from "./button/SignUpLoginBtn";
import styles from "./NavBar.module.css";
import Logo from "./icon/Logo";
import Link from "next/link";
import QuestionBankIcon from "./icon/QuestionBankIcon-";
import PlanIcon from "./icon/PlanIcon";
import StudyGuidesIcon from "./icon/StudyGuidesIcon";
<<<<<<< HEAD
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
          setUser(data);
          // setUser(data.username);
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
=======
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NavBar() {
  const auth = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  if (!auth) return null;
  const { isLogin, user, setIsLogin } = auth;
>>>>>>> origin/main

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
<<<<<<< HEAD
                {" "}
                <h1 className={styles.username}>
                  歡迎回來: {user.username ? user.username : user.email}
                </h1>{" "}
=======
                <h1 className={styles.username}>
                  歡迎回來: {user.username ? user.username : user.email}
                </h1>
>>>>>>> origin/main
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
<<<<<<< HEAD
              <Link href="/question-bank" className={styles.link}>
=======
              <Link
                href={`${isLogin ? "/question-bank" : "/login"}`}
                className={styles.link}
              >
>>>>>>> origin/main
                <QuestionBankIcon />
                <button className={styles.btn}>歷年考古題</button>
              </Link>
              <Link href="/pricing-plan" className={styles.link}>
                <PlanIcon />
                <button className={styles.btn}>我的方案</button>
              </Link>
<<<<<<< HEAD
              <Link href="/record" className={styles.link}>
=======
              <Link
                href={`${isLogin ? "/record" : "/login"}`}
                className={styles.link}
              >
>>>>>>> origin/main
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
