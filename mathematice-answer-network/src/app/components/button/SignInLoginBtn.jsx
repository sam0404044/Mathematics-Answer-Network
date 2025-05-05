import Link from "next/link";
import styles from "./SignInLoginBtn.module.css";

export default function SignInLogin({ children }) {
  return (
    <Link href="/login">
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
