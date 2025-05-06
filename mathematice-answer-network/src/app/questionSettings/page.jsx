"use client"; // Next.js App Router 必須加！

import { useRouter } from "next/navigation";
import "./style.css";

export default function QuestionSettings() {
  const router = useRouter();

  const handleStart = async () => {
    const questionCount = parseInt(document.getElementById("question-count").value, 10);
    const timerEnabled = document.getElementById("timer").checked;
    const difficulty = 3; // 你可以改成從 input 抓值
    const onlyNew = true;
    const rememberSettings = true;

    // 發送到後端 API
    const res = await fetch("/api/generateQuiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionCount,
        difficulty,
        onlyNew,
        rememberSettings,
        timerEnabled,
        userId: "test-user", // 可以是登入帳號 ID
      }),
    });

    const data = await res.json();
    console.log("產生的題目：", data.questions); // 可選：存到 localStorage

    // 跳轉頁面
    router.push("/questionSettings/startAnsweringLoding");
  };

  return (
    <div className="question-settings">
      <label htmlFor="question-count">選擇題數</label>
      <select id="question-count">
        <option value="20">20 題</option>
        <option value="35">35 題</option>
        <option value="50">50 題</option>
      </select>

      <div className="section-label">答題設定</div>

      <div className="setting-row">
        <label htmlFor="timer">計時</label>
        <label className="switch">
          <input type="checkbox" id="timer" defaultChecked />
          <span className="slider"></span>
        </label>
      </div>

      <button className="unit-button">選單元</button>

      <div className="section-label">難易度</div>
      <input
        type="range"
        min="1"
        max="5"
        defaultValue="3"
        className="range-slider"
        id="difficulty"
      />

      <div className="checkbox-group">
        <label>
          <input type="checkbox" defaultChecked /> 只顯示未作過的題目
        </label>
      </div>

      <div className="checkbox-group">
        <label>
          <input type="checkbox" defaultChecked /> 記住答題建定
        </label>
      </div>

      <button className="start-button" onClick={handleStart}>
        開始作答
      </button>
    </div>
  );
}
