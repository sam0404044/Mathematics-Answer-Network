import styles from "./QuestionFilterBtn.module.css";

export default function QuestionFilterBtn({ isActive, setIsActive, children }) {
  return (
    <button className={styles.btn} onClick={() => setIsActive(!isActive)}>
      {children}
    </button>
  );
}
