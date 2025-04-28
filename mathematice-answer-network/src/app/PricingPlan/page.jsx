'use client'; // 如果是 Next.js App Router 要加這行！
import React, { Component } from 'react';
import { useState } from 'react';

import './style.css'; // 把原本的CSS拉出去
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import Menu from '../components/Menu';


export default function PricingPage() {

  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <>
    <NavBar isActive={isActive} onIsActive={setIsActive} />
    {isActive ? <Menu onIsActive={setIsActive} /> : ''}

    <div className="pricing-contenter">
      <h2 className="pricing-heading">Pricing</h2>

      {/* 免費方案 */}
      <div className="pricing-card">
        <div className="plan-title">✅ 免費方案（Free）</div>
        <div className="plan-subtitle">開始嘗試答題</div>
        <div className="plan-price">$ 0/month</div>
        <div className="plan-feature">
          <span className="dot"></span>無限制進行隨機答題
        </div>
        <div className="plan-feature">
          <span className="dot"></span>無限制回答歷史題庫
        </div>
        <button className="plan-button">開始體驗</button>
      </div>

      {/* 月費方案 */}
      <div className="pricing-card">
        <div className="plan-title">💎 月費方案（Subscription）</div>
        <div className="plan-subtitle">無限練習，持續進步</div>
        <div className="plan-price">NT$99 / 月</div>
        <div className="plan-feature">
          <span className="dot"></span>無限制進行隨機答題
        </div>
        <div className="plan-feature">
          <span className="dot"></span>無限制回顧歷史題庫
        </div>
        <div className="plan-feature">
          <span className="dot"></span>享有進階解答分析輔助
        </div>
        <button className="plan-button">立即訂閱</button>
      </div>

      {/* 點數儲值方案 */}
      <div className="pricing-card">
        <div className="plan-title">💰 點數儲值方案（Credits）</div>
        <div className="plan-subtitle">彈性儲值，自由掌握答題節奏</div>
        <div className="plan-price">NT$500 / 5000 題詳細解答</div>
        <div className="plan-feature">
          <span className="dot"></span>無限制進行隨機答題
        </div>
        <div className="plan-feature">
          <span className="dot"></span>無限制回顧歷史題庫
        </div>
        <div className="plan-feature">
          <span className="dot"></span>每題詳細解答扣除 1 點，點數永久有效。
        </div>
        <button className="plan-button">儲值點數</button>
      </div>
    </div>
    <Footer/>
   </>
  );
}
