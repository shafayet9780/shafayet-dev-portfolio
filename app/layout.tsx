import "./globals.css";
import "./theme.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shafayet's Portfolio",
  description: "Portfolio of Shafayet Ahmmed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={sourceSans.className}>
        {children}
      </body>
    </html>
  );
}
