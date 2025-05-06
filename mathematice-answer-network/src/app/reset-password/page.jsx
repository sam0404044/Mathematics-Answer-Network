'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from'./page.module.css';
import Footer from '../components/Footer';
import Notice from '../components/Notice';


export default function ResetPassword() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    
    
    const [formData, setFormData] = useState({
        userPwd: "",
        userPwdConfirm: "",
    });
    
    const [errors, setErrors] = useState({});
    
    const validateField = (name, value) => {
        switch (name) {
            case 'userPwd':
                const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
                return pwdRegex.test(value)
                    ? ''
                    : '密碼需包含大小寫英文與數字，且至少8碼';
            case 'userPwdConfirm':
                return value !== formData.userPwd 
                    ? '兩次輸入的密碼不一致' : '';
            default:
                return '';
        }
    };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const errorMessage = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));

        if (name === 'userPwd') {
            const confirmError = validateField('userPwdConfirm', formData.userPwdConfirm);
            setErrors((prev) => ({ ...prev, userPwdConfirm: confirmError }));
        }
    };
    
    const submitHandler = (event) => {
        event.preventDefault();
    
        const newErrors = {};
        Object.entries(formData).forEach(([key, value]) => {
            const msg = validateField(key, value);
            if (msg) newErrors[key] = msg;
        });
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        console.log("送出的資料：", formData);
        setShowModal(true);
    };

    return (
        <>
            <div className={styles.container}>
                {/* 關閉按鈕 */}
                <button className='absolute top-5 right-5'>
                    <Link href={'/'}>
                        <Image 
                            src='/img/close.svg' 
                            alt='LoginImg' 
                            width={30} 
                            height={30}
                        />                    
                    </Link>
                </button>
                {/* 插圖與標題 */}
                <div className={styles.head}>
                    <Image 
                        src='/img/ResetPwd_cover.svg'
                        alt='重設密碼頁面' 
                        width={372}
                        height={283}
                    />
                    <h1>重新設定密碼</h1>       
                </div>
                {/* 重設密碼表單 */}
                <div className={styles.myform}>
                    <form onSubmit={submitHandler}>
                        <span>請重新輸入密碼</span><br />
                        <input 
                            type="password"     
                            name="userPwd" 
                            className={styles.upwd}
                            value={formData.userPwd}
                            onChange={handleChange}
                            onBlur={handleChange}              
                        />
                        {errors.userPwd && <div style={{ color: 'red' }}>{errors.userPwd}</div>}
                        <br />
                        <span>再次確認密碼</span><br />
                        <input 
                            type="password" 
                            name="userPwdConfirm"  
                            className={styles.upwd_confirm} 
                            value={formData.userPwdConfirm}
                            onChange={handleChange}
                            onBlur={handleChange}                        
                        />
                        {errors.userPwdConfirm && <div style={{ color: 'red' }}>{errors.userPwdConfirm}</div>}
                        <br />
                        {/* 確認按鈕 */}
                        <button 
                            className={styles.mybtn}
                            type="submit">
                            重設密碼
                        </button>
                    </form>
                </div>
            </div>
            {/* 彈窗 */}
            {/* 有條件渲染的彈窗 */}
            <Notice 
                show={showModal} 
                onClose={() => { 
                    setShowModal(false) 
                    setTimeout(() => {
                        router.push('/login')
                    }, 1000);
                }} message={'重新設定成功'} 
            />                          
            <Footer />
        </> 
    );
};


