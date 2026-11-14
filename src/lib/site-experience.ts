import { z } from "zod";
import defaults from "@/data/hero-slides.json";
export const heroShapes = ["embrace", "diagonal", "arch", "ribbon"] as const;
export const heroSlideSchema = z.object({
  id: z.string().regex(/^[\w-]{1,80}$/),
  image: z
    .string()
    .max(2048)
    .refine(
      (value) => /^https:\/\//i.test(value) || /^\/(?!\/)/.test(value),
      "Use a secure image URL or a local image path.",
    ),
  title: z.string().trim().min(1).max(100),
  emphasis: z.string().max(100),
  body: z.string().max(250),
  shape: z.enum(heroShapes),
  active: z.boolean(),
});
export const siteExperienceSchema = z.object({
  heroSlides: z
    .array(heroSlideSchema)
    .min(1)
    .max(10)
    .refine(
      (slides) => slides.some((slide) => slide.active),
      "Keep at least one hero slide visible.",
    )
    .refine(
      (slides) => new Set(slides.map((slide) => slide.id)).size === slides.length,
      "Slide IDs must be unique.",
    ),
  maintenance: z.object({ enabled: z.boolean(), message: z.string().trim().min(1).max(300) }),
});
export type HeroSlide = z.infer<typeof heroSlideSchema>;
export type SiteExperience = z.infer<typeof siteExperienceSchema>;
export const DEFAULT_EXPERIENCE: SiteExperience = siteExperienceSchema.parse({
  heroSlides: defaults,
  maintenance: {
    enabled: false,
    message: "We’re making a few improvements. Please visit us again soon.",
  },
});
