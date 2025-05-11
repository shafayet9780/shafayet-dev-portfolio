import { client } from "@/studio/lib/client";
import TitlebarClient from "./TitlebarClient";

async function getSiteSettings() {
  return await client.fetch(`
    *[_type == "siteSettings"][0] {
      mainName
    }
  `);
}

export default async function Titlebar() {
  const settings = await getSiteSettings();
  const mainName = settings?.mainName || "Shafayet Ahmmed";

  return <TitlebarClient mainName={mainName} />;
}
