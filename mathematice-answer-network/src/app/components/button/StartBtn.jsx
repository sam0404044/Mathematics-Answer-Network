import Link from "next/link";
import styles from "./StartBtn.module.css";

export default function StartBtn({ children }) {
  return (
    <Link href="/start-answering">
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
