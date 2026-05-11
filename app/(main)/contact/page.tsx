import ContactCode from "@/app/components/ContactCode";
import type { ContactItem } from "@/app/components/ContactCode";
import { client } from "@/studio/lib/client";

const collaborationFit = [
  {
    title: "Leadership",
    body: "Team direction, review culture, and delivery clarity.",
  },
  {
    title: "Architecture",
    body: "System direction, tradeoffs, and maintainable boundaries.",
  },
  {
    title: "Reliability",
    body: "CI/CD, release flow, and delivery-risk reduction.",
  },
];

async function getData() {
  const socialLinks = await client.fetch<ContactItem[]>(`
    *[_type == "social"] | order(orderRank asc) {
      social,
      link,
      href
    }
  `);
  
  return { socialLinks };
}

export default async function ContactPage() {
  const { socialLinks } = await getData();
  
  return (
    <div className="relative overflow-hidden pb-14">
      <div className="pointer-events-none absolute inset-0 workstation-grid opacity-25" />
      <div className="pointer-events-none absolute left-8 top-12 h-64 w-64 rounded-full bg-[rgba(var(--accent-rgb),0.12)] blur-3xl" />

      <section className="relative grid gap-8 py-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div>
          <p className="font-mono text-xs text-(--accent-color)">
            senior-handoff/contact.route
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.02] tracking-normal text-(--text-color) sm:text-6xl">
            Bring the hard technical question.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-(--text-color) opacity-70">
            Reach out when architecture, reliability, or team execution needs
            clearer direction.
          </p>
        </div>

        <ContactCode socialLinks={socialLinks} />
      </section>

      <section className="relative mt-4 rounded-lg border border-(--explorer-border) bg-(--article-bg) p-5 shadow-xl">
        <p className="font-mono text-xs text-(--accent-color)">
          collaboration.fit
        </p>
        <h2 className="mt-3 text-2xl font-bold text-(--text-color)">
          Useful conversations start here.
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {collaborationFit.map((item, index) => (
            <div
              key={item.title}
              className="rounded-md border border-(--explorer-border) bg-(--main-bg)/55 p-4"
            >
              <p className="font-mono text-xs text-(--accent-color)">
                fit.{String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-base font-semibold text-(--text-color)">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-(--text-color) opacity-75">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-8 overflow-hidden rounded-lg border border-(--explorer-border) bg-(--article-bg) shadow-xl">
        <div className="flex h-10 items-center justify-between border-b border-(--explorer-border) bg-(--titlebar-bg)/85 px-4">
          <p className="font-mono text-xs text-(--accent-color)">
            leadership-message.template
          </p>
          <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2 py-1 font-mono text-[10px] text-(--accent-color)">
            READY
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
          <div className="border-b border-(--explorer-border) bg-(--main-bg)/55 p-5 lg:border-b-0 lg:border-r">
            <p className="font-mono text-xs text-(--text-color) opacity-45">
              Send enough context for sharper next steps.
            </p>
          </div>
          <div className="space-y-3 p-5 font-mono text-sm leading-7 text-(--text-color) opacity-75">
            <p>subject: Leadership / architecture / DevOps conversation</p>
            <p>context: system, team, or delivery problem</p>
            <p>pressure: risk, blocker, unclear decision, or cost</p>
            <p>goal: what should be true next</p>
            <p>timeline: when the decision matters</p>
            <p>links: repo, notes, incident, roadmap, or product</p>
          </div>
        </div>
      </section>
    </div>
  );
}
