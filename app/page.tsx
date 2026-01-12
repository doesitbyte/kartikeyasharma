import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Linkedin,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/app/components/hero-section";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import {
  getExperienceSlug,
  getAchievementSlug,
  getPublicationSlug,
} from "@/lib/utils-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "PhD student at DTU Health Tech developing tissue interfacing ingestible bioelectronic devices enabled by mechanical energy harvesting for sensing, sampling and drug delivery applications.",
  openGraph: {
    title: "Kartikeya Sharma | Home",
    description: "PhD student at DTU Health Tech developing tissue interfacing ingestible bioelectronic devices enabled by mechanical energy harvesting for sensing, sampling and drug delivery applications.",
  },
};

export default async function Home() {
  const {
    personal_information,
    achievements,
    publications_and_presentations,
    experiences,
    ui_content,
  } = await getAllData();

  // Get most recent achievement
  const recentAchievement = achievements[0];
  const recentAchievementIndex = recentAchievement
    ? achievements.findIndex((a) => a === recentAchievement)
    : -1;

  // Get most recent publication
  const recentPublication = publications_and_presentations.find(
    (
      item
    ): item is (typeof publications_and_presentations)[number] & {
      type: "publication";
    } => item.type === "publication"
  );
  const recentPublicationIndex = recentPublication
    ? publications_and_presentations.findIndex((p) => p === recentPublication)
    : -1;

  // Get current position
  const currentPosition = experiences[0];
  const currentPositionIndex = currentPosition ? 0 : -1;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <HeroSection
        name={personal_information.name}
        tagline={personal_information.tagline}
        bio={ui_content.hero.bio}
        learnMoreButton={ui_content.hero.learn_more_button}
        getInTouchButton={ui_content.hero.get_in_touch_button}
      />

      {/* Quick Links Section */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            {ui_content.home.explore_section.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/about" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <GraduationCap className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.about.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.about.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.about.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/experience" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <Briefcase className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.experience.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.experience.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.experience.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/publications" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <BookOpen className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.publications.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.publications.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.publications.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/achievements" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <Award className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.achievements.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.achievements.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.achievements.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/extracurricular" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <Award className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.extracurricular.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.extracurricular.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.extracurricular.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            <Link href="/contact" className="group">
              <div className="h-full border rounded-none p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center border bg-muted/50">
                    <Mail className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {ui_content.home.explore_section.contact.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {ui_content.home.explore_section.contact.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.explore_section.contact.link_text}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Highlights Section */}
      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            {ui_content.home.recent_highlights.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Position */}
            {currentPosition && currentPositionIndex >= 0 && (
              <Link
                href={`/experience/${getExperienceSlug(
                  currentPosition,
                  currentPositionIndex
                )}`}
                className="group border rounded-none p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {ui_content.home.recent_highlights.current_position_label}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors">
                  {currentPosition.position}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentPosition.organization}, {currentPosition.institution}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {currentPosition.duration}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.recent_highlights.view_details}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </Link>
            )}

            {/* Recent Achievement */}
            {recentAchievement && recentAchievementIndex >= 0 && (
              <Link
                href={`/achievements/${getAchievementSlug(
                  recentAchievement,
                  recentAchievementIndex
                )}`}
                className="group border rounded-none p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {ui_content.home.recent_highlights.recent_achievement_label}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors">
                  {recentAchievement.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {recentAchievement.date}
                </p>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {recentAchievement.description}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.recent_highlights.view_details}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </Link>
            )}

            {/* Recent Publication */}
            {recentPublication && recentPublicationIndex >= 0 && (
              <Link
                href={`/publications/${getPublicationSlug(
                  recentPublication,
                  recentPublicationIndex
                )}`}
                className="group border rounded-none p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 md:col-span-2"
              >
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {ui_content.home.recent_highlights.recent_publication_label}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors">
                  {recentPublication.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {recentPublication.type === "publication"
                    ? `${recentPublication.publisher} • ${recentPublication.year}`
                    : recentPublication.year.toString()}
                </p>
                <div className="text-sm font-semibold text-link group-hover:underline">
                  {ui_content.home.recent_highlights.view_details}{" "}
                  <ArrowRight className="inline h-4 w-4 ml-1" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="relative border-t border-border bg-background py-16 overflow-hidden">
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.home.contact_cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.home.contact_cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Mail className="mr-2 h-5 w-5" />
                {ui_content.home.contact_cta.get_in_touch_button}
              </Button>
            </Link>
            <Link
              href={`https://linkedin.com${personal_information.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <Linkedin className="mr-2 h-5 w-5" />
                {ui_content.home.contact_cta.linkedin_button}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
