import { MathJaxContext } from "better-react-mathjax";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MWBB",
  icons: {
    icon: "/img/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MathJaxContext
          config={{
            loader: { load: ["[tex]/ams"] },
            tex: {
              packages: { "[+]": ["ams"] },
            },
          }}
        >
          {children}
        </MathJaxContext>
      </body>
    </html>
  );
}
