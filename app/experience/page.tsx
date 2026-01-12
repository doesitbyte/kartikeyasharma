import Link from "next/link";
import Image from "next/image";
import { Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import { getExperienceSlug } from "@/lib/utils-data";
import { AnimatedSection } from "@/app/components/animated-section";
import { AnimatedGrid } from "@/app/components/animated-grid";
import { AnimatedHero } from "@/app/components/animated-hero";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { ui_content } = await getAllData();
  
  return {
    title: "Experience",
    description: ui_content.experience.hero.subtitle,
    openGraph: {
      title: "Professional Experience | Kartikeya Sharma",
      description: ui_content.experience.hero.subtitle,
    },
  };
}

export default async function Experience() {
  const { experiences, ui_content } = await getAllData();

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pb-0 overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={ui_content.experience.hero_image}
            alt={ui_content.experience.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <AnimatedHero>
              <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                  {ui_content.experience.hero.title}
                </h1>
                <div className="h-1 w-24 bg-white mb-4" />
                <p className="text-xl md:text-2xl font-semibold text-white/90">
                  {ui_content.experience.hero.subtitle}
                </p>
              </div>
            </AnimatedHero>
          </div>
        </div>
      </section>

      {/* Experience Grid Section */}
      <AnimatedSection className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <TracingBeam scrollProgressThreshold={0.5}>
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {ui_content.experience.professional_experience_label}
              </h2>
            </div>
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {experiences.map((experience, index) => {
                const slug = getExperienceSlug(experience, index);
                return (
                  <Link
                    key={index}
                    href={`/experience/${slug}`}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-72 w-full">
                      <Image
                        src={experience.image}
                        alt={experience.position}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-link transition-colors">
                        {experience.position}
                      </h3>
                      <p className="text-base font-semibold text-muted-foreground mb-2">
                        {experience.organization}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {experience.institution}
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground mb-4 border-b border-border pb-4">
                        {experience.duration}
                      </p>
                      {experience.responsibilities && (
                        <div className="mt-4">
                          <ul className="space-y-2">
                            {experience.responsibilities
                              .slice(0, 3)
                              .map((responsibility, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-foreground mt-1">
                                    •
                                  </span>
                                  <span className="line-clamp-2">
                                    {responsibility}
                                  </span>
                                </li>
                              ))}
                            {experience.responsibilities.length > 3 && (
                              <li className="text-xs text-muted-foreground italic">
                                +{experience.responsibilities.length - 3} more
                                responsibilities
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      <div className="mt-4 text-sm font-semibold text-link group-hover:underline">
                        {ui_content.experience.view_details}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </AnimatedGrid>
          </TracingBeam>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative border-b border-border bg-muted/10 py-16 overflow-hidden" delay={0.1}>
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.experience.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.experience.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/publications">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.experience.cta.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.experience.cta.view_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">
                {ui_content.experience.cta.about_me}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
