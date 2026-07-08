'use client';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import './pricing.css'; // ← 引入 CSS 檔案
import PlanCard from '../components/pricing-plan/PlanCard';
export default function PricingPage() {
    const plan_status = 1;
    const points = 100;

    // 免費方案永遠在以下三種狀況要變灰（視為啟用）
    const isFreeActive =
        (plan_status === 1 && points === 0) || // 純免費
        plan_status === 2 || // 月費含免費
        points > 0; // 點數含免費

    const isSubActive = plan_status === 2;
    const isCreditsActive = points > 0;

    return (
        <div className='pricing-page'>
            <NavBar />

            <main className='pricing-container'>
                <div className='pricing-heading'>
                    <p className='pricing-eyebrow'>學習方案</p>
                    <h1 className='pricing-title'>選擇適合你的方案</h1>
                    <p className='pricing-description'>依照你的練習需求，彈性選擇免費體驗、月費訂閱或點數儲值。</p>
                </div>

                <PlanCard
                    title='✅ 免費方案（Free）'
                    subtitle='開始嘗試答題'
                    price='$ 0/month'
                    features={['無限制進行隨機答題', '無限制回答歷史題庫']}
                    buttonText='開始體驗'
                    isActive={isFreeActive}
                />

                <PlanCard
                    title='💎 月費方案（Subscription）'
                    subtitle='無限練習，持續進步'
                    price='NT$99 / 月'
                    features={['無限制進行隨機答題', '無限制回顧歷史題庫', '享有進階解答分析輔助']}
                    buttonText='立即訂閱'
                    isActive={isSubActive}
                />

                <PlanCard
                    title='💰 點數儲值方案（Credits）'
                    subtitle='彈性儲值，自由掌握答題節奏'
                    price='NT$500 / 5000 題詳細解答'
                    features={[
                        '無限制進行隨機答題',
                        '無限制回顧歷史題庫',
                        '每題詳細解答扣除 1 點，點數永久有效。',
                    ]}
                    buttonText='儲值點數'
                    isActive={isCreditsActive}
                    currentPoints={points} // ✅ 傳入目前點數（例如 350）
                />
            </main>

            <Footer />
        </div>
    );
}
