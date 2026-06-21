import ClientLayout from "@/components/layout/ClientLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raaghas Admin",
  description: "Luxury Ethnic Wear Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="/compiled.css" />
      </head>
      <body className="bg-[var(--bg)] text-[var(--text-primary)] flex h-screen overflow-hidden antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
