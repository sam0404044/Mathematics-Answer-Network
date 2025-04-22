import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    return (
        <>
            <main className='relative flex flex-col items-center bg-[var(--backgroundColor)] w-screen h-screen pt-10'>
                {/* 關閉按鈕 */}
                <button className='absolute top-5 right-5'>
                    <Image src={'/img/close.svg'} alt='LoginImg' width={30} height={30}></Image>
                </button>

                {/* 插圖 */}
                <Image
                    src={'/img/LoginImg.svg'}
                    alt='LoginImg'
                    width={372}
                    height={283}
                    className=' w-[372px] h-auto'
                ></Image>

                {/* 標題 */}
                <h1 className='text-2xl text-center font-bold py-5'>Wellcome to ATC!</h1>

                {/* 登入表單 */}
                <form className='bg-[var(--formColor)] rounded-xl w-[372px] space-y-4 p-5 shadow-lg'>
                    {/* email */}
                    <div>
                        <label
                            htmlFor=''
                            className='block text-sm text-[var(--subtitleColor)] mb-2 font-bold'
                        >
                            Email:
                        </label>
                        <input
                            type='text'
                            className='w-full  focus:ring-2 focus:ring-[var(--secondColor)] border border-[var(--secondColor)] rounded-lg focus:outline-none py-1 px-1'
                        />
                    </div>

                    {/* password */}
                    <div>
                        <label
                            htmlFor=''
                            className='block text-sm text-[var(--subtitleColor)] mb-2 font-bold'
                        >
                            Password:
                        </label>
                        <input
                            type='text'
                            className='w-full  focus:ring-2 focus:ring-[var(--secondColor)] border border-[var(--secondColor)] rounded-lg focus:outline-none py-1 px-1'
                        />
                    </div>

                    {/* 記住我、忘記密碼? */}
                    <div className='flex items-center justify-between text-sm'>
                        <label className='flex items-center space-x-2'>
                            <input
                                type='checkbox'
                                className='w-4 h-4 border-[var(--secondColor)]'
                            />
                            <span className='text-[var(--headerColor)] font-bold'>Remember me</span>
                        </label>
                        <Link href='#' className='text-[var(--secondColor)]'>
                            Forgot password?
                        </Link>
                    </div>

                    {/* 登入按鈕 */}
                    <button className='w-full bg-[var(--secondColor)] text-white py-2 rounded-lg font-bold'>
                        Log in
                    </button>

                    {/* google按鈕 */}
                    <button className='w-full bg-[var(--googleLoginColor)] text-[var(--accountColor)] py-2 rounded-lg font-bold flex items-center justify-center space-x-2'>
                        <Image src='/img/google.svg' alt='Google' width={20} height={20} />
                        <span>Continue with Google</span>
                    </button>
                </form>

                {/* 註冊? */}
                <div className='flex items-center justify-between mt-5 w-[372px]'>
                    <label htmlFor='' className='text-[var(--accountColor)]'>
                        Don't have an acount?
                    </label>
                    <Link href={'#'} className='font-bold text-[var(--secondColor)]'>
                        Sign Up
                    </Link>
                </div>

                {/* footer */}
                <footer className='w-full bg-[var(--footerColor)] absolute bottom-0'>
                    <p className='text-center text-[var(--footerText)] py-2 text-sm'>
                        © 2025 ATC learning All rights reserved.
                    </p>
                </footer>
            </main>
        </>
    );
}
