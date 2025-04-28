import MenuIcon from './icon/MenuIcon';
import SignUpLoginBtn from './button/SignUpLoginBtn';
import styles from './NavBar.module.css';
import Logo from './icon/Logo';

export default function NavBar({ onIsActive, isActive }) {
    return (
        <nav className={`${styles.navbar} ${isActive ? styles.active : ''}`}>
            <div className={styles.navbarcomponent}>
                <MenuIcon onIsActive={onIsActive} isActive={isActive} />
                <Logo onIsActive={onIsActive} />
            </div>
            {isActive ? (
                ''
            ) : (
                <div className={styles.navbarcomponent}>
                    <SignUpLoginBtn>Sign up</SignUpLoginBtn>
                    <SignUpLoginBtn>Log in</SignUpLoginBtn>
                </div>
            )}
        </nav>
    );
}
