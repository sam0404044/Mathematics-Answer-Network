import styles from "./Pagination.module.css";
import ArrowRight from "@/app/components/icon/ArrowRight";
import ArrowLeft from "@/app/components/icon/ArrowLeft";

export default function Pagination({ setCurpage, curpage, totalPage }) {
  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.btn} ${curpage === 1 ? styles.disactive : ""} `}
        onClick={() => {
          if (1 < curpage) {
            setCurpage(curpage - 1);
          }
        }}
      >
        <ArrowLeft />
      </button>
      <button
        className={`${styles["btn-page"]} ${curpage === 1 ? styles["page-current"] : ""}`}
        onClick={() => setCurpage(1)}
      >
        1
      </button>

      {curpage !== totalPage ? (
        <button
          className={`${styles["btn-page"]} ${curpage > 1 && curpage < totalPage ? styles["page-current"] : ""}`}
          onClick={() => setCurpage(curpage + 1)}
        >
          {curpage === 1 ? curpage + 1 : curpage}
        </button>
      ) : (
        <button className={`${styles["btn-page"]} ${curpage > 1 && curpage < totalPage ? styles["page-current"] : ""}`}>
          ‧‧‧
        </button>
      )}

      <button
        className={`${styles["btn-page"]} ${curpage === totalPage ? styles["page-current"] : ""}`}
        onClick={() => setCurpage(totalPage)}
      >
        {totalPage}
      </button>
      <button
        className={`${styles.btn} ${curpage === totalPage ? styles.disactive : ""}`}
        onClick={() => {
          if (totalPage > curpage) {
            setCurpage(curpage + 1);
          }
        }}
      >
        <ArrowRight />
      </button>
    </div>
  );
}
