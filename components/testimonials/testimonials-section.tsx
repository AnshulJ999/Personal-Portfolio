"use client";

import { motion } from "framer-motion";

import { TestimonialInterface } from "@/config/testimonials";
import { cn } from "@/lib/utils";

function TestimonialCard({
  testimonial,
  featured = false,
  index = 0,
}: {
  testimonial: TestimonialInterface;
  featured?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "relative bg-card rounded-2xl border border-border flex flex-col gap-4",
        "shadow-sm hover:shadow-md transition-shadow duration-300",
        featured ? "p-8" : "p-6"
      )}
    >
      {/* Decorative quote mark */}
      <span
        className="absolute top-3 left-4 text-6xl font-serif leading-none select-none pointer-events-none text-foreground/[0.06]"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <blockquote
        className={cn(
          "text-foreground/80 leading-relaxed pt-5",
          featured ? "text-base sm:text-lg" : "text-sm sm:text-base"
        )}
      >
        {testimonial.quote}
      </blockquote>

      <footer className="flex items-center gap-3 mt-auto pt-3 border-t border-border">
        <div
          className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 font-semibold text-sm text-foreground/70"
          aria-hidden="true"
        >
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground">
            {testimonial.name}
          </p>
          {testimonial.role && (
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          )}
          {!testimonial.role && testimonial.platform && (
            <p className="text-xs text-muted-foreground">
              {testimonial.platform}
            </p>
          )}
        </div>
        {testimonial.role && testimonial.platform && (
          <span className="ml-auto text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            {testimonial.platform}
          </span>
        )}
      </footer>
    </motion.div>
  );
}

interface TestimonialsSectionProps {
  testimonials: TestimonialInterface[];
  columns?: 2 | 3 | 4;
}

export function TestimonialsSection({
  testimonials,
  columns = 2,
}: TestimonialsSectionProps) {
  const sorted = [...testimonials].sort((a, b) => a.sort - b.sort);
  const featured = sorted.filter((t) => t.featured);
  const rest = sorted.filter((t) => !t.featured);

  const regularCols =
    columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2";

  // Responsive cols: 1 → 2 → up to 3 depending on count
  const featuredCols =
    featured.length === 1
      ? "grid-cols-1"
      : featured.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="w-full space-y-4">
      {/* Featured cards */}
      {featured.length > 0 && (
        <div className={cn("grid gap-4", featuredCols)}>
          {featured.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} featured index={i} />
          ))}
        </div>
      )}
      {/* Regular cards */}
      {rest.length > 0 && (
        <div className={cn("grid gap-4", regularCols)}>
          {rest.map((t, i) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              index={featured.length + i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
