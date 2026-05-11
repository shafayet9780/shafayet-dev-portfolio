export interface ContactItem {
  social: string;
  link: string;
  href: string;
}

const defaultContactItems: ContactItem[] = [
  {
    social: "website",
    link: "shafayet.dev",
    href: "https://shafayet.dev",
  },
  {
    social: "email",
    link: "contact@shafayet.dev",
    href: "mailto:contact@shafayet.dev",
  },
  {
    social: "github",
    link: "shafayet9780",
    href: "https://github.com/shafayet9780",
  },
  {
    social: "linkedin",
    link: "shafayet-ahmmed",
    href: "https://www.linkedin.com/in/shafayet-ahmmed/",
  },
];

interface ContactCodeProps {
  socialLinks?: ContactItem[];
}

export default function ContactCode({ socialLinks = [] }: ContactCodeProps) {
  const contactItems = socialLinks.length > 0 ? socialLinks : defaultContactItems;

  return (
    <div className="overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-xl">
      <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28ca41]" />
        </div>
        <p className="font-mono text-xs text-(--text-color) opacity-55">
          contact.handoff
        </p>
      </div>

      <div className="p-5 font-mono text-sm leading-7 text-(--text-color)">
        <p>
          <span className="text-(--accent-color)">.senior-handoff</span> {"{"}
        </p>
        {contactItems.map((item) => (
          <p className="ml-5" key={`${item.social}-${item.href}`}>
            <span className="text-[#9CDCFE]">{item.social}:</span>{" "}
            <a
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                item.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="text-[#CE9178] hover:underline"
            >
              {item.link}
            </a>
            ;
          </p>
        ))}
        <p>{"}"}</p>
      </div>
    </div>
  );
}
