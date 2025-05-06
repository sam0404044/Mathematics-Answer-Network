"use client";
import Image from "next/image";
// import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

// 型別宣告
interface NoticeProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

export default function Notice({ show, onClose, message }: NoticeProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          key="overlay"
          className="fixed inset-0 bg-black/50 flex items-center justify-center "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
        >
          <motion.div
            key="modal"
            className="bg-transparent rounded-xl w-full overflow-hidden mx-5 max-w-[372px]"
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header、叉按鈕 */}
            <div className="bg-[var(--menu-background)] w-full h-10 flex justify-end rounded-t-xl overflow-hidden px-2">
              <button className="m-1" onClick={onClose}>
                <Image
                  src="/img/close.svg"
                  width={20}
                  height={20}
                  alt="close"
                />
              </button>
            </div>
            {/* body */}
            <div className="p-5 text-center font-bold bg-[var(--white)]">
              {message}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
