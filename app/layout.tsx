import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";
import { Footer } from "~/components/footer";
import { BottomNav } from "@/app/components/bottom-nav";
import { ThemeProvider } from "next-themes";
import { getAllData } from "@/lib/get-data";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kartikeya Sharma | Material Science | Bioelectronics | Energy Harvesting",
    template: "%s | Kartikeya Sharma",
  },
  description: "PhD student at DTU Health Tech developing tissue interfacing ingestible bioelectronic devices enabled by mechanical energy harvesting for sensing, sampling and drug delivery applications.",
  keywords: ["bioelectronics", "material science", "energy harvesting", "PhD", "DTU", "research", "biomedical devices"],
  authors: [{ name: "Kartikeya Sharma" }],
  creator: "Kartikeya Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kartikeya Sharma",
    title: "Kartikeya Sharma | Material Science | Bioelectronics | Energy Harvesting",
    description: "PhD student at DTU Health Tech developing tissue interfacing ingestible bioelectronic devices enabled by mechanical energy harvesting for sensing, sampling and drug delivery applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartikeya Sharma | Material Science | Bioelectronics | Energy Harvesting",
    description: "PhD student at DTU Health Tech developing tissue interfacing ingestible bioelectronic devices enabled by mechanical energy harvesting for sensing, sampling and drug delivery applications.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { personal_information, ui_content } = await getAllData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${hankenGrotesk.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Header />
          {/* <Sidebar /> */}
          <div style={{ paddingTop: "var(--header-height, 96px)" }}>
            {children}
          </div>
          <BottomNav />
          <Footer
            personal_information={personal_information}
            ui_content={ui_content}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
