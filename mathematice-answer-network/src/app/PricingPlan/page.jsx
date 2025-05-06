"use client"; // 如果是 Next.js App Router 要加這行！
import React, { Component } from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function PricingPage() {
  return (
    <>
      <NavBar />

      <div className="p-[10px] min-h-screen bg-(--background)">
        <h2 className=" text-center text-[18px] mb-[15px]  text-[#333] font-pricing">Pricing</h2>

        {/* 免費方案 */}
        <div className=" p-[10px] m-[10px] bg-[var(--white)] rounded-[12px] text-center font-pricing text-[#333]">
          <div className="font-bold text-[18px] mt-[10px]">✅ 免費方案（Free）</div>
          <div className="text-[12px] text-[#666] mb-[10px] ">開始嘗試答題</div>
          <div className="font-bold text-[16px] mb-[10px]">$ 0/month</div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制進行隨機答題
          </div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制回答歷史題庫
          </div>
          <button className="bg-[var(--plan-subscribe-btn)] text-(--white) py-[6px] px-[20px] border-none rounded-[20px] cursor-pointer text-[14px]">
            開始體驗
          </button>
        </div>

        {/* 月費方案 */}
        <div className=" p-[10px] m-[10px] bg-[var(--white)] rounded-[12px] text-center font-pricing text-[#333]">
          <div className="font-bold text-[18px] mt-[10px]">💎 月費方案（Subscription）</div>
          <div className="text-[12px] text-[#666] mb-[10px]">無限練習，持續進步</div>
          <div className="font-bold text-[16px] mb-[10px]">NT$99 / 月</div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制進行隨機答題
          </div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制回顧歷史題庫
          </div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            享有進階解答分析輔助
          </div>
          <button className="bg-[var(--plan-subscribe-btn)] text-(--white) py-[6px] px-[20px] border-none rounded-[20px] cursor-pointer text-[14px]">
            立即訂閱
          </button>
        </div>

        {/* 點數儲值方案 */}
        <div className=" p-[10px] m-[10px] bg-[var(--white)] rounded-[12px] text-center font-pricing text-[#333]">
          <div className="font-bold text-[18px] mt-[10px]">💰 點數儲值方案（Credits）</div>
          <div className="text-[12px] text-[#666] mb-[10px]">彈性儲值，自由掌握答題節奏</div>
          <div className="font-bold text-[16px] mb-[10px]">NT$500 / 5000 題詳細解答</div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制進行隨機答題
          </div>
          <div className="flex items-center justify-center mb-[15px] text-[12px]  text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            無限制回顧歷史題庫
          </div>
          <div className="flex items-center justify-center mb-[15px] text-[12px] text-(--plan-text-list)">
            <span className="h-[10px] w-[10px] bg-(--plan-list) rounded-[50%] inline-block mr-[8px]"></span>
            每題詳細解答扣除 1 點，點數永久有效。
          </div>
          <button className="bg-[var(--plan-subscribe-btn)] text-(--white) py-[6px] px-[20px] border-none rounded-[20px] cursor-pointer text-[14px]">
            儲值點數
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
