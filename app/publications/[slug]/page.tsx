import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Building2,
  Mic,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import {
  findPublicationBySlug,
  getPublicationSlug,
  getRelatedPublications,
} from "@/lib/utils-data";
import { AnimatedSection } from "@/app/components/animated-section";
import { AnimatedGrid } from "@/app/components/animated-grid";
import { AnimatedHero } from "@/app/components/animated-hero";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PublicationDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAllData();
  const result = findPublicationBySlug(slug, data);

  if (!result) {
    return {
      title: "Publication Not Found",
    };
  }

  const { item } = result;
  const isPublication = item.type === "publication";
  const publisher = isPublication ? item.publisher : item.organization;
  
  return {
    title: item.title,
    description: `${item.title} - ${publisher} (${item.year})`,
    openGraph: {
      title: item.title,
      description: `${item.title} - ${publisher} (${item.year})`,
    },
  };
}

export default async function PublicationDetailPage({
  params,
}: PublicationDetailPageProps) {
  const { slug } = await params;
  const data = await getAllData();
  const result = findPublicationBySlug(slug, data);

  if (!result) {
    notFound();
  }

  const { item, index } = result;
  const relatedItems = getRelatedPublications(index, data, 3);
  const isPublication = item.type === "publication";
  const { ui_content } = data;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative border-b border-border bg-background pb-16 overflow-hidden">
        <div className="relative h-[40vh] min-h-[300px] w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 flex items-end">
            <AnimatedHero>
              <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <Link
                href="/publications"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {ui_content.publications.detail.back_link}
              </Link>
              <div className="flex items-center gap-3 mb-2">
                {isPublication ? (
                  <BookOpen className="h-6 w-6 text-white" />
                ) : (
                  <Mic className="h-6 w-6 text-white" />
                )}
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  {isPublication
                    ? ui_content.publications.detail.publication_label
                    : ui_content.publications.detail.talk_label}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {item.title}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {isPublication ? item.publisher : item.organization}
              </p>
              </div>
            </AnimatedHero>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <AnimatedSection className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          {/* Key Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="text-base font-semibold">{item.year}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {isPublication ? (
                <BookOpen className="h-5 w-5 text-muted-foreground mt-1" />
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground mt-1" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">
                  {isPublication ? "Publisher" : "Organization"}
                </p>
                <p className="text-base font-semibold">
                  {isPublication ? item.publisher : item.organization}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="border border-border p-6 bg-muted/30">
            <h2 className="text-xl font-bold mb-4">
              {ui_content.publications.detail.about_title.replace(
                "{type}",
                isPublication
                  ? ui_content.publications.detail.publication_label
                  : ui_content.publications.detail.talk_label
              )}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {isPublication
                ? ui_content.publications.detail.about_publication
                : ui_content.publications.detail.about_talk}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Related Publications/Talks */}
      {relatedItems.length > 0 && (
        <AnimatedSection className="border-b border-border bg-background py-16" delay={0.1}>
          <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              {isPublication
                ? ui_content.publications.detail.related_publications_title
                : ui_content.publications.detail.related_talks_title}
            </h2>
            <AnimatedGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem, idx) => {
                const relatedIndex =
                  data.publications_and_presentations.findIndex(
                    (p) => p === relatedItem
                  );
                return (
                  <Link
                    key={idx}
                    href={`/publications/${getPublicationSlug(
                      relatedItem,
                      relatedIndex
                    )}`}
                    className="group border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {relatedItem.type === "publication" ? (
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mic className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground uppercase">
                        {relatedItem.type === "publication"
                          ? "Publication"
                          : "Talk"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-link transition-colors line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {relatedItem.type === "publication"
                        ? relatedItem.publisher
                        : relatedItem.organization}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {relatedItem.year}
                    </p>
                    <div className="text-sm font-semibold text-link group-hover:underline">
                      {ui_content.publications.detail.view_details}
                      <ArrowRight className="inline h-4 w-4 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </AnimatedGrid>
          </div>
        </AnimatedSection>
      )}

      {/* Navigation CTA */}
      <AnimatedSection className="relative border-b border-border bg-background py-16 overflow-hidden" delay={0.2}>
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.publications.detail.explore_more.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.publications.detail.explore_more.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.publications.detail.explore_more.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/achievements">
              <Button variant="outline">
                {ui_content.publications.detail.explore_more.view_achievements}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.publications.detail.explore_more.all_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
