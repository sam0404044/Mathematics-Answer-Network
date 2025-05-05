import { useState } from "react";
import styles from "./QuestionFilter.module.css";

export default function QuestionFilter({ setFilter, filter }) {
  const [checked, setChecked] = useState([]);
  console.log(checked);
  const options = [
    "Exam Year",
    "Exam Source",
    "Grade Level",
    "Single Choice",
    "Multiple Select",
  ];
  return (
    <>
      <div className={`${styles.filter}`}>
        <div className={styles.checkboxContainer}>
          {options.map((option) => (
            <label key={option} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={checked.includes(option)}
                onChange={() =>
                  setChecked((checked) =>
                    checked.includes(option)
                      ? checked.filter((item) => item !== option)
                      : [...checked, option]
                  )
                }
              />
              {option}
            </label>
          ))}
          <button className={styles.btn} onClick={() => setFilter(!filter)}>
            確認選項
          </button>
        </div>
      </div>
      <div className={styles.overlay} onClick={() => setFilter(!filter)}></div>
    </>
  );
}
