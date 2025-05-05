"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import styles from '../';
import styles from "./page.module.css"; // 排版
import Footer from "../components/Footer";
import Notice from "../components/Notice";

export default function register() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles.container}>
        {/* 關閉按鈕 */}
        <button className="absolute top-5 right-5">
          <Link href={"/"}>
            <Image src="/img/close.svg" alt="LoginImg" width={30} height={30} />
          </Link>
        </button>
        {/* 插圖與標題 */}
        <div className={styles.head}>
          <img
            src="/img/Register_cover.svg"
            alt="註冊頁面插圖"
            width={372}
            height={283}
          />
          <h1>註冊頁面</h1>
        </div>
        {/* 註冊表單 */}
        <div className={styles.myform}>
          <form>
            {/* onSubmit={handleSubmit} */}
            <span>用戶名</span> <br />
            <input
              type="text"
              name="userName"
              // value={formData.userName}
              // onChange={handleChange}
            />
            {/* {errors.userName && <div style={{ color: "red" }}>{errors.userName}</div>} */}
            <br />
            <span>電子信箱</span> <br />
            <input
              type="email"
              name="userEmail"
              // value={formData.userEmail}
              // onChange={handleChange}
            />
            {/* {errors.userEmail && <div style={{ color: "red" }}>{errors.userEmail}</div>} */}
            <br />
            <span>密碼</span> <br />
            <input
              type="password"
              name="userPwd"
              // value={formData.userPwd}
              // onChange={handleChange}
            />
            {/* {errors.userPwd && <div style={{ color: "red" }}>{errors.userPwd}</div>} */}
            <br />
            <span>確認密碼</span> <br />
            <input
              type="password"
              name="userPwdConfirm"
              // value={formData.userPwdConfirm}
              // onChange={handleChange}
            />
            {/* {errors.userPwdConfirm && <div style={{ color: "red" }}>{errors.userPwdConfirm}</div>} */}
            <br />
            <span>就讀學校（非必填）</span> <br />
            <input
              type="text"
              name="userSchool"
              // value={formData.userSchool}
              // onChange={handleChange}
            />
            <br />
            <span>年級（非必填）</span> <br />
            <select
              name="userGrade"
              // value={formData.userGrade}
              // onChange={handleChange}
            >
              <option value="">--選擇就讀年級--</option>
              <option value="高一">高一</option>
              <option value="高二">高二</option>
              <option value="高三">高三</option>
            </select>
            <br />
            <span>性別（非必填）</span> <br />
            <select
              name="userGender"
              // value={formData.userGender}
              // onChange={handleChange}
            >
              <option value="">--選擇性別--</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
            </select>
            <br />
            {/* 確認按鈕 */}
            <button className={styles.mybtn} type="submit">
              確認註冊
            </button>
          </form>
        </div>
      </div>
      {/* 彈窗 */}
      {/* 有條件渲染的彈窗 */}
      <Notice
        show={showModal}
        onClose={() => setShowModal(false)}
        message={"註冊成功"}
      />
      <Footer />
    </>
  );
}
