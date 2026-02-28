import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InternScope — Market Intelligence & Decision Engine",
  description: "Advanced simulator for internship readiness and offer comparison",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {/* Main content area */}
          <main className="relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
