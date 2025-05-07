import MenuIcon from "./icon/MenuIcon";
import SignUpLoginBtn from "./button/SignUpLoginBtn";
import styles from "./NavBar.module.css";
import Logo from "./icon/Logo";

export default function NavBar({ onIsActive, isActive }) {
  return (
    <nav className={`${styles.navbar} ${isActive ? styles.active : ""}`}>
      <div className={styles.navbarcomponent}>
        <MenuIcon onIsActive={onIsActive} isActive={isActive} />
        <Logo onIsActive={onIsActive} />
      </div>
      {isActive ? (
        ""
      ) : (
        <div className={styles.navbarcomponent}>
          <SignUpLoginBtn type={"sign-up"} route={"/register"}>
            註冊
          </SignUpLoginBtn>
          <SignUpLoginBtn type={"log-in"} route={"/login"}>
            登入
          </SignUpLoginBtn>
        </div>
      )}
    </nav>
  );
}
