import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeSense AI | AI-Powered Code Intelligence",
  description: "Detect bugs, security vulnerabilities, and optimize performance with AI code review. Ship better code faster.",
  keywords: "ai code review, code analysis, security scanner, code optimization, developer tools",
  openGraph: {
    title: "CodeSense AI",
    description: "AI-Powered Code Intelligence Platform",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
