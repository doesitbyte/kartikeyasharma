import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Linkedin,
  GraduationCap,
  Award,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { FooterBackground } from "@/components/ui/footer-background";
import { getAllData } from "@/lib/get-data";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { personal_information, ui_content } = await getAllData();
  
  return {
    title: "About",
    description: ui_content.about.bio,
    openGraph: {
      title: `About ${personal_information.name}`,
      description: ui_content.about.bio,
    },
  };
}

export default async function About() {
  const { personal_information, skills_and_expertise, education, ui_content } = await getAllData();
  
  // Type assertions for TypeScript
  type EducationItem = typeof education[number];
  type Skill = string;

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section with Image */}
      <section className="relative border-b border-border bg-background pt-32 pb-0 overflow-hidden">
        <div className="relative h-[50vh] min-h-[400px] w-full">
          <Image
            src={ui_content.about.hero_image}
            alt={ui_content.about.hero.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 pb-8 w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white">
                {ui_content.about.hero.title}
              </h1>
              <div className="h-1 w-24 bg-white mb-4" />
              <p className="text-xl md:text-2xl font-semibold text-white/90">
                {ui_content.about.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information Grid */}
      <section className="border-b border-border bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10">
          <TracingBeam scrollProgressThreshold={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {/* Bio Card */}
              <div className="border border-border p-6 sm:col-span-2 lg:col-span-2">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {personal_information.name}
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {ui_content.about.bio}
                </p>
              </div>

              {/* Contact Card */}
              <div className="border border-border p-6">
                <h3 className="text-xl font-bold mb-4">{ui_content.about.contact_label}</h3>
                <div className="space-y-3">
                  <Link
                    href={`mailto:${personal_information.email}`}
                    className="flex items-center gap-3 text-link hover:underline border-b border-border pb-3"
                  >
                    <Mail className="h-5 w-5" />
                    <span>{personal_information.email}</span>
                  </Link>
                  <Link
                    href={`https://linkedin.com${personal_information.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-link hover:underline border-b border-border pb-3"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Link>
                  <Link
                    href={`https://orcid.org${personal_information.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-link hover:underline"
                  >
                    <span>ORCID</span>
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Education Grid Section */}
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl md:text-3xl font-bold">{ui_content.about.education_label}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {education.map((edu: EducationItem, index: number) => (
                  <div
                    key={index}
                    className="border border-border overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-56 w-full">
                      <Image
                        src={edu.image}
                        alt={edu.institution}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {edu.institution}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.duration}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Grid Section */}
            <div className="mt-16">
              <div className="flex items-center gap-3 mb-8">
                <Award className="h-6 w-6 text-foreground" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  {ui_content.about.skills_label}
                </h2>
              </div>
              <div className="max-w-4xl">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skills_and_expertise.map((skill: Skill, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base text-muted-foreground"
                    >
                      <span className="text-foreground mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-b border-border bg-muted/10 py-16 overflow-hidden">
        <FooterBackground />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {ui_content.about.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {ui_content.about.cta.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/experience">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {ui_content.about.cta.view_experience}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/publications">
              <Button variant="outline">
                {ui_content.about.cta.view_publications}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                {ui_content.about.cta.get_in_touch}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
