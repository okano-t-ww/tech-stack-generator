import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen">
              <Header />
              <main>{children} </main>
              <Footer />
            </div>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
