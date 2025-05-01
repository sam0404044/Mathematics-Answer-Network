'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Notice from '../components/toastModel';
import Footer from '../components/Footer';

export default function Login() {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    // 登入按鈕
    const login = async () => {
        // console.log(userInfo);
        // 傳送資料給後端
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
        });

        // 接收後端回傳的資料，!res.ok代表拋出錯誤訊息
        // res.json(): 取得後端回傳的資料
        if (!res.ok) {
            // const err = await res.json();
            const err = await res.json();
            console.log(err);
            setMessage(err.message || '伺服器錯誤');
            setShowModal(true);
            console.log(err);
            return;
        } else {
            setMessage('登入成功');
            setShowModal(true);
            return;
        }
    };

    return (
        <>
            <main className='relative flex flex-col items-center bg-[var(--backgroundColor)] h-full pt-10 px-[40px] min-h-screen'>
                {/* 關閉按鈕 */}
                <button className='absolute top-5 right-5'>
                    <Link href={'/'}>
                        <Image src={'/img/close.svg'} alt='LoginImg' width={30} height={30}></Image>
                    </Link>
                </button>

                {/* 插圖 */}
                <Image src={'/img/LoginImg.svg'} alt='LoginImg' width={372} height={283}></Image>

                {/* 標題 */}
                <h1 className='text-4xl text-center font-bold py-5'>Wellcome to MWBB!</h1>

                {/* 登入表單 */}
                <div className='w-full max-w-[372px] mx-auto'>
                    <form className='bg-[var(--formColor)] rounded-xl w-full  space-y-4 p-5'>
                        {/* email */}
                        <div>
                            <label
                                htmlFor=''
                                className='block text-sm text-[var(--subtitleColor)] mb-2 font-bold'
                            >
                                電子郵件:
                            </label>

                            <input
                                type='text'
                                className='w-full  focus:ring-2 focus:ring-[var(--secondColor)] border border-[var(--secondColor)] rounded-lg focus:outline-none py-1 px-1'
                                value={userInfo.email}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, email: e.target.value })
                                }
                            />
                        </div>
                        {/* password */}
                        <div>
                            <label
                                htmlFor=''
                                className='block text-sm text-[var(--subtitleColor)] mb-2 font-bold'
                            >
                                密碼:
                            </label>
                            <input
                                type='password'
                                className='w-full  focus:ring-2 focus:ring-[var(--secondColor)] border border-[var(--secondColor)] rounded-lg focus:outline-none py-1 px-1'
                                value={userInfo.password}
                                onChange={(e) =>
                                    setUserInfo({ ...userInfo, password: e.target.value })
                                }
                            />
                        </div>
                        {/* 記住我、忘記密碼? */}
                        <div className='flex items-center justify-between text-sm '>
                            <label className='flex items-center space-x-2'>
                                <input
                                    type='checkbox'
                                    className='w-4 h-4 border-[var(--secondColor)]'
                                    checked={userInfo.rememberMe}
                                    onChange={(e) =>
                                        setUserInfo({ ...userInfo, rememberMe: e.target.checked })
                                    }
                                />
                                <span className='text-[var(--headerColor)] font-bold'>記住我</span>
                            </label>
                            <Link href='#' className='text-[var(--secondColor)]'>
                                忘記密碼?
                            </Link>
                        </div>
                        <button
                            className='w-full bg-[var(--secondColor)] text-white py-2 rounded-lg font-bold'
                            onClick={login}
                            type='button'
                        >
                            登入
                        </button>
                        <Link
                            href={'/api/auth/google'}
                            className='w-full bg-[var(--googleLoginColor)] text-[var(--accountColor)] py-2 rounded-lg font-bold flex items-center justify-center space-x-2'
                        >
                            <Image src='/img/google.svg' alt='Google' width={20} height={20} />
                            <span>以Google登入</span>
                        </Link>
                    </form>
                </div>

                {/* 註冊? */}
                <div className='max-w-[372px] mx-auto w-full'>
                    <div className='flex items-center justify-between my-5'>
                        <label htmlFor='' className='text-[var(--accountColor)]'>
                            還沒有帳號?
                        </label>
                        <Link href={'#'} className='font-bold text-[var(--secondColor)]'>
                            註冊
                        </Link>
                    </div>
                </div>

                {/* 彈窗 */}
                {/* 有條件渲染的彈窗 */}
                <Notice show={showModal} onClose={() => setShowModal(false)} message={message} />
            </main>
            {/* footer */}
            <Footer />
        </>
    );
}
