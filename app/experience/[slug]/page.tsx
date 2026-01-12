import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import {
  findExperienceBySlug,
  getExperienceSlug,
  getRelatedExperiences,
} from "@/lib/utils-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface ExperienceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ExperienceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAllData();
  const result = findExperienceBySlug(slug, data);

  if (!result) {
    return {
      title: "Experience Not Found",
    };
  }

  const { experience } = result;
  
  return {
    title: `${experience.position} at ${experience.organization}`,
    description: `${experience.position} at ${experience.organization}, ${experience.institution}. ${experience.duration}.`,
    openGraph: {
      title: `${experience.position} at ${experience.organization}`,
      description: `${experience.position} at ${experience.organization}, ${experience.institution}. ${experience.duration}.`,
    },
  };
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { slug } = await params;
  const data = await getAllData();
  const result = findExperienceBySlug(slug, data);

  if (!result) {
    notFound();
  }

  const { experience, index } = result;
  const relatedExperiences = getRelatedExperiences(index, data, 3);
  const { ui_content } = data;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-background pt-32 pb-16 overflow-hidden">
        <div className="relative h-[40vh] min-h-[300px] w-full">
          <Image
            src={experience.image}
            alt={experience.position}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {ui_content.experience.detail.back_link}
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {experience.position}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {experience.organization}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-base font-semibold">{experience.duration}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="text-base font-semibold">
                  {experience.organization}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 md:col-span-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Institution</p>
                <p className="text-base font-semibold">
                  {experience.institution}
                </p>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          {experience.responsibilities &&
            experience.responsibilities.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
                  <Briefcase className="h-6 w-6" />
                  {ui_content.experience.detail.key_responsibilities_title}
                </h2>
                <ul className="space-y-4">
                  {experience.responsibilities.map((responsibility, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-base text-muted-foreground"
                    >
                      <span className="text-foreground mt-1 font-bold">•</span>
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </section>

      {/* Related Experiences */}
      {relatedExperiences.length > 0 && (
        <section className="border-b border-border bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {ui_content.experience.detail.other_experiences_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedExperiences.map((relatedExp, idx) => {
                const relatedIndex = data.experiences.findIndex(
                  (e) => e === relatedExp
                );
                return (
                  <Link
                    key={idx}
                    href={`/experience/${getExperienceSlug(
                      relatedExp,
                      relatedIndex
                    )}`}
                    className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors">
                      {relatedExp.position}
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground mb-2">
                      {relatedExp.organization}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {relatedExp.duration}
                    </p>
                    <div className="text-sm font-semibold text-link group-hover:underline">
                      {ui_content.experience.detail.view_details}
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
            {ui_content.experience.detail.explore_more.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.experience.detail.explore_more.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/publications">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.experience.detail.explore_more.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.experience.detail.explore_more.view_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/experience">
              <Button variant="outline">
                {ui_content.experience.detail.explore_more.all_experiences}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
