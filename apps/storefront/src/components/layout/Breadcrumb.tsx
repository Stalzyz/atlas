import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `https://atlas.grekam.in${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-theme-text-muted mb-6">
        {items.map((item, index) => (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && <span className="opacity-40">/</span>}
            {index === items.length - 1 ? (
              <span className="text-theme-text">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
