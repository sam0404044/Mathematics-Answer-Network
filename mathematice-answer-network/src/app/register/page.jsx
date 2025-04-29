'use client';

import React, { useState } from "react";
import Image from 'next/image';
import styles from "./page.module.css"
import Footer from "../components/Footer"


export default function register() {
    // const [formData, setFormData] = useState({
    // userName: "",
    // userEmail: "",
    // userPwd: "",
    // userPwdConfirm: "",
    // userSchool: "",
    // userGrade: "",
    // userGender: "",
    // });

    // const [errors, setErrors] = useState({});
    // const [submitted, setSubmitted] = useState(false);

    // const handleChange = (e) => {
    // const { name, value } = e.target;
    // setFormData((prev) => ({ ...prev, [name]: value }));
    // setErrors((prev) => ({ ...prev, [name]: "" }));
    // };

    // const mockCheckDuplicate = async (field, value) => {
    // const used = ["usedName", "used@mail.com"];
    // return used.includes(value);
    // };

    // const validate = async () => {
    // const newErrors = {};
    // if (!formData.userName) {
    //     newErrors.userName = "用戶名為必填";
    // } else if (await mockCheckDuplicate("userName", formData.userName)) {
    //     newErrors.userName = "此用戶名已被使用";
    // }

    // if (!formData.userEmail) {
    //     newErrors.userEmail = "電子信箱為必填";
    // } else if (await mockCheckDuplicate("userEmail", formData.userEmail)) {
    //     newErrors.userEmail = "此電子信箱已被使用";
    // }

    // if (!formData.userPwd) {
    //     newErrors.userPwd = "密碼為必填";
    // }

    // if (!formData.userPwdConfirm) {
    //     newErrors.userPwdConfirm = "確認密碼為必填";
    // } else if (formData.userPwd !== formData.userPwdConfirm) {
    //     newErrors.userPwdConfirm = "密碼不一致";
    // }

    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    // };

    // const handleSubmit = async (e) => {
    // e.preventDefault();
    // if (await validate()) {
    //     setSubmitted(true);
    //     alert("註冊成功！");
    // }
    // };

    return (
        <>
            <div className={styles.container}>
                {/* 插圖與標題 */}
                <div className={styles.head}>
                    <Image
                        src={'/image/Register_cover.svg'}
                        alt='註冊頁面插圖'
                        width={'300'}
                    />
                    <h1>註冊頁面</h1>
                </div>
                {/* 註冊表單 */}
                <div className={styles.myform}>
                    <form onSubmit={handleSubmit}>
                    <label>用戶名</label>
                    <input 
                        type="text" 
                        name="userName" 
                        value={formData.userName} 
                        onChange={handleChange} 
                    />
                    {errors.userName && <div style={{ color: "red" }}>{errors.userName}</div>}

                    <label>電子信箱</label>
                    <input 
                        type="email" 
                        name="userEmail" 
                        value={formData.userEmail} 
                        onChange={handleChange} 
                    />
                    {errors.userEmail && <div style={{ color: "red" }}>{errors.userEmail}</div>}

                    <label>密碼</label>
                    <input 
                        type="password" 
                        name="userPwd" 
                        value={formData.userPwd} 
                        onChange={handleChange} 
                    />
                    {errors.userPwd && <div style={{ color: "red" }}>{errors.userPwd}</div>}

                    <label>確認密碼</label>
                    <input 
                        type="password" 
                        name="userPwdConfirm" 
                        value={formData.userPwdConfirm} 
                        onChange={handleChange} 
                    />
                    {errors.userPwdConfirm && <div style={{ color: "red" }}>{errors.userPwdConfirm}</div>}

                    <label>就讀學校（非必填）</label>
                    <input 
                        type="text" 
                        name="userSchool" 
                        value={formData.userSchool} 
                        onChange={handleChange} 
                    />

                    <label>年級（非必填）</label>
                    <select 
                        name="userGrade" 
                        value={formData.userGrade} 
                        onChange={handleChange}
                    >
                        <option value="">--選擇就讀年級--</option>
                        <option value="高一">高一</option>
                        <option value="高二">高二</option>
                        <option value="高三">高三</option>
                    </select>

                    <label>性別（非必填）</label>
                    <select 
                        name="userGender" 
                        value={formData.userGender} 
                        onChange={handleChange}
                    >
                        <option value="">--選擇性別--</option>
                        <option value="男性">男性</option>
                        <option value="女性">女性</option>
                    </select>
                    {/* 確認按鈕 */}
                    <button className={styles.mybtn} type="submit">確認註冊</button>
                    </form>
                </div>
            </div>
            {/* 彈窗 */}
            {/* 有條件渲染的彈窗 */}
            <Notice show={showModal} onClose={() => setShowModal(false)} message={'註冊成功'} />                        
            <Footer />
        </> 
    );
};
