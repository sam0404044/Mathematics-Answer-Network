import { useState } from "react";
import styles from "./QuestionFilter.module.css";

export default function QuestionFilter({ setIsActive, isActive }) {
  const [checked, setChecked] = useState([]);
  console.log(checked);
  const options = ["Exam Year", "Exam Source", "Grade Level", "Single Choice", "Multiple Select"];
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
                    checked.includes(option) ? checked.filter((item) => item !== option) : [...checked, option]
                  )
                }
              />
              {option}
            </label>
          ))}
          <button className={styles.btn} onClick={() => setIsActive(!isActive)}>
            Submit
          </button>
        </div>
      </div>
      <div className={styles.overlay} onClick={() => setIsActive(!isActive)}></div>
    </>
  );
}
