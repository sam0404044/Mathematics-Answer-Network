import Link from "next/link";
import styles from "./SignUpLoginBtn.module.css";

export default function SignUpLogin({ children, type }) {
  return (
    <Link href="/login">
      <button className={styles[type]}>{children}</button>
    </Link>
  );
}
