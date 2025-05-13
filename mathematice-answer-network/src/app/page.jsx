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
  // const [isLogin, setIsLogin] = useState("loading");
  const [isLoading, setIsLoading] = useState(true);
  // const [user, setUser] = useState("");

  useEffect(function () {
    const fadeOutTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  // useEffect(() => {
  //   const loginStatus = async function () {
  //     try {
  //       const res = await fetch("/api/user/me", { credentials: "include" });
  //       if (!res.ok) {
  //         setIsLogin(false);
  //         return;
  //       }
  //       const data = await res.json();
  //       if (data.uid) {
  //         setIsLogin(true);
  //         setUser(data);
  //       } else {
  //         setIsLogin(false);
  //       }
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setIsLogin(false);
  //     }
  //   };
  //   loginStatus();
  // }, []);

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
