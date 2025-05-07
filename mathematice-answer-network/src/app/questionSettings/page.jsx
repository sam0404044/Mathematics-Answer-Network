"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css"

export default function QuestionSettings() {
  const router = useRouter();
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [countdown, setCountdown] = useState(3);

  const handleStart = async () => {
    setStatus("loading");

    const questionCount = parseInt(document.getElementById("question-count")?.value || "20", 10);
    const difficulty = parseInt(document.getElementById("difficulty")?.value || "3", 10);
    const timerEnabled = document.getElementById("timer")?.checked;

    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount, difficulty }),
      });

      const data = await res.json();

      if (!res.ok || !data.questions) {
        alert("題目產生失敗");
        setStatus("idle");
        return;
      }

      // 存到 sessionStorage 傳給 /quiz
      sessionStorage.setItem("questions", JSON.stringify(data.questions));
      sessionStorage.setItem("settings", JSON.stringify({
        questionCount,
        difficulty,
        timerEnabled,
      }));

      setStatus("done");
    } catch (err) {
      console.error(err);
      alert("產生題目時發生錯誤");
      setStatus("idle");
    }
  };

  useEffect(() => {
    if (status === "done") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/quiz");
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [status]);

  // 畫面內容狀態判斷
  let content;

  if (status === "loading") {
    content = (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">正在產生題目...</div>
      </div>
    );
  } else if (status === "done") {
    content = (
      <div className="checkmark-container">
        <svg className="checkmark" viewBox="0 0 52 52">
          <path
            className="checkmark-path"
            fill="none"
            stroke="var(--question-checkbox)"
            strokeWidth="5"
            d="M14 27l7 7 17-17"
          />
        </svg>
        <div className="success-text">題目產生完成</div>
        <div className="countdown-text">即將開始答題... {countdown}</div>
      </div>
    );
  } else {
    content = (
      <>
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
            <input type="checkbox" defaultChecked /> 記住答題設定
          </label>
        </div>

        <button className="start-button" onClick={handleStart}>
          開始作答
        </button>
      </>
    );
  }

  return <div className="question-settings">{content}</div>;
}
