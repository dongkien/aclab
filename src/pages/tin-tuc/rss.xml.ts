import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'AcLab+ — Tin tức',
    description: 'Thông báo, call for papers, seminar và hoạt động học thuật của AcLab+.',
    site: context.site ?? 'https://aclab.plus',
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/tin-tuc/${p.id}/`,
    })),
    customData: `<language>vi</language>`,
  });
}
