'use client';

import React, { useState } from "react";
import Image from 'next/image';
import styles from "./page.module.css"


export default function resetpwd() {
    // const [formData, setFormData] = useState({
    //     userPwd: "",
    //     userPwdConfirm: "",
    //   });
    
    return (
        <>
            <div className={styles.container}>
                {/* 插圖與標題 */}
                <div className={styles.head}>
                    <Image 
                        src={'/image/ResetPwd_cover.svg'} 
                        alt='重設密碼頁面' 
                        width={300}
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
                        <button type="button" className={styles.mybtn}>重設密碼</button>
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


