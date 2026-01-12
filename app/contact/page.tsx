import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  ExternalLink,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { personal_information, ui_content } = await getAllData();
  
  return {
    title: "Contact",
    description: ui_content.contact.hero.subtitle,
    openGraph: {
      title: `Contact ${personal_information.name}`,
      description: ui_content.contact.hero.subtitle,
    },
  };
}

export default async function Contact() {
  const { personal_information, ui_content } = await getAllData();

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pt-32 pb-0 overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={ui_content.contact.hero_image}
            alt={ui_content.contact.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {ui_content.contact.hero.title}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {ui_content.contact.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-3 mb-8">
            <MessageSquare className="h-6 w-6 text-foreground" />
            <h2 className="text-2xl md:text-3xl font-bold">
              {ui_content.contact.get_in_touch_label}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email Card */}
            <Link
              href={`mailto:${personal_information.email}`}
              className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                  <Mail className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold">
                  {ui_content.contact.email.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {ui_content.contact.email.description}
              </p>
              <div className="text-sm font-semibold text-link group-hover:underline">
                {personal_information.email}
                <ArrowRight className="inline h-4 w-4 ml-1" />
              </div>
            </Link>

            {/* LinkedIn Card */}
            <Link
              href={`https://linkedin.com${personal_information.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                  <Linkedin className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold">
                  {ui_content.contact.linkedin.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {ui_content.contact.linkedin.description}
              </p>
              <div className="text-sm font-semibold text-link group-hover:underline">
                {ui_content.contact.linkedin.link_text}
                <ExternalLink className="inline h-4 w-4 ml-1" />
              </div>
            </Link>

            {/* ORCID Card */}
            <Link
              href={`https://orcid.org${personal_information.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                  <ExternalLink className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold">
                  {ui_content.contact.orcid.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {ui_content.contact.orcid.description}
              </p>
              <div className="text-sm font-semibold text-link group-hover:underline">
                {ui_content.contact.orcid.link_text}
                <ExternalLink className="inline h-4 w-4 ml-1" />
              </div>
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-16 border border-border p-6">
            <h3 className="text-xl font-bold mb-4">
              {ui_content.contact.about_collaboration.title}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              {ui_content.contact.about_collaboration.description}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {ui_content.contact.about_collaboration.interests}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-b border-border bg-muted/10 py-16 overflow-hidden">
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.contact.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.contact.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/about">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.contact.cta.about_me}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/experience">
              <Button variant="outline">
                {ui_content.contact.cta.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.contact.cta.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
