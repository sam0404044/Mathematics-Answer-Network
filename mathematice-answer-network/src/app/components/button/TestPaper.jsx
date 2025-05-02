import Link from "next/link";
import styles from "./TestPaper.module.css";

export default function TestPaper({ title, content }) {
  return (
    <Link href="/quiz" className={styles["btn-container"]}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}> {content}</p>
    </Link>
  );
}
