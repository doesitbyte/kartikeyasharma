import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Award, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import {
  findAchievementBySlug,
  getAchievementSlug,
  getRelatedAchievements,
} from "@/lib/utils-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface AchievementDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AchievementDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAllData();
  const result = findAchievementBySlug(slug, data);

  if (!result) {
    return {
      title: "Achievement Not Found",
    };
  }

  const { achievement } = result;
  
  return {
    title: achievement.title,
    description: `${achievement.title} - ${achievement.date}. ${achievement.description}`,
    openGraph: {
      title: achievement.title,
      description: `${achievement.title} - ${achievement.date}. ${achievement.description}`,
    },
  };
}

export default async function AchievementDetailPage({ params }: AchievementDetailPageProps) {
  const { slug } = await params;
  const data = await getAllData();
  const result = findAchievementBySlug(slug, data);

  if (!result) {
    notFound();
  }

  const { achievement, index } = result;
  const relatedAchievements = getRelatedAchievements(index, data, 3);
  const { ui_content } = data;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-background pt-32 pb-16 overflow-hidden">
        <div className="relative h-[40vh] min-h-[300px] w-full">
          <Image
            src={achievement.image}
            alt={achievement.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <Link
                href="/achievements"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {ui_content.achievements.detail.back_link}
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-white" />
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  {ui_content.achievements.detail.achievement_label}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {achievement.title}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {achievement.date}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          {/* Key Information */}
          <div className="mb-12">
            <div className="flex items-start gap-3 mb-6">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-base font-semibold">{achievement.date}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border border-border p-6 bg-muted/30 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {ui_content.achievements.detail.about_title}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {achievement.description}
            </p>
          </div>

          {/* Impact Section */}
          <div className="border border-border p-6">
            <h2 className="text-xl font-bold mb-4">
              {ui_content.achievements.detail.impact_title}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {ui_content.achievements.detail.impact_description}
            </p>
          </div>
        </div>
      </section>

      {/* Related Achievements */}
      {relatedAchievements.length > 0 && (
        <section className="border-b border-border bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {ui_content.achievements.detail.related_achievements_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAchievements.map((relatedAchievement, idx) => {
                const relatedIndex = data.achievements.findIndex((a) => a === relatedAchievement);
                return (
                  <Link
                    key={idx}
                    href={`/achievements/${getAchievementSlug(relatedAchievement, relatedIndex)}`}
                    className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase">Achievement</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors">
                      {relatedAchievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{relatedAchievement.date}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {relatedAchievement.description}
                    </p>
                    <div className="text-sm font-semibold text-link group-hover:underline">
                      {ui_content.achievements.detail.view_details}
                      <ArrowRight className="inline h-4 w-4 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Navigation CTA */}
      <section className="relative border-b border-border bg-background py-16 overflow-hidden">
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.achievements.detail.explore_more.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.achievements.detail.explore_more.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.achievements.detail.explore_more.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.achievements.detail.explore_more.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.achievements.detail.explore_more.all_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
