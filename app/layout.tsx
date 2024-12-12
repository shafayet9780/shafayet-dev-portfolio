import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Titlebar from "./components/Titlebar";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shafayet Ahmmed | Full Stack Developer",
  description:
    "Portfolio of Shafayet Ahmmed, a passionate Full Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${sourceSans.className} bg-[--main-bg] text-[--text-color]`}
      >
        <Titlebar />
        <main className="min-h-screen bg-[--main-bg]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
