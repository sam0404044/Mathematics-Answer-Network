"use client";
import { motion } from "framer-motion";

export default function LoginAnimation() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 上半 */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-(--animation-object)"
                initial={{ y: "-50%" }} // 從自身高度的 -100%（畫面外上方）開始
                animate={{ y: 0 }} // 以自身高度為基準，滑到 y:0（剛好貼齊容器上緣）
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.5,
                }}
            />

            {/* 下半黑塊 */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-(--animation-object)"
                initial={{ y: "50%" }} // 從畫面外下方開始
                animate={{ y: 0 }} // 目標位置剛好貼齊容器底緣
                transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 0.5,
                }}
            />

            {/* 中心文字 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.h1
                    className="text-(--animation-background) text-3xl font-bold"
                    initial={{ color: "var(--animation-object)" }}
                    animate={{ color: "var(--animation-background)" }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "reverse",
                        repeatDelay: 0.5,
                    }}
                >
                    MWBB
                </motion.h1>
            </div>
        </div>
    );
}
