import Link from "next/link";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { WorkCard } from "@/components/work-card";
import { CtaBlock } from "@/components/cta-block";
import { Loader } from "@/components/loader";
import { ValueCard } from "@/components/value-card";
import HeroScene from "@/components/hero-scene";

export default function Home() {
  const featured = projects.slice(0, 2);

  return (
    <>
      <Loader />

      <HeroScene
        heroWord1={site.greeting[0]}
        heroWord2={site.greeting[1]}
        heroWord3={site.greeting[2]}
        heroSubtitle="Product designer & creative developer.\nBetween product, humanities, and code."
        rightVerticalText="PORTFOLIO · 2026"
        quoteLine="Good snow, flake by flake, falls only here."
        scrollHint="Scroll"
        page2Title={site.name}
        page2Subtitle="Curious generalist with too many tabs open.\nNew York, by way of Cornell."
        page2BrandLine="XUYUAN LIU · 刘 栩源"
        page2Footer="© 2026 Xuyuan Liu"
        photoUrl="/media/zoVy03Z9HQEJ1PpuQ0q2P8S8mdA.png"
      />

      <section className="px-6 md:px-10 py-20 border-t border-rule">
        <div className="flex items-baseline justify-between mb-12">
          <span className="text-eyebrow">Featured Project</span>
          <Link
            href="/work"
            className="text-eyebrow text-ink hover:underline underline-offset-4"
          >
            View all projects →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((p) => (
            <WorkCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section className="px-6 md:px-10 py-24 md:py-32 border-t border-rule">
        <span className="text-eyebrow">How I Work</span>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {site.howIWork.map((step) => (
            <ValueCard
              key={step.title}
              title={step.title}
              subtitle={step.subtitle}
              bodyText={step.body}
            />
          ))}
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
