import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import { getPublicationSlug } from "@/lib/utils-data";
import { AnimatedSection } from "@/app/components/animated-section";
import { AnimatedGrid } from "@/app/components/animated-grid";
import { AnimatedHero } from "@/app/components/animated-hero";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { ui_content } = await getAllData();
  
  return {
    title: "Publications",
    description: ui_content.publications.hero.subtitle,
    openGraph: {
      title: "Publications & Presentations | Kartikeya Sharma",
      description: ui_content.publications.hero.subtitle,
    },
  };
}

export default async function Publications() {
  const { publications_and_presentations, ui_content } = await getAllData();

  // Separate publications and invited talks
  const publications = publications_and_presentations
    .filter((item) => item.type === "publication")
    .sort((a, b) => b.year - a.year);

  const invitedTalks = publications_and_presentations
    .filter((item) => item.type === "invited_talk")
    .sort((a, b) => b.year - a.year);

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pb-0 overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={ui_content.publications.hero_image}
            alt={ui_content.publications.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <AnimatedHero>
              <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                  {ui_content.publications.hero.title}
                </h1>
                <div className="h-1 w-24 bg-white mb-4" />
                <p className="text-xl md:text-2xl font-semibold text-white/90">
                  {ui_content.publications.hero.subtitle}
                </p>
              </div>
            </AnimatedHero>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <AnimatedSection className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <TracingBeam className="max-w-full" scrollProgressThreshold={0.7}>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {ui_content.publications.academic_publications_label}
              </h2>
            </div>
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {publications.map((publication, index) => {
                const pubIndex = publications_and_presentations.findIndex(
                  (p) => p === publication
                );
                const slug = getPublicationSlug(publication, pubIndex);
                return (
                  <Link
                    key={index}
                    href={`/publications/${slug}`}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={publication.image}
                        alt={publication.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-link transition-colors">
                        {publication.title}
                      </h3>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        {publication.publisher}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {publication.year}
                      </p>
                      <div className="text-sm font-semibold text-link group-hover:underline">
                        {ui_content.publications.view_details}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </AnimatedGrid>

            {/* Invited Talks Section */}
            {invitedTalks.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <Mic className="h-6 w-6 text-foreground" />
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {ui_content.publications.invited_talks_label}
                  </h2>
                </div>
                <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                  {invitedTalks.map((talk, index) => {
                    const talkIndex = publications_and_presentations.findIndex(
                      (p) => p === talk
                    );
                    const slug = getPublicationSlug(talk, talkIndex);
                    return (
                      <Link
                        key={index}
                        href={`/publications/${slug}`}
                        className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-64 w-full">
                          <Image
                            src={talk.image}
                            alt={talk.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-link transition-colors">
                            {talk.title}
                          </h3>
                          <p className="text-sm font-semibold text-muted-foreground mb-2">
                            {talk.organization}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {talk.year}
                          </p>
                          <div className="text-sm font-semibold text-link group-hover:underline">
                            {ui_content.publications.view_details}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </AnimatedGrid>
              </div>
            )}
          </TracingBeam>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative border-b border-border bg-muted/10 py-16 overflow-hidden" delay={0.1}>
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.publications.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.publications.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.publications.cta.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.publications.cta.view_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">
                {ui_content.publications.cta.about_me}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
