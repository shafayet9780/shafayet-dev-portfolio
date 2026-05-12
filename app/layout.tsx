import "./globals.css";
import "./theme.css";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import {
  defaultDescription,
  defaultKeywords,
  siteTitle,
  siteUrl,
} from "@/lib/seo";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "shafayet.dev",
  title: {
    default: `${siteTitle} | Engineering Leader & Full Stack Architect`,
    template: `%s | ${siteTitle}`,
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: siteTitle, url: siteUrl }],
  creator: siteTitle,
  publisher: siteTitle,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteTitle} | Engineering Leader & Full Stack Architect`,
    description: defaultDescription,
    url: siteUrl,
    siteName: siteTitle,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteTitle} | Engineering Leader & Full Stack Architect`,
    description: defaultDescription,
    creator: "@shafayet2368",
  },
  robots: {
    index: true,
    follow: true,
  },
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
