import styles from "./BtnMiddle.module.css";

export default function BtnMiddle({ curPage, dispatch, goToPage, firstPage, isFirstPage, isLastPage, totalPage }) {
  if (totalPage === 1)
    return (
      <button
        className={`${styles["btn-page"]} ${isFirstPage ? styles["page-current"] : ""}`}
        onClick={() => goToPage(firstPage)}
      >
        {firstPage}
      </button>
    );
  return (
    <>
      <button
        className={`${styles["btn-page"]} ${isFirstPage ? styles["page-current"] : ""}`}
        onClick={() => goToPage(firstPage)}
      >
        {firstPage}
      </button>
      {!isLastPage && (
        <button
          className={`${styles["btn-page"]} ${!isFirstPage && !isLastPage && styles["page-current"]}`}
          onClick={() => goToPage(curPage + 1)}
        >
          {isFirstPage ? curPage + 1 : curPage}
        </button>
      )}
      {isLastPage && (
        <button className={`${styles["btn-page"]} ${!isFirstPage && !isLastPage && styles["page-current"]}`}>
          ‧‧‧
        </button>
      )}
      <button
        className={`${styles["btn-page"]} ${curPage === totalPage ? styles["page-current"] : ""}`}
        onClick={() => dispatch({ type: "setCurPage", payload: totalPage })}
      >
        {totalPage}
      </button>
    </>
  );
}
