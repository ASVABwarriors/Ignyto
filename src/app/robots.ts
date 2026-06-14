import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Hide admin panel from Google
    },
    sitemap: 'https://ignyto.com/sitemap.xml',
  };
}
