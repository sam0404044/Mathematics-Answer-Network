'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import Footer from '../components/Footer';
import Notice from '../components/Notice';


export default function ForgotPassword() {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSendResetEmail = async () => {
        const res = await fetch('/api/send-reset-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await res.json();
        if (res.ok) {
            setShowModal(true);
        } else {
            alert(result.error || '發送失敗');
        }
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
                            height={30}/>
                    </Link>
                </button>
                {/* 插圖與標題 */}
                <div className={styles.head}>
                    <Image 
                        src='/img/ForgotPwd_cover.svg'
                        alt="忘記密碼頁面"
                        width={372}
                        height={283}/>
                    <h1>忘記密碼</h1>       
                </div>
                {/* 表單 */}
                <div className={styles.myform}>
                    <form onSubmit={e => e.preventDefault()}>
                        <span>電子信箱</span><br />
                        <input 
                            type="email" 
                            className={styles.setEmail}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <button 
                            className={styles.mybtn}
                            type="button"
                            onClick={handleSendResetEmail}>
                            發送重設密碼連結
                        </button>
                    </form>
                </div>
            </div>
            {/* 彈窗 */}
            <Notice 
                show={showModal}
                onClose={() => setShowModal(false)}
                message={'已寄出連結，請至信箱查看'} 
            />
            <Footer />
        </>
    );
}
