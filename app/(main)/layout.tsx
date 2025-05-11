import { client } from "@/studio/lib/client";
import { Metadata } from "next";
import Titlebar from "../components/Titlebar";
import ClientThemeProvider from "../components/ClientThemeProvider";
import ResponsiveLayout from "@/app/(main)/ResponsiveLayout";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch site settings
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0] {
      title,
      description,
      mainName
    }
  `);

  return {
    title: settings?.title || "Shafayet Ahmmed | Full Stack Developer",
    description: settings?.description || "Portfolio of Shafayet Ahmmed, a passionate Full Stack Developer",
  };
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientThemeProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Titlebar is a server component with async data fetching */}
        <div className="flex-shrink-0">
          <Titlebar />
        </div>
        
        {/* ResponsiveLayout is a client component */}
        <div className="flex-1 overflow-hidden">
          <ResponsiveLayout>
            {children}
          </ResponsiveLayout>
        </div>
      </div>
    </ClientThemeProvider>
  );
}
