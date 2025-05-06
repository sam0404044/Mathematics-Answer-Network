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
  curPage: 1,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "setData":
      return { ...state, data: action.payload, isLoading: false };
    case "setCurPage":
      return { ...state, curPage: action.payload };

    default:
      return state;
  }
}

export default function QuestionBank() {
  const [filter, setFilter] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, curPage, isLoading } = state;

  const start = (curPage - 1) * 10;
  const end = start + 10;
  const showCurPage = data.slice(start, end);
  const totalPage = Math.ceil(data.length / 10);

  useEffect(function () {
    async function getData() {
      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      const data = await res.json();

      setTimeout(function () {
        dispatch({ type: "setData", payload: data });
      }, 3000);
    }
    getData();
  }, []);

  if (isLoading) return <LoginAnimation />;

  return (
    <div className={styles.container}>
      <NavBar />
      {filter && <QuestionFilter setFilter={setFilter} filter={filter} />}
      <div className={styles.list}>
        <QuestionFilterBtn setFilter={setFilter} filter={filter}>
          題庫過濾
        </QuestionFilterBtn>
        {showCurPage.map((cur) => (
          <TestPaper key={cur.id} title={`Test Paper ${cur.id < 10 ? `0${cur.id}` : cur.id}`} content={cur.body} />
        ))}
      </div>
      <Pagination curPage={curPage} dispatch={dispatch} totalPage={totalPage} />
      <Footer />
    </div>
  );
}
