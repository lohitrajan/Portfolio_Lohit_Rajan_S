import { usePortfolio } from "@/hooks/use-portfolio";
import { staticContent } from "@/content/static";
import type { PortfolioContent } from "@/content/types";
import { CustomSections } from "@/components/portfolio/CustomSections";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Journey } from "@/components/portfolio/Journey";
import { Achievements } from "@/components/portfolio/Achievements";
import { Exploring } from "@/components/portfolio/Exploring";
import { Resume } from "@/components/portfolio/Resume";
import { Contact } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: ({ matches }) => {
    const c = (matches[0]?.loaderData as PortfolioContent | undefined) ?? staticContent;
    const title = c.siteTitle;
    const description = c.metaDescription;
    return ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: c.profile.name,
          jobTitle: c.profile.roles[0] ?? "",
          affiliation: { "@type": "CollegeOrUniversity", name: c.profile.institution },
        }),
      },
    ],
  });
  },
  component: Index,
});

function Index() {
  const c = usePortfolio();
  return (
    <>
      <Hero />
      {!c.hiddenSections.includes("about") && <About />}
      {!c.hiddenSections.includes("projects") && <Projects />}
      {!c.hiddenSections.includes("skills") && <Skills />}
      {!c.hiddenSections.includes("journey") && <Journey />}
      {!c.hiddenSections.includes("achievements") && <Achievements />}
      {!c.hiddenSections.includes("exploring") && <Exploring />}
      {!c.hiddenSections.includes("resume") && <Resume />}
      <CustomSections />
      {!c.hiddenSections.includes("contact") && <Contact />}
    </>
  );
}
