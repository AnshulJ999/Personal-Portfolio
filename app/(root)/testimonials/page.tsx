import { Metadata } from "next";

import { AnimatedSection } from "@/components/common/animated-section";
import { AnimatedText } from "@/components/common/animated-text";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { testimonials } from "@/config/testimonials";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What clients, collaborators, and employers say about working with Anshul Jain — AI automation, content writing, and guitar.",
  alternates: {
    canonical: `${siteConfig.url}/testimonials`,
  },
};

export default function TestimonialsPage() {
  return (
    <AnimatedSection
      direction="up"
      className="container space-y-8 py-10 my-6"
    >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <AnimatedText
          as="h1"
          className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl"
        >
          Testimonials
        </AnimatedText>
        <AnimatedText
          as="p"
          delay={0.2}
          className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7"
        >
          Feedback from clients, employers, and collaborators across AI
          automation, content writing, and music.
        </AnimatedText>
      </div>

      {/* All testimonials — 3-col grid on desktop */}
      <TestimonialsSection testimonials={testimonials} columns={3} />
    </AnimatedSection>
  );
}
