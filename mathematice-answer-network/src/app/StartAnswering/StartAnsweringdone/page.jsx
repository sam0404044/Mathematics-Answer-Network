'use client'; // Next.js App Router 要加這行！

import './style.css'; // 外掛 CSS

export default function StartAnsweringDone() {
  return (
    <div className="question-settings">
      <div className="checkmark-container">
        <svg className="checkmark" viewBox="0 0 52 52">
          <path
            className="checkmark-path"
            fill="none"
            stroke="#2ecc71"
            strokeWidth="5"
            d="M14 27l7 7 17-17"
          />
        </svg>
        <div className="success-text">題目產生完成</div>
      </div>
    </div>
  );
}
