import Link from "next/link";
import styles from "./SignUpLoginBtn.module.css";

export default function SignUpLogin({ children, type, route }) {
  return (
    <Link href={route}>
      <button className={styles[type]}>{children}</button>
    </Link>
  );
}
