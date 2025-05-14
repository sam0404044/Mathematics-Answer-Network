'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from'./page.module.css';
import Footer from '../components/Footer';
import Notice from '../components/Notice';


export default function ResetPassword() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
        
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    
    const [errors, setErrors] = useState({});
    
    const validateField = (name, value) => {
        switch (name) {
            case 'newPassword':
                const pwdRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/;
                return pwdRegex.test(value)
                    ? ''
                    : '密碼需包含小寫英文與數字，且至少8碼';
            case 'confirmPassword':
                return value !== formData.newPassword 
                    ? '兩次輸入的密碼不一致' : '';
            default:
                return '';
        }
    };
    
    const handleChange = async (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const errorMessage = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));


        if (name === 'newPassword') {
            const confirmError = validateField('confirmPassword', formData.confirmPassword);
            setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
    };
    
    const submitHandler = async (event) => {
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
    
        const res = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                newPassword: formData.newPassword
            }),
        });
      
        const result = await res.json();
        if (res.ok) {
            setShowModal(true);
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else {
            setErrors({ general: result.error || '重設密碼失敗' });
        }
    };

    return (
        <>
            <div className={styles.pageWrapper}>
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
                <div className={styles.formHeader}>
                    <Image 
                        src='/img/ResetPwd_cover.svg'
                        alt='重設密碼頁面' 
                        width={372}
                        height={283}
                    />
                    <h1>重新設定密碼</h1>       
                </div>
                {/* 重設密碼表單 */}
                <div className={styles.formBody}>
                    <form className={`space-y-4 p-5 ${styles.form}`} onSubmit={submitHandler}>
                        <div>
                        <label htmlFor="newPassword">請重新輸入密碼:</label>
                        <input 
                            type="password"     
                            name="newPassword" 
                            className={styles.upwd}
                            value={formData.newPassword}
                            onChange={handleChange}
                            onBlur={handleChange}              
                        />
                        {errors.newPassword && (
                            <div className="pt-1 text-sm text-[var(--red)]">
                                {errors.newPassword}
                            </div>
                        )} 
                        </div>
                        <div>
                        <label htmlFor="confirmPassword">再次確認密碼:</label>
                        <input 
                            type="password" 
                            name="confirmPassword"  
                            className={styles.upwd_confirm} 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleChange}                        
                        />
                        {errors.confirmPassword && (
                            <div className="pt-1 text-sm text-[var(--red)]">
                                {errors.confirmPassword}
                            </div>
                        )} 
                        </div>
                        {/* 確認按鈕 */}
                        <button 
                            className={styles.submitBtn}
                            type="submit">
                            重設密碼
                        </button>
                        {errors.general && <div style={{ color: 'var(--red)' }}>{errors.general}</div>}
                    </form>
                </div>
            </div>
            {/* 彈窗 */}
            {/* 有條件渲染的彈窗 */}
            <Notice 
                // show={showModal} 
                // onClose={() => { 
                //     setShowModal(false) 
                //     setTimeout(() => {
                //         router.push('/login')
                //     }, 1000);
                // }} message={'重新設定成功'}
                show={showModal}
                onClose={() => setShowModal(false)}
                message="註冊成功" 
            />                          
            <Footer />
        </> 
    );
};


