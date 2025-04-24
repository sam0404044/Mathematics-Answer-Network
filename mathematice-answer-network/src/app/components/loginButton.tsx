'use client';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function Alert() {
    const Success = () => toast.success('登入成功');
    const Fail = () => toast.error('登入失敗');
    const AcountWrong = () => toast.error('帳號或密碼錯誤');
    return (
        <>
            {/* 登入按鈕(登入成功) */}
            <button
                className='w-full bg-[var(--secondColor)] text-white py-2 rounded-lg font-bold'
                onClick={Success}
                type='button'
            >
                Log in
            </button>

            {/* google按鈕(登入失敗) */}
            <button
                type='button'
                className='w-full bg-[var(--googleLoginColor)] text-[var(--accountColor)] py-2 rounded-lg font-bold flex items-center justify-center space-x-2'
                onClick={Fail}
            >
                <Image src='/img/google.svg' alt='Google' width={20} height={20} />
                <span>Continue with Google</span>
            </button>

            {/* 帳號或密碼錯誤 */}
            <button
                className='w-full bg-[var(--googleLoginColor)] text-[var(--accountColor)] py-2 rounded-lg font-bold flex items-center justify-center space-x-2'
                onClick={AcountWrong}
                type='button'
            >
                <Image src='/img/google.svg' alt='Google' width={20} height={20} />
                <span>Continue with Google</span>
            </button>
        </>
    );
}
