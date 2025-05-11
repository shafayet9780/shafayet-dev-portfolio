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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                let theme = localStorage.getItem('theme');
                
                if (theme === 'vs-light' || (!theme && !isDark)) {
                  document.documentElement.setAttribute('data-theme', 'vs-light');
                } else if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body className={sourceSans.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}
