"use client";
import styles from "./page.module.css";
import Footer from "../components/Footer";
import QuestionFilterBtn from "@/app/components/button/QuestionFilterBtn";
import QuestionFilter from "@/app/components/QuestionFilter";
import TestPaper from "@/app/components/button/TestPaper";
import Pagination from "@/app/components/button/Pagination";
import NavBar from "../components/NavBar";
import LoginAnimation from "../components/LoginAnimation";

import { useEffect, useState, useReducer } from "react";

const initialState = {
  data: [],
  originalData: [],
  curPage: 1,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "setData":
      return {
        ...state,
        data: action.payload,
        originalData: action.payload,
        isLoading: false,
      };
    case "setCurPage":
      return { ...state, curPage: action.payload };
    case "filteredData":
      return { ...state, data: action.payload, curPage: 1 };

    default:
      return state;
  }
}

export default function QuestionBank() {
  const [isActive, setIsActive] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, curPage, isLoading } = state;
  const [checked, setChecked] = useState([]);

  const start = (curPage - 1) * 10;
  const end = start + 10;
  const showCurPage = data.slice(start, end);
  const totalPage = Math.ceil(data.length / 10);

  useEffect(function () {
    async function getData() {
      const res = await fetch("/api/questionBank");
      const data = await res.json();
      setTimeout(function () {
        dispatch({ type: "setData", payload: data.questions });
      }, 3000);
    }
    getData();
  }, []);

  if (isLoading) return <LoginAnimation />;

  return (
    <div className={styles.container}>
      <NavBar />
      {isActive && (
        <QuestionFilter
          setIsActive={setIsActive}
          isActive={isActive}
          data={state.originalData}
          dispatch={dispatch}
          checked={checked}
          setChecked={setChecked}
        />
      )}
      <div className={styles.list}>
        <QuestionFilterBtn setIsActive={setIsActive} isActive={isActive}>
          題庫過濾
        </QuestionFilterBtn>
        {showCurPage.map((cur) => (
          <TestPaper
            key={cur.UID}
            uid={cur.questionYear}
            content={cur.questionYear}
          />
        ))}
      </div>
      <Pagination curPage={curPage} dispatch={dispatch} totalPage={totalPage} />
      <Footer />
    </div>
  );
}
