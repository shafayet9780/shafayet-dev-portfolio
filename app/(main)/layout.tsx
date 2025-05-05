import { client } from "@/studio/lib/client";
import Titlebar from "../components/Titlebar";
import Sidebar from "../components/Sidebar";
import Explorer from "../components/Explorer";
import Tabsbar from "../components/Tabsbar";
import Bottombar from "../components/Bottombar";

export async function generateMetadata() {
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
    <div className="bg-[--main-bg] text-[--text-color] flex flex-col h-screen">
      <Titlebar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Explorer />
        <div className="flex flex-col flex-1">
          <Tabsbar />
          <main className="flex-1 overflow-y-auto p-8 bg-[--main-bg]">
            <div className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Bottombar />
    </div>
  );
}
