import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lookbooks | Atlas — Curated Editorial Collections",
  description:
    "Explore Atlas seasonal lookbooks — editorial collections showcasing the art of Indian textile tradition styled for the modern woman.",
};

const LOOKBOOKS = [
  {
    id: "spring-summer-2024",
    title: "Spring Summer '24",
    subtitle: "The Kalamkari Chronicles",
    description: "Sun-drenched fields meet ancient hand-painted motifs in our most evocative collection yet.",
    color: "#701A31",
    products: 18,
  },
  {
    id: "festive-2024",
    title: "Festive Edit '24",
    subtitle: "Gold & Grace",
    description: "Richly embellished silks and zardozi work crafted for celebrations that demand the finest.",
    color: "#1A362D",
    products: 24,
  },
  {
    id: "signature-weaves",
    title: "Luxury Weaves",
    subtitle: "The Artisan Series",
    description: "A journey through India's weaving heartlands — Banarasi, Kanjeevaram, and Sambalpuri traditions reimagined.",
    color: "#2C1810",
    products: 15,
  },
  {
    id: "resort-wear",
    title: "Resort Edit",
    subtitle: "Slow Days, Rich Colours",
    description: "Lightweight cottons and breezy linens for unhurried mornings and golden evenings.",
    color: "#1A3045",
    products: 12,
  },
];

export default function LookbooksPage() {
  return (
    <main className="pt-[72px]">
      {/* Header */}
      <section className="py-24 px-6 text-center border-b border-theme-border">
        <span className="text-xs uppercase tracking-[0.4em] font-bold text-primary opacity-60 block mb-6">
          Editorial Collections
        </span>
        <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter text-theme-text mb-6">
          Lookbooks
        </h1>
        <p className="text-xl text-theme-text-muted font-sans font-light max-w-xl mx-auto">
          Each season, we tell a story. Explore our curated editorials where luxury meets contemporary style.
        </p>
      </section>

      {/* Lookbooks Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {LOOKBOOKS.map((lookbook, idx) => (
            <Link
              key={lookbook.id}
              href={`/collections/${lookbook.id}`}
              className="group relative aspect-[4/5] md:aspect-[4/3] rounded-[3rem] overflow-hidden flex flex-col justify-end p-10 cursor-pointer"
              style={{ backgroundColor: lookbook.color }}
            >
              {/* Grain texture */}
              <div className="absolute inset-0 luxury-grain opacity-20 pointer-events-none" />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Large background letter */}
              <div className="absolute top-8 right-8 text-[12rem] font-serif font-bold text-white/5 leading-none select-none">
                {idx + 1}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60 block mb-3">
                  {lookbook.subtitle}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-3 leading-tight">
                  {lookbook.title}
                </h2>
                <p className="text-white/70 font-sans font-light text-sm leading-relaxed mb-6 max-w-sm">
                  {lookbook.description}
                </p>
                <div className="flex items-center gap-6">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">
                    {lookbook.products} pieces
                  </span>
                  <span className="text-white text-xs font-bold uppercase tracking-widest group-hover:text-white/70 transition-colors flex items-center gap-2">
                    Explore 
                    <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center border-t border-theme-border">
        <p className="text-theme-text-muted font-sans mb-8 text-lg font-light">
          Looking for something specific?
        </p>
        <Link href="/collections/all" className="luxury-button">
          Shop All Collections
        </Link>
      </section>
    </main>
  );
}
