import { client } from "@/studio/lib/client";
import { Metadata } from "next";
import Titlebar from "../components/Titlebar";
import ClientThemeProvider from "../components/ClientThemeProvider";
import ResponsiveLayout from "@/app/(main)/ResponsiveLayout";
import type { TerminalProfile } from "../components/layout/TerminalDrawer";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  // Fetch site settings
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      title,
      description,
      mainName
    }
  `);
  const legacyDescription =
    "Portfolio of Shafayet Ahmmed, a creative full-stack developer and DevOps engineer.";
  const description = settings?.description?.trim();

  return {
    title:
      settings?.title?.trim() ||
      "Shafayet Ahmmed | Engineering Leader & Full Stack Architect",
    description:
      description && description !== legacyDescription
        ? description
        : "Portfolio of Shafayet Ahmmed, an engineering leader, full stack architect, and DevOps specialist.",
  };
}

async function getTerminalProfile(): Promise<TerminalProfile> {
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      mainName,
      jobTitle,
      bio
    }
  `);

  return {
    mainName: settings?.mainName || "Shafayet Ahmmed",
    jobTitle:
      settings?.jobTitle ||
      "Engineering Leader, Full Stack Architect & DevOps Specialist",
    bio:
      settings?.bio ||
      "I help teams clarify architecture, reduce delivery risk, and ship reliable software.",
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const terminalProfile = await getTerminalProfile();

  return (
    <ClientThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Titlebar is a server component with async data fetching */}
        <div className="shrink-0">
          <Titlebar />
        </div>

        {/* ResponsiveLayout is a client component */}
        <div className="flex-1 overflow-hidden">
          <ResponsiveLayout terminalProfile={terminalProfile}>
            {children}
          </ResponsiveLayout>
        </div>
      </div>
    </ClientThemeProvider>
  );
}
