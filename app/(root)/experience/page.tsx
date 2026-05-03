import { Award, BookOpen, GraduationCap } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

import PageContainer from "@/components/common/page-container";
import { SectionNav } from "@/components/common/section-nav";
import { RecommendationLetter } from "@/components/experience/recommendation-letter";
import Timeline from "@/components/experience/timeline";
import { experiences } from "@/config/experience";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import profileFullImg from "@/public/profile-full.jpg";

export const metadata: Metadata = {
  title: pagesConfig.experience.metadata.title,
  description: pagesConfig.experience.metadata.description,
  keywords: [
    "AI automation specialist",
    "Upwork Top Rated Plus",
    "Webselenese AI team",
    "HARPA AI commands",
    "content writer to AI specialist",
    "professional experience",
    "Anshul Jain",
  ],
  alternates: {
    canonical: `${siteConfig.url}/experience`,
  },
};

export default function ExperiencePage() {
  return (
    <PageContainer
      title={pagesConfig.experience.title}
      description={pagesConfig.experience.description}
    >
      <SectionNav
        sections={[
          { id: "about", label: "About" },
          { id: "experience", label: "Experience" },
          { id: "education", label: "Education" },
          { id: "recommendation", label: "Referral" },
        ]}
      />
      {/* ── Bio & Profile Photo ───────────────────────────────────────── */}
      <div id="about" className="mb-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start">
        {/* Left column: bio text — edit in config/pages.ts → pagesConfig.experience.bio */}
        <div className="flex-1 flex flex-col gap-4">
          {(pagesConfig.experience.bio ?? []).map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Right column: profile photo */}
        <div className="relative w-44 md:w-52 shrink-0 aspect-[3/4] rounded-2xl overflow-hidden border border-border shadow-sm mx-auto md:mx-0">
          <Image
            src={profileFullImg}
            alt="Anshul Jain"
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 176px, 208px"
          />
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <div id="experience">
        <Timeline experiences={experiences} />
      </div>

      {/* ── Education & Certifications ───────────────────────────────────── */}
      <div id="education" className="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-foreground mb-8">
          Education &amp; Certifications
        </h2>

        <div className="flex flex-col gap-8">

          {/* KIIT */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-foreground">School of Biotechnology, Kalinga Institute of Industrial Technology (KIIT)</p>
            </div>
            <p className="font-semibold text-foreground mb-2">B.Tech - M.Tech Dual Degree | 2018 - 2023</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>- 9.39 CGPA</p>
              <p>- Member of KORUS - The Official Music Society of KIIT</p>
              <p>- Winner at Rockathon, IIIT Bhubaneshwar (+ Best Guitarist Award), 2020</p>
              <p>- Winner at Spectrum, NIFT Bhubaneshwar, 2020</p>
              <p>- Runners-up at Orion, Sri Sri University, 2020</p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Apeejay */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-foreground">Apeejay School</p>
            </div>
            <p className="font-semibold text-foreground mb-2">Grade 12 | 2018</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>- 93.2 %</p>
              <p>- Ranked 2nd in Science stream</p>
              <p>- Finalist at CBSE National Science Exhibition 2017</p>
              <p>- First Prize in Inter-City Essay Writing Competition by SAIL, 2016</p>
            </div>
          </div>

          <hr className="border-border" />

          {/* Surfer SEO */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-foreground">Surfer SEO</p>
            </div>
            <p className="font-semibold text-foreground">SEO Writing Masterclass | February 2021</p>
          </div>

        </div>
      </div>

      {/* ── Recommendation Letter ─────────────────────────────────────────── */}
      <div id="recommendation">
        <RecommendationLetter />
      </div>
    </PageContainer>
  );
}


