import Link from "next/link";
import styles from "./StartBtn.module.css";

<<<<<<< HEAD
export default function StartBtn({ children }) {
  return (
    <Link href="/questionSettings">
=======
export default function StartBtn({ isLogin, children }) {
  return (
    <Link href={`${isLogin ? "/questionSettings" : "/login"}`}>
>>>>>>> origin/main
      <button className={styles.btn}>{children}</button>
    </Link>
  );
}
