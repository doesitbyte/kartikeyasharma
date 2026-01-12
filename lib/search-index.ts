import type { data as DataType } from "./data";
import {
  getExperienceSlug,
  getPublicationSlug,
  getAchievementSlug,
} from "./utils-data";

export interface SearchIndexEntry {
  id: string;
  title: string;
  type: "experience" | "publication" | "achievement" | "page" | "skill" | "education" | "extracurricular";
  url: string;
  keywords: string[];
  section: string;
  year?: number;
  preview: string;
  searchableText: string;
}

/**
 * Extract keywords from text for better search matching
 */
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2); // Filter out short words
  
  // Remove duplicates
  return Array.from(new Set(words));
}

/**
 * Build search index from all data
 */
export function buildSearchIndex(data: typeof DataType): SearchIndexEntry[] {
  const index: SearchIndexEntry[] = [];

  // Add main pages
  index.push({
    id: "page-home",
    title: "Home",
    type: "page",
    url: "/",
    keywords: ["home", "main", "landing"],
    section: "home",
    preview: data.ui_content.hero.bio,
    searchableText: `home main landing ${data.personal_information.name} ${data.personal_information.tagline} ${data.ui_content.hero.bio}`,
  });

  index.push({
    id: "page-about",
    title: "About",
    type: "page",
    url: "/about",
    keywords: ["about", "bio", "background", "education", "skills"],
    section: "about",
    preview: data.ui_content.about.bio,
    searchableText: `about bio background education skills ${data.personal_information.name} ${data.personal_information.tagline}`,
  });

  index.push({
    id: "page-experience",
    title: "Experience",
    type: "page",
    url: "/experience",
    keywords: ["experience", "work", "career", "positions", "research"],
    section: "experience",
    preview: data.ui_content.experience.hero.subtitle,
    searchableText: `experience work career positions research ${data.ui_content.experience.hero.subtitle}`,
  });

  index.push({
    id: "page-publications",
    title: "Publications",
    type: "page",
    url: "/publications",
    keywords: ["publications", "papers", "research", "academic", "talks"],
    section: "publications",
    preview: data.ui_content.publications.hero.subtitle,
    searchableText: `publications papers research academic talks ${data.ui_content.publications.hero.subtitle}`,
  });

  index.push({
    id: "page-achievements",
    title: "Achievements",
    type: "page",
    url: "/achievements",
    keywords: ["achievements", "awards", "grants", "accomplishments"],
    section: "achievements",
    preview: data.ui_content.achievements.hero.subtitle,
    searchableText: `achievements awards grants accomplishments ${data.ui_content.achievements.hero.subtitle}`,
  });

  index.push({
    id: "page-extracurricular",
    title: "Extracurricular",
    type: "page",
    url: "/extracurricular",
    keywords: ["extracurricular", "sports", "coaching", "interests", "hobbies"],
    section: "extracurricular",
    preview: data.ui_content.extracurricular.hero.subtitle,
    searchableText: `extracurricular sports coaching interests hobbies ${data.ui_content.extracurricular.hero.subtitle}`,
  });

  index.push({
    id: "page-contact",
    title: "Contact",
    type: "page",
    url: "/contact",
    keywords: ["contact", "email", "linkedin", "orcid", "connect"],
    section: "contact",
    preview: data.ui_content.contact.hero.subtitle,
    searchableText: `contact email linkedin orcid connect ${data.personal_information.email}`,
  });

  // Add experiences
  data.experiences.forEach((experience, idx) => {
    const slug = getExperienceSlug(experience, idx);
    const allText = [
      experience.position,
      experience.organization,
      experience.institution,
      experience.duration,
      ...experience.responsibilities,
    ].join(" ");

    index.push({
      id: `exp-${idx}`,
      title: experience.position,
      type: "experience",
      url: `/experience/${slug}`,
      keywords: extractKeywords(allText),
      section: "experience",
      year: parseInt(experience.duration.match(/\d{4}/)?.[0] || "0"),
      preview: experience.responsibilities[0] || experience.organization,
      searchableText: allText.toLowerCase(),
    });
  });

  // Add publications and presentations
  data.publications_and_presentations.forEach((item, idx) => {
    const slug = getPublicationSlug(item, idx);
    const allText = [
      item.title,
      item.type === "publication" ? item.publisher : item.organization,
      item.year.toString(),
    ].join(" ");

    index.push({
      id: `${item.type}-${idx}`,
      title: item.title,
      type: "publication",
      url: `/publications/${slug}`,
      keywords: extractKeywords(allText),
      section: "publications",
      year: item.year,
      preview: item.type === "publication" ? item.publisher : item.organization,
      searchableText: allText.toLowerCase(),
    });
  });

  // Add achievements
  data.achievements.forEach((achievement, idx) => {
    const slug = getAchievementSlug(achievement, idx);
    const allText = [achievement.title, achievement.date, achievement.description].join(" ");

    index.push({
      id: `achievement-${idx}`,
      title: achievement.title,
      type: "achievement",
      url: `/achievements/${slug}`,
      keywords: extractKeywords(allText),
      section: "achievements",
      year: parseInt(achievement.date.match(/\d{4}/)?.[0] || "0"),
      preview: achievement.description,
      searchableText: allText.toLowerCase(),
    });
  });

  // Add skills
  data.skills_and_expertise.forEach((skill, idx) => {
    const keywords = extractKeywords(skill);
    index.push({
      id: `skill-${idx}`,
      title: skill,
      type: "skill",
      url: "/about",
      keywords,
      section: "about",
      preview: skill,
      searchableText: skill.toLowerCase(),
    });
  });

  // Add education
  data.education.forEach((edu, idx) => {
    const allText = [edu.degree, edu.institution, edu.duration].join(" ");
    index.push({
      id: `edu-${idx}`,
      title: edu.degree,
      type: "education",
      url: "/about",
      keywords: extractKeywords(allText),
      section: "about",
      year: parseInt(edu.duration.match(/\d{4}/)?.[0] || "0"),
      preview: `${edu.institution} • ${edu.duration}`,
      searchableText: allText.toLowerCase(),
    });
  });

  // Add extracurricular activities
  // Student athlete achievements
  data.hobbies_interests_and_extracurricular.student_athlete.forEach((item, idx) => {
    const allText = [item.achievement, item.year.toString()].join(" ");
    index.push({
      id: `athlete-${idx}`,
      title: item.achievement,
      type: "extracurricular",
      url: "/extracurricular",
      keywords: extractKeywords(allText),
      section: "extracurricular",
      year: typeof item.year === "string" ? parseInt(item.year.match(/\d{4}/)?.[0] || "0") : item.year,
      preview: item.achievement,
      searchableText: allText.toLowerCase(),
    });
  });

  // Sports coach roles
  data.hobbies_interests_and_extracurricular.sports_coach.forEach((item, idx) => {
    const allText = [item.role, item.year.toString()].join(" ");
    index.push({
      id: `coach-${idx}`,
      title: item.role,
      type: "extracurricular",
      url: "/extracurricular",
      keywords: extractKeywords(allText),
      section: "extracurricular",
      year: typeof item.year === "string" ? parseInt(item.year.match(/\d{4}/)?.[0] || "0") : item.year,
      preview: item.role,
      searchableText: allText.toLowerCase(),
    });
  });

  // Other interests
  data.hobbies_interests_and_extracurricular.others.forEach((item, idx) => {
    index.push({
      id: `interest-${idx}`,
      title: item.title,
      type: "extracurricular",
      url: "/extracurricular",
      keywords: extractKeywords(item.title),
      section: "extracurricular",
      preview: item.title,
      searchableText: item.title.toLowerCase(),
    });
  });

  return index;
}
