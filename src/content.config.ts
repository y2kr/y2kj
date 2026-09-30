import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })),
    repository: z.url().optional(),
    document: z.string().optional(),
  }),
});

export const collections = { projects };
