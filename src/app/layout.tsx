import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XASAN OS Ultimate | Personal Operating System",
  description:
    "Next-generation personal operating system for productivity, developer workflows, life tracking, and AI-assisted execution.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#080D0B] text-[#F3F7F4] flex flex-col selection:bg-[#10B981]/20 selection:text-[#10B981]`}
      >
        {children}
      </body>
    </html>
  );
}
