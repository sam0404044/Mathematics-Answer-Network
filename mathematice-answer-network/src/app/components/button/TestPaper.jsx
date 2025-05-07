import Link from "next/link";
import styles from "./TestPaper.module.css";

export default function TestPaper({ content }) {
  return (
    <Link href="/quiz" className={styles["btn-container"]}>
      <p className={styles.content}> {content}</p>
    </Link>
  );
}
