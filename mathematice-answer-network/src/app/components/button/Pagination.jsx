import styles from "./Pagination.module.css";
import BtnRight from "./BtnRight";
import BtnLeft from "./BtnLeft";
import BtnMiddle from "./BtnMiddle";

export default function Pagination({ dispatch, curPage, totalPage }) {
  const goToPage = function (page) {
    dispatch({ type: "setCurPage", payload: page });
  };
  const firstPage = 1;
  const isFirstPage = curPage === firstPage;
  const isLastPage = curPage === totalPage;

  return (
    <div className={styles.pagination}>
      <BtnLeft isFirstPage={isFirstPage} goToPage={goToPage} curPage={curPage} />
      <BtnMiddle
        isLastPage={isLastPage}
        isFirstPage={isFirstPage}
        goToPage={goToPage}
        curPage={curPage}
        dispatch={dispatch}
        totalPage={totalPage}
        firstPage={firstPage}
      />
      <BtnRight isLastPage={isLastPage} goToPage={goToPage} curPage={curPage} />
    </div>
  );
}
