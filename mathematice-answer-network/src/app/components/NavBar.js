import LogoApple from "./icon/LogoApple";
import MenuIcon from "./icon/MenuIcon";
import SignUpLoginBtn from "./button/SignUpLoginBtn";
import styles from "./NavBar.module.css";

export default function NavBar({ onIsActive, isActive }) {
  return (
    <nav className={`${styles.navbar} ${isActive ? styles.active : ""}`}>
      <div className={styles.navbarcomponent}>
        <MenuIcon onIsActive={onIsActive} isActive={isActive} />
        <LogoApple onIsActive={onIsActive} isActive={isActive} />
      </div>
      {isActive ? (
        ""
      ) : (
        <div className={styles.navbarcomponent}>
          <SignUpLoginBtn>Sign up</SignUpLoginBtn>
          <SignUpLoginBtn>Log in</SignUpLoginBtn>
        </div>
      )}
    </nav>
  );
}
