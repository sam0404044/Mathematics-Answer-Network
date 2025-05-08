import Link from "next/link";
import styles from "./TestPaper.module.css";

export default function TestPaper({ uid, content }) {
  return (
    <Link href={`/quiz?uid=${uid}`} className={styles["btn-container"]}>
      <p className={styles.content}> {content}</p>
    </Link>
  );
}
