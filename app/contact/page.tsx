import ContactCode from "@/app/components/ContactCode";
import { client } from "@/studio/lib/client";

async function getData() {
  const socialLinks = await client.fetch(`
    *[_type == "social"]
  `);
  
  return { socialLinks };
}

export default async function ContactPage() {
  const { socialLinks } = await getData();
  
  return (
    <div className="py-4">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-6">
            Feel free to reach out if you're looking for a developer, have a question, or just want to connect.
          </p>
          <ContactCode socialLinks={socialLinks} />
        </div>
      </div>
    </div>
  );
} 