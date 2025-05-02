import Link from "next/link";
import styles from "./SignUpLoginBtn.module.css";

export default function SignUpLogin({ children }) {
  return (
    <Link href="/login">
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
