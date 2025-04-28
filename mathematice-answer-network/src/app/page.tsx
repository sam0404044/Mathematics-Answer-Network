'use client';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import styles from './page.module.css';
import HeroSection from './components/HeroSection';
import StartBtn from './components/button/StartBtn';
import About from './components/About';
import Menu from './components/Menu';
import Animation from './components/Animation';
import { useEffect, useState } from 'react';

export default function page() {
    const [isActive, setIsActive] = useState(false);
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
                    <NavBar isActive={isActive} onIsActive={setIsActive} />
                    {isActive ? <Menu onIsActive={setIsActive} /> : ''}
                    <div className={styles.content}>
                        <HeroSection />
                        <StartBtn>Start answering</StartBtn>
                        <About />
                    </div>
                    <Footer />
                </>
            )}
        </div>
    );
}
