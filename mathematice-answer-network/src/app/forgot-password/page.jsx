'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from'./page.module.css';
import Footer from '../components/Footer';
import Notice from '../components/Notice';


export default function ForgotPassword() {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        captcha: "",
    });
    
    const handleSendCode = async () => {
        const res = await fetch('/send_reset_code.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}`
        });
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
                        src='/img/ForgotPwd_cover.svg'
                        alt="忘記密碼頁面"
                        width={372}
                        height={283}
                    />
                    <h1>忘記密碼</h1>       
                </div>
                {/* 驗證碼表單 */}
                <div className={styles.myform}>
                    <form onSubmit={e => e.preventDefault()}>
                        <span>電子信箱</span><br />
                        <input 
                            type="email" 
                            name="setEmail" 
                            className={styles.setEmail}
                            value={formData.email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <button 
                            className={styles.mybtn}
                            type="button"
                            onClick={handleSendCode}>
                            發送信件
                        </button>
                        <br />
                        <span>驗證碼</span><br />
                        <input 
                            type="text" 
                            name="captcha" 
                            className={styles.captcha}
                            value={formData.captcha}
                            onChange={(e) => setFormData({...formData, userCaptcha: e.target.value})}
                        />
                        <br />
                        <button
                            className={styles.myconfirmbtn} 
                            type="button" 
                            onClick={() => setShowModal(true)}>
                            驗證確認
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
                        router.push('/reset-password')
                    }, 1000);
                }} message={'驗證成功'} 
            />                         
            <Footer />
        </>    
    );
};
