"use client";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import styles from "./page.module.css";
import HeroSection from "./components/HeroSection";
import StartBtn from "./components/button/StartBtn";
import About from "./components/About";
import Animation from "./components/Animation";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function Page() {
  const auth = useContext(AuthContext);
  if (!auth) return null;
  const { isLogin } = auth;

  const [showAnimation, setShowAnimation] = useState(false);
  const [blockRender, setBlockRender] = useState(true);

  useEffect(function () {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "true");
      setShowAnimation(true);
      const fadeOut = setTimeout(() => {
        setShowAnimation(false);
      }, 5000);
      return () => clearTimeout(fadeOut);
    }
  }, []);

  useEffect(
    function () {
      setBlockRender(false);
    },
    [showAnimation]
  );

  if (blockRender) return;

  if (showAnimation)
    return (
      <div className={styles.container}>
        <Animation />
      </div>
    );

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.content}>
        <HeroSection />
        <StartBtn isLogin={isLogin}>開始答題</StartBtn>
        <About />
      </div>
      <Footer />
    </div>
  );
}
