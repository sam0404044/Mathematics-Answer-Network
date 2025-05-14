import Link from "next/link";
import styles from "./StartBtn.module.css";

export default function StartBtn({ isLogin, children }) {
  return (
    <Link href={`${isLogin ? "/questionSettings" : "/login"}`}>
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
