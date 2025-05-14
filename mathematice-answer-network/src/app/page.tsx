"use client";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import styles from "./page.module.css";
import HeroSection from "./components/HeroSection";
import StartBtn from "./components/button/StartBtn";
import About from "./components/About";
import Animation from "./components/Animation";
import { useEffect, useState } from "react";

export default function Page() {
  // ///////////////////////////////////////////////
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
            <StartBtn>開始答題</StartBtn>
            <About />
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
