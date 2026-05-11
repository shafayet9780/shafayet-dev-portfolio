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
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                let userThemeSet = localStorage.getItem('theme:user-set');
                
                if (theme === 'vs-light' && !userThemeSet) {
                  localStorage.removeItem('theme');
                  theme = '';
                }

                if (theme) {
                  document.documentElement.setAttribute('data-theme', theme);
                } else {
                  document.documentElement.removeAttribute('data-theme');
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
