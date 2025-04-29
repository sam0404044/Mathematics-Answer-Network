"use client";
import styles from "./page.module.css";
import Footer from "../components/Footer";
import QuestionFilterBtn from "@/app/components/button/QuestionFilterBtn";
import TestPaper from "@/app/components/button/TestPaper";
import Pagination from "@/app/components/button/Pagination";
import { useEffect, useState } from "react";

export default function QuestionBank() {
  const [data, setData] = useState([]);
  const [curpage, setCurpage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  if (!data) return;
  const start = (curpage - 1) * 10;
  const end = start + 10;
  // const showCurPage = data.slice(0, 1);   test list num
  const showCurPage = data.slice(start, end);
  const totalPage = data.length / 10;

  useEffect(function () {
    async function getData() {
      setIsLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/comments");
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    }
    getData();
  }, []);

  if (isLoading)
    return (
      <div className={styles.loading}>
        <p className={styles["loading-text"]}>loading...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <QuestionFilterBtn>Question Filter</QuestionFilterBtn>
        {showCurPage.map((cur) => (
          <TestPaper key={cur.id} title={`Test Paper ${cur.id < 10 ? `0${cur.id}` : cur.id}`} content={cur.body} />
        ))}
      </div>
      <Pagination curpage={curpage} setCurpage={setCurpage} totalPage={totalPage} />
      <Footer />
    </div>
  );
}
