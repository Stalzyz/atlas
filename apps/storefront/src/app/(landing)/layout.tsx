import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
  title: "Build an Online Store That Sells 24x7 | Grekam Visuals",
  description: "We create online shopping experiences that help businesses sell more. Choose between Shopify, WooCommerce, and Atlas CMS.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        />
        <link rel="stylesheet" href={`/compiled-landing.css?v=${Date.now()}`} />
      </head>
      <body className="antialiased bg-slate-950 text-slate-50 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
