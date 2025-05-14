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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function () {
    const fadeOutTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  return (
    <div className={styles.container}>
      {isLoading ? (
        <Animation />
      ) : (
        <>
          <NavBar />
          <div className={styles.content}>
            <HeroSection />
            <StartBtn isLogin={isLogin}>開始答題</StartBtn>
            <About />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
