"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Footer from "../components/Footer";
import Notice from "../components/Notice";

export default function Register() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPwd: "",
    userPwdConfirm: "",
    userSchool: "",
    userGrade: "",
    userGender: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "userName":
        return value.trim() === "" ? "使用者名稱不能留白" : "";
      case "userEmail":
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? ""
          : "請輸入正確的 Email 格式";
      case "userPwd":
        const pwdRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
        return pwdRegex.test(value)
          ? ""
          : "密碼需包含小寫英文與數字，且至少8碼";
      case "userPwdConfirm":
        return value !== formData.userPwd ? "兩次輸入的密碼不一致" : "";
      default:
        return "";
    }
  };

  const handleChange = async (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    let errorMessage = validateField(name, value);

    if (name === "userEmail" && errorMessage === "") {
      try {
        const res = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value }),
        });

        const data = await res.json();
        if (data.exists) {
          errorMessage = "此 Email 已被註冊過";
        }
      } catch (err) {
        errorMessage = "Email 驗證失敗，請稍後再試";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));

    if (name === "userPwd") {
      const confirmError = validateField(
        "userPwdConfirm",
        formData.userPwdConfirm
      );
      setErrors((prev) => ({ ...prev, userPwdConfirm: confirmError }));
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // 驗證資料
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const msg = validateField(key, value);
      if (msg) newErrors[key] = msg;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 若驗證通過才送出資料
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      setShowModal(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      setErrors({ userEmail: result.error || "註冊失敗" });
    }
  };

  return (
    <>
      <main className={styles.pageWrapper}>
        {/* 關閉按鈕 */}
        <button className="absolute top-5 right-5 z-50">
          <Link href="/">
            <Image src="/img/close.svg" alt="LoginImg" width={30} height={30} />
          </Link>
        </button>
        {/* 插圖與標題 */}
        <div className={styles.formHeader}>
          <Image
            src="/img/Register_cover.svg"
            alt="註冊頁面插圖"
            width={372}
            height={283}
          />
          <h1>會員註冊</h1>
        </div>
        {/* 註冊表單 */}
        <div className={styles.formBody}>
          <form
            className={`space-y-4 p-5 ${styles.form}`}
            onSubmit={submitHandler}
          >
            <div>
              <label htmlFor="userName">用戶名:</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                onBlur={handleChange}
              />
              {errors.userName && (
                <div className="pt-1 text-sm text-[var(--red)]">
                  {errors.userName}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="userEmail">電子郵件:</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
              />
              {errors.userEmail && (
                <div className="pt-1 text-sm text-[var(--red)]">
                  {errors.userEmail}
                </div>
              )}{" "}
            </div>
            <div>
              <label htmlFor="userPwd">密碼:</label>
              <input
                type="password"
                name="userPwd"
                value={formData.userPwd}
                onChange={handleChange}
              />
              {errors.userPwd && (
                <div className="pt-1 text-sm text-[var(--red)]">
                  {errors.userPwd}
                </div>
              )}{" "}
            </div>
            <div>
              <label htmlFor="userPwdConfirm">確認密碼:</label>
              <input
                type="password"
                name="userPwdConfirm"
                value={formData.userPwdConfirm}
                onChange={handleChange}
              />
              {errors.userPwdConfirm && (
                <div className="pt-1 text-sm text-[var(--red)]">
                  {errors.userPwdConfirm}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="userSchool">就讀學校:（非必填）</label>
              <input
                type="text"
                name="userSchool"
                value={formData.userSchool}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userGrade">年級:（非必填）</label>
              <select
                name="userGrade"
                value={formData.userGrade}
                onChange={handleChange}
              >
                <option value="">--選擇就讀年級--</option>
                <option value="一年級">一年級</option>
                <option value="二年級">二年級</option>
                <option value="三年級">三年級</option>
              </select>
            </div>
            <div>
              <label htmlFor="userGender">性別:（非必填）</label>
              <select
                name="userGender"
                value={formData.userGender}
                onChange={handleChange}
              >
                <option value="">--選擇性別--</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
              </select>
            </div>
            {/* 確認按鈕 */}
            <button className={styles.submitBtn} type="submit">
              確認註冊
            </button>
          </form>
        </div>
        {/* 彈窗 */}
        {/* 有條件渲染的彈窗 */}
        <Notice
          show={showModal}
          onClose={() => setShowModal(false)}
          message="註冊成功"
        />
      </main>
      <Footer />
    </>
  );
}
