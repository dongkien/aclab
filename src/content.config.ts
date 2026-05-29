import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------- Tin tức ----------
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),       // path tới ảnh trong /public
    draft: z.boolean().default(false),
  }),
});

// ---------- Thành viên ----------
const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),                   // chức danh
    order: z.number().default(99),      // thứ tự hiển thị
    avatar: z.string().optional(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    orcid: z.string().url().optional(),
    expertise: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

// ---------- Sản phẩm / Ấn phẩm ----------
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['book', 'paper', 'report', 'other']).default('other'),
    description: z.string().optional(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    link: z.string().url().optional(),
    authors: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, members, products };
