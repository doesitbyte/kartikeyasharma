"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  GraduationCap,
  Briefcase,
  BookOpen,
  Award,
  Mail,
  Heart,
} from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Home",
      icon: <Home className="h-full w-full" />,
      href: "/",
    },
    {
      title: "About",
      icon: <GraduationCap className="h-full w-full" />,
      href: "/about",
    },
    {
      title: "Experience",
      icon: <Briefcase className="h-full w-full" />,
      href: "/experience",
    },
    {
      title: "Publications",
      icon: <BookOpen className="h-full w-full" />,
      href: "/publications",
    },
    {
      title: "Achievements",
      icon: <Award className="h-full w-full" />,
      href: "/achievements",
    },
    {
      title: "Extracurricular",
      icon: <Heart className="h-full w-full" />,
      href: "/extracurricular",
    },
    {
      title: "Contact",
      icon: <Mail className="h-full w-full" />,
      href: "/contact",
    },
  ];

  return (
    <FloatingDock
      items={navItems}
      activeHref={pathname}
      desktopClassName="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/30 dark:bg-neutral-900/30 border border-border/30 shadow-lg"
      mobileClassName="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/30 dark:bg-neutral-900/30 border border-border/30 rounded-full"
    />
  );
}
