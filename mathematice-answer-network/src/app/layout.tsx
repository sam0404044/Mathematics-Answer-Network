import { Metadata } from "next";
import "./globals.css";
import ClientSideEffect from "./ClientSideEffect/ClientSideEffect"; // 引入客戶端處理的組件
import { AuthProvider } from "./context/AuthContext";

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
        <AuthProvider>
          <ClientSideEffect>{children}</ClientSideEffect>
        </AuthProvider>
      </body>
    </html>
  );
}
