export interface TestimonialInterface {
  id: string;
  name: string;
  role?: string;       // e.g. "Head of AI Research, Webselenese"
  platform?: string;   // e.g. "Upwork", "Fiverr", "SoundBetter"
  quote: string;
  sort: number;        // display order — lower = first. Use multiples of 10 to leave room for insertions.
  featured?: boolean;
  hidden?: boolean;    // true = only shown on /testimonials, not homepage
}

export const testimonials: TestimonialInterface[]

export const featuredTestimonials = testimonials.filter((t) => t.featured);
