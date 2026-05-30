import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const products = (await getCollection('products'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'AcLab+ — Ấn phẩm & Working Papers',
    description: 'Working paper, sách và báo cáo nghiên cứu của AcLab+.',
    site: context.site ?? 'https://aclab.plus',
    items: products.map(p => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/san-pham/${p.id}/`,
      author: p.data.authors.join(', '),
    })),
    customData: `<language>vi</language>`,
  });
}
