import styles from "./QuestionFilter.module.css";

export default function QuestionFilter({ isActive, setIsActive, data, dispatch, checked, setChecked }) {
  const options = ["數學A考科", "數學B考科", "學測"];
  const matched = ["數A", "數B", "學測"];
  if (!data) return;
  return (
    <>
      <div className={`${styles.filter}`}>
        <div className={styles.checkboxContainer}>
          {options.map((option, i) => (
            <label key={i} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={checked.includes(matched[i])}
                onChange={() =>
                  setChecked((preCheck) =>
                    preCheck.includes(matched[i])
                      ? preCheck.filter((pre) => pre !== matched[i])
                      : [...preCheck, matched[i]]
                  )
                }
              />
              {option}
            </label>
          ))}
          <button
            className={styles.btn}
            onClick={() => {
              setIsActive(!isActive);
              const filtered =
                checked.length === 0
                  ? data
                  : data.filter(
                      (paper) => typeof paper === "string" && checked.some((suffix) => paper.endsWith(suffix))
                    );
              dispatch({
                type: "filteredData",
                payload: filtered,
              });
            }}
          >
            確認選項
          </button>
        </div>
      </div>
      <div className={styles.overlay} onClick={() => setIsActive(!isActive)}></div>
    </>
  );
}
