import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import { getAchievementSlug } from "@/lib/utils-data";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { ui_content } = await getAllData();
  
  return {
    title: "Achievements",
    description: ui_content.achievements.hero.subtitle,
    openGraph: {
      title: "Achievements & Awards | Kartikeya Sharma",
      description: ui_content.achievements.hero.subtitle,
    },
  };
}

export default async function Achievements() {
  const { achievements, ui_content } = await getAllData();

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pt-32 pb-0 overflow-hidden">
        <div className="relative h-[80vh] min-h-[400px] w-full">
          <Image
            src={ui_content.achievements.hero_image}
            alt={ui_content.achievements.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {ui_content.achievements.hero.title}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {ui_content.achievements.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid Section */}
      <section className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <TracingBeam scrollProgressThreshold={0.4}>
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {ui_content.achievements.awards_grants_label}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {achievements.map((achievement, index) => {
                const slug = getAchievementSlug(achievement, index);
                return (
                  <Link
                    key={index}
                    href={`/achievements/${slug}`}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-link transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-sm font-semibold text-muted-foreground mb-4 border-b border-border pb-4">
                        {achievement.date}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {achievement.description}
                      </p>
                      <div className="text-sm font-semibold text-link group-hover:underline">
                        {ui_content.achievements.view_details}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-b border-border bg-muted/10 py-16 overflow-hidden">
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.achievements.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.achievements.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.achievements.cta.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.achievements.cta.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">
                {ui_content.achievements.cta.about_me}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
