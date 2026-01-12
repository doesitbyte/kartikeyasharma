"use client";

import Link from "next/link";

const menuItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects", active: true },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-80 border-r border-border bg-sidebar">
      <div className="sticky top-16 p-8">
        <div className="space-y-1">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-sidebar-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
