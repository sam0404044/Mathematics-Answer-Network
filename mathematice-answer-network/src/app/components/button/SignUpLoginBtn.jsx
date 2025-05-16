import Link from "next/link";
import styles from "./SignUpLoginBtn.module.css";

export default function SignUpLogin({ children, isActive, type, route = "/", setIsLogin, isLogin }) {
  const logout = async function () {
    const res = await fetch("/api/logout");
    if (res.ok) {
      setIsLogin(false);
    }
  };

  if (isActive) return null;
  return isLogin ? (
    <Link href={route} onClick={logout}>
      <button className={styles[type]}>{children}</button>
    </Link>
  ) : (
    <Link href={route}>
      <button className={styles[type]}>{children}</button>
    </Link>
  );
}
