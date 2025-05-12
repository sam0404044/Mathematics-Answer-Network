"use client"; // 註明這是一個客戶端組件

import { useEffect } from "react";

export default function ClientSideEffect({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // MathJax 設定
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
        },
        svg: { fontCache: 'global' }
      };
      `
    ;
    document.head.appendChild(configScript);

    const mathjaxScript = document.createElement("script");
    mathjaxScript.src =
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    mathjaxScript.async = true;
    document.head.appendChild(mathjaxScript);
  }, []);

  return <>{children}</>;
}