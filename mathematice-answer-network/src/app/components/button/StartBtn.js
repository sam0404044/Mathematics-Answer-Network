import Link from "next/link";
import styles from "./StartBtn.module.css";

export default function SignUpLogin({ children }) {
  return (
    <Link href="">
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
