import styles from "./QuestionFilterBtn.module.css";

export default function QuestionFilterBtn({ filter, setFilter, children }) {
  return (
    <button className={styles.btn} onClick={() => setFilter(!filter)}>
      {children}
    </button>
  );
}
