import styles from "./MenuIcon.module.css";
export default function MenuIcon({ onIsActive, isActive }) {
  return (
    <button onClick={() => onIsActive((isActive) => !isActive)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.icon} ${isActive ? styles.active : ""}`}
        viewBox="0 0 512 512"
      >
        <path
          // fill="none"
          // stroke="var(--logo)"
          // strokeLinecap="round"
          // strokeMiterlimit="10"
          // strokeWidth="32"
          d="M80 160h352M80 256h352M80 352h352"
        />
      </svg>
    </button>
  );
}
