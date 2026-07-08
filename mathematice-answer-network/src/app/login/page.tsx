"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Notice from "@/app/components/Notice";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // 登入按鈕
  const login = async () => {
    // 傳送資料給後端
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
      credentials: "include", /// luo
    });

    // 接收後端回傳的資料，!res.ok代表拋出錯誤訊息
    // res.json(): 取得後端回傳的資料
    if (!res.ok) {
      const err = await res.json();
      setMessage(err.message || "伺服器錯誤");
      setShowModal(true);
      return;
    } else {
      setMessage("登入成功，三秒後將跳轉到首頁");
      setShowModal(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      return;
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* 關閉按鈕 */}
        <button className={styles.closeBtn}>
          <Link href={"/"}>
            <Image
              src={"/img/close.svg"}
              alt="LoginImg"
              width={30}
              height={30}
            ></Image>
          </Link>
        </button>

        {/* 插圖 */}
        <Image
          src={"/img/LoginImg.svg"}
          alt="LoginImg"
          width={372}
          height={283}
          className={styles.cover}
        ></Image>

        {/* 標題 */}
        <h1 className={styles.title}>登入</h1>

        {/* 登入表單 */}
        <div className={styles.formBody}>
          <form className={styles.form}>
            {/* email */}
            <div className={styles.field}>
              <label
                htmlFor=""
                className={styles.label}
              >
                電子郵件:
              </label>

              <input
                type="text"
                className={styles.input}
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>
            {/* password */}
            <div className={styles.field}>
              <label
                htmlFor=""
                className={styles.label}
              >
                密碼:
              </label>
              <input
                type="password"
                className={styles.input}
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
              />
            </div>
            {/* 記住我、忘記密碼? */}
            <div className={styles.options}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={userInfo.rememberMe}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, rememberMe: e.target.checked })
                  }
                />
                <span>
                  記住我
                </span>
              </label>
              <Link href="/forgot-password" className={styles.forgot}>
                忘記密碼?
              </Link>
            </div>
            <button
              className={styles.submit}
              onClick={login}
              type="button"
            >
              登入
            </button>
            <Link
              href={"/api/auth/google"}
              className={styles.google}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 25 25"
                fill="var(--answering-background-btn)"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24.8527 10.5737L24.7241 10.0385H12.8675V14.9615H19.9516C19.2162 18.3878 15.8032 20.1914 13.0154 20.1914C10.9869 20.1914 8.84869 19.3544 7.43345 18.0089C6.68676 17.2877 6.09241 16.4291 5.68441 15.4823C5.27641 14.5355 5.06278 13.519 5.05575 12.4911C5.05575 10.4174 6.00569 8.34319 7.38794 6.97879C8.77019 5.6144 10.8578 4.851 12.9334 4.851C15.3106 4.851 17.0142 6.08929 17.6513 6.65402L21.2173 3.17411C20.1712 2.27232 17.2975 0 12.8185 0C9.36291 0 6.04949 1.29855 3.62742 3.66685C1.2372 5.99888 0 9.37109 0 12.5C0 15.6289 1.17065 18.8326 3.48692 21.183C5.96189 23.6897 9.46701 25 13.0762 25C16.3601 25 19.4727 23.7377 21.6911 21.4475C23.872 19.1931 25 16.0737 25 12.8036C25 11.4269 24.8589 10.6094 24.8527 10.5737Z" />
              </svg>
              <span>以Google登入</span>
            </Link>
          </form>
        </div>

        {/* 註冊? */}
        <div className={styles.signup}>
          <div className={styles.signupInner}>
            <span className={styles.muted}>
              還沒有帳號?
            </span>
            <Link
              href={"/register"}
              className={styles.signupLink}
            >
              註冊
            </Link>
          </div>
        </div>

        {/* 彈窗 */}
        {/* 有條件渲染的彈窗 */}
        <Notice
          show={showModal}
          onClose={() => setShowModal(false)}
          message={message}
        />
      </main>
      {/* footer */}
      <Footer />
    </div>
  );
}
