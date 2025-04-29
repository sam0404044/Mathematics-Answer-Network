import styles from "./QuestionFilterBtn.module.css";
import Link from "next/link";

export default function QuestionFilterBtn({ children }) {
  return (
    <Link href="/" className={styles.btn}>
      {children}
    </Link>
  );
}
