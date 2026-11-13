import type { APIRoute } from 'astro';
import accommodations from '../data/accommodations.json';
import wahanaDetails from '../data/wahanaDetails.json';
import eventDetails from '../data/eventDetails.json';

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site ? site.toString().replace(/\/$/, '') : 'https://jolotundo.vercel.app';
  const lastmod = new Date().toISOString().split('T')[0];

  const staticEntries: SitemapEntry[] = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/akomodasi', priority: '0.9', changefreq: 'weekly' },
    { path: '/wahana', priority: '0.9', changefreq: 'weekly' },
    { path: '/event', priority: '0.9', changefreq: 'weekly' },
    { path: '/lokasi', priority: '0.8', changefreq: 'monthly' },
    { path: '/tentang', priority: '0.7', changefreq: 'monthly' },
    { path: '/fasilitas/river-breeze', priority: '0.8', changefreq: 'weekly' },
    { path: '/fasilitas/jolotundo-cafe', priority: '0.8', changefreq: 'weekly' }
  ];

  const accommodationEntries: SitemapEntry[] = accommodations.map((item) => ({
    path: `/akomodasi/${item.id}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const wahanaEntries: SitemapEntry[] = wahanaDetails.map((item) => ({
    path: `/wahana/${item.id}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const eventEntries: SitemapEntry[] = eventDetails.map((item) => ({
    path: `/event/${item.id}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allEntries = [
    ...staticEntries,
    ...accommodationEntries,
    ...wahanaEntries,
    ...eventEntries
  ];

  const urlsXml = allEntries
    .map(
      ({ path, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};

