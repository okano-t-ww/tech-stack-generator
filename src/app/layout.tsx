import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/shared/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import Header from "@/features/layout/Header";
import Footer from "@/features/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tech Stack Generator",
  description:
    "This is a generator tool that creates customized Tech Stack from the Skillicons icon set in Markdown format.",
  openGraph: {
    type: "website",
    url: "https://tech-stack-generator.vercel.app/",
    title: "Tech Stack Generator",
    description:
      "This is a generator tool that creates customized Tech Stack from the Skillicons icon set in Markdown format.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid grid-rows-[auto_1fr_auto] min-h-screen font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main>{children} </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
