import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import { AnimatedSection } from "@/app/components/animated-section";
import { AnimatedGrid } from "@/app/components/animated-grid";
import { AnimatedHero } from "@/app/components/animated-hero";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { ui_content } = await getAllData();
  
  return {
    title: "Extracurricular",
    description: ui_content.extracurricular.hero.subtitle,
    openGraph: {
      title: "Extracurricular Activities | Kartikeya Sharma",
      description: ui_content.extracurricular.hero.subtitle,
    },
  };
}

export default async function Extracurricular() {
  const { hobbies_interests_and_extracurricular, ui_content } =
    await getAllData();
  const { student_athlete, sports_coach, others } =
    hobbies_interests_and_extracurricular;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pb-0 overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={ui_content.extracurricular.hero_image}
            alt={ui_content.extracurricular.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <AnimatedHero>
              <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                  {ui_content.extracurricular.hero.title}
                </h1>
                <div className="h-1 w-24 bg-white mb-4" />
                <p className="text-xl md:text-2xl font-semibold text-white/90">
                  {ui_content.extracurricular.hero.subtitle}
                </p>
              </div>
            </AnimatedHero>
          </div>
        </div>
      </section>

      {/* Student Athlete Section */}
      <AnimatedSection className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <TracingBeam scrollProgressThreshold={0.7}>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {ui_content.extracurricular.student_athlete_label}
              </h2>
            </div>
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {student_athlete.map((item, index) => (
                <div
                  key={index}
                  className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={item.image}
                      alt={item.achievement}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-3">
                      {item.achievement}
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {item.year}
                    </p>
                  </div>
                </div>
              ))}
            </AnimatedGrid>

            {/* Sports Coach Section */}
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <Users className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {ui_content.extracurricular.sports_coach_label}
                </h2>
              </div>
              <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {sports_coach.map((item, index) => (
                  <div
                    key={index}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={item.image}
                        alt={item.role}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3">
                        {item.role}
                      </h3>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {item.year}
                      </p>
                    </div>
                  </div>
                ))}
              </AnimatedGrid>
            </div>

            {/* Other Interests Section */}
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <Heart className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {ui_content.extracurricular.other_interests_label}
                </h2>
              </div>
              <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {others.map((interest, index) => (
                  <div
                    key={index}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={interest.image}
                        alt={interest.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold">
                        {interest.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </AnimatedGrid>
            </div>
          </TracingBeam>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative border-b border-border bg-muted/10 py-16 overflow-hidden" delay={0.1}>
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.extracurricular.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.extracurricular.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.extracurricular.cta.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.extracurricular.cta.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.extracurricular.cta.view_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
