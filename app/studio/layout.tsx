import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";

const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sanity Studio',
  description: 'Content management for Shafayet\'s portfolio',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sourceSans.className} h-screen w-full bg-white`}>
        {children}
      </body>
    </html>
  );
} 