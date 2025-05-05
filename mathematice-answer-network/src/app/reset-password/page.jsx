'use client';

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from'./page.module.css'; // 排版
import Footer from '../components/Footer';
import Notice from '../components/toastModel';


export default function ResetPassword() {
    const [showModal, setShowModal] = useState(false);
    
    // const [formData, setFormData] = useState({
    //     userPwd: "",
    //     userPwdConfirm: "",
    //   });
    
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
                    <img 
                        src='/img/ResetPwd_cover.svg'
                        alt='重設密碼頁面' 
                        width={372}
                        height={283}
                    />
                    <h1>重新設定密碼</h1>       
                </div>
                {/* 重設密碼表單 */}
                <div className={styles.myform}>
                    <form method="" action="">
                        <span>請重新輸入密碼</span><br />
                        <input 
                            type="password"     
                            name="userPwd" 
                            className={styles.upwd}
                        //     value={formData.userPwd}
                        //     onChange={(e) => setFormData({...formData, userPwd: e.target.value})}
                        />
                        <br />
                        <span>再次確認密碼</span><br />
                        <input 
                            type="password" 
                            name="userPwdConfirm"  
                            className={styles.upwd_confirm} 
                            // value={formData.userPwdConfirm}
                            // onChange={(e) => setFormData({...formData, userPwdConfirm: e.target.value})}
                        />
                        <br />
                        {/* 確認按鈕 */}
                        <button 
                            className={styles.mybtn}
                            type="button" 
                            onClick={() => setShowModal(true)}>
                            重設密碼
                        </button>
                    </form>
                </div>
            </div>
            {/* 彈窗 */}
            {/* 有條件渲染的彈窗 */}
            <Notice show={showModal} onClose={() => setShowModal(false)} message={'重設成功'} />                        
            <Footer />
        </> 
    );
};


