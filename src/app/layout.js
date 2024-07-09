import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import Header from "./components/header/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Green Crem - магазин косметики в Україні",
  description: "Green Crem - магазин косметики в Україні",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/Logo.webp" />
      </Head>
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
