import Image from "next/image";
import { client } from "@/studio/lib/client";

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

  return (
    <section className="h-[30px] px-2 flex items-center justify-center bg-[--titlebar-bg] text-white text-[0.85rem] border-b border-[#191d20]">
      <Image
        src="/vscode_icon.svg"
        alt="VSCode Icon"
        height={15}
        width={15}
        className="icon"
      />
      <div className="flex flex-1 mr-auto ml-2">
        <p className="px-2 cursor-pointer">File</p>
        <p className="px-2 cursor-pointer">Edit</p>
        <p className="px-2 cursor-pointer">View</p>
        <p className="px-2 cursor-pointer">Go</p>
        <p className="px-2 cursor-pointer">Run</p>
        <p className="px-2 cursor-pointer">Terminal</p>
        <p className="px-2 cursor-pointer">Help</p>
      </div>
      <p className="flex-1 text-center">{mainName}</p>
      <div className="flex flex-1 items-center ml-auto">
        <span className="ml-auto h-[13px] w-[13px] rounded-full cursor-pointer bg-[#f1fa8c]"></span>
        <span className="ml-2 h-[13px] w-[13px] rounded-full cursor-pointer bg-[#50fa7b]"></span>
        <span className="ml-2 h-[13px] w-[13px] rounded-full cursor-pointer bg-[#ff5555]"></span>
      </div>
    </section>
  );
}
