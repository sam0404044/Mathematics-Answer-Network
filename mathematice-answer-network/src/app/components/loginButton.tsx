'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function Alert() {
    // const [showModal, setShowModal] = useState(false);
    return (
        <>
            <button
                className='w-full bg-[var(--secondColor)] text-white py-2 rounded-lg font-bold'
                onClick={() => setShowModal(true)}
                type='button'
            >
                Log in
            </button>
            <button
                className='w-full bg-[var(--googleLoginColor)] text-[var(--accountColor)] py-2 rounded-lg font-bold flex items-center justify-center space-x-2'
                onClick={() => setShowModal(true)}
                type='button'
            >
                <Image src='/img/google.svg' alt='Google' width={20} height={20} />
                <span>Continue with Google</span>
            </button>
        </>
    );
}
