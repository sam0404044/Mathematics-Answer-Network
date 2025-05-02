import styles from "./BtnRight.module.css";

export default function BtnRight({ isLastPage, goToPage, curPage }) {
  return (
    <button
      className={`${styles.btn} ${isLastPage ? styles.disactive : ""}`}
      onClick={() => {
        !isLastPage && goToPage(curPage + 1);
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 512 512">
        <path
          fill="none"
          // stroke="currentColor"
          // stroke-linecap="round"
          // stroke-linejoin="round"
          // stroke-width="48"
          d="M268 112l144 144-144 144M392 256H100"
        />
      </svg>
    </button>
  );
}
