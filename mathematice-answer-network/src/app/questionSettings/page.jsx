// ✅ 前端 /app/questionSettings/page.jsx 或 component
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./style.css";

export default function QuestionSettings() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [countdown, setCountdown] = useState(3);

  const handleStart = async () => {
    setStatus("loading");

    const questionCount = parseInt(document.getElementById("question-count")?.value || "20", 10);
    const timerEnabled = document.getElementById("timer")?.checked;

    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount }),
      });

      const data = await res.json();

    // / ✅ 加入 LOG：印出 API 回傳內容
    console.log("📦 題目 API 回傳資料：", data);

      if (!res.ok || !data.questions) {
        alert("題目產生失敗");
        setStatus("idle");
        return;
      }

      sessionStorage.setItem("questions", JSON.stringify(data.questions));
      sessionStorage.setItem("settings", JSON.stringify({ questionCount, timerEnabled }));

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

  return (
    <div className="question-settings">
      {status === "loading" ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">正在產生題目...</div>
        </div>
      ) : status === "done" ? (
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
      ) : (
        <>
          <label htmlFor="question-count">選擇題數</label>
          <select id="question-count">
            <option value="20">20 題</option>
            <option value="35">35 題</option>
            <option value="50">50 題</option>
          </select>

          <div className="setting-row">
            <label htmlFor="timer">計時</label>
            <label className="switch">
              <input type="checkbox" id="timer" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>

          <button className="start-button" onClick={handleStart}>
            開始作答
          </button>
        </>
      )}
    </div>
  );
}