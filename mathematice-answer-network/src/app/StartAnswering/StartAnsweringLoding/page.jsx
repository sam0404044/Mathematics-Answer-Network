'use client'; // Next.js 13 App Router 必須加

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


import './style.css'; // 外部 CSS

export default function StartAnsweringLoading() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/StartAnswering/StartAnsweringdone'); // 5秒後跳轉
    }, 5000);

    return () => clearTimeout(timer); // 離開頁面時清除 timer
  }, [router]);

  return (
    <div className="question-settings">
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">正在產生題目...</div>
      </div>
    </div>
  );
}
