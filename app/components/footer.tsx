"use client";

import Link from "next/link";
import { Mail, Linkedin, ExternalLink } from "lucide-react";

interface FooterProps {
  personal_information: {
    name: string;
    email: string;
    linkedin: string;
    orcid: string;
    tagline: string;
  };
  ui_content: {
    footer: {
      navigation_title: string;
      contact_title: string;
      about_title: string;
      copyright_text: string;
    };
  };
}

export function Footer({ personal_information, ui_content }: FooterProps) {

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/publications", label: "Publications" },
    { href: "/achievements", label: "Achievements" },
    { href: "/extracurricular", label: "Extracurricular" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {ui_content.footer.navigation_title}
            </h3>
            <nav className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {ui_content.footer.contact_title}
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href={`mailto:${personal_information.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                {personal_information.email}
              </Link>
              <Link
                href={`https://linkedin.com${personal_information.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href={`https://orcid.org${personal_information.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                ORCID
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {ui_content.footer.about_title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {personal_information.tagline}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {personal_information.name}.{" "}
            {ui_content.footer.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  );
}
