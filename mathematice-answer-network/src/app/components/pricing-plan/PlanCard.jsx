export default function PlanCard({
  title,
  subtitle,
  price,
  features,
  buttonText,
  isActive = false,
  currentPoints = null, // 🔸 新增目前點數
}) {
  const cardClass = isActive ? "plan-card plan-card-disabled" : "plan-card";

  // 🔸 自訂按鈕文字：如果有 currentPoints，優先顯示點數
  const buttonLabel =
    currentPoints !== null && isActive
      ? `目前 ${currentPoints} 點`
      : isActive
      ? "目前啟用"
      : buttonText;

  const buttonClass = isActive ? "plan-button disabled" : "plan-button";

  return (
    <div className={cardClass}>
      <div className="plan-title">{title}</div>
      <div className="plan-subtext">{subtitle}</div>
      <div className="plan-price">{price}</div>
      <ul className="plan-features">
        {features.map((item, index) => (
          <li key={index}>
            <span className="dot" /> {item}
          </li>
        ))}
      </ul>
      <button className={buttonClass} disabled={isActive}>
        {buttonLabel}
      </button>
    </div>
  );
}
