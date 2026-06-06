import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import fs from 'fs';

async function generateSitemap() {
  // Define your website URL
  const baseUrl = 'https://paadha.com';

  // Define your site pages
  const pages = [
    { url: '/home', changefreq: 'monthly', priority: 1.0 },
    { url: '/help', changefreq: 'monthly', priority: 0.8 },
    { url: '/directions', changefreq: 'weekly', priority: 0.7 },
    { url: '/steps', changefreq: 'monthly', priority: 0.6 },
  ];

  // Create a writable stream to save the sitemap
  const writeStream = createWriteStream('../../public/sitemap.xml');

  // Create a SitemapStream
  const sitemapStream = new SitemapStream({ hostname: baseUrl });

  sitemapStream.pipe(writeStream);

  // Add each page to the sitemap
  pages.forEach((page) => {
    sitemapStream.write(page);
  });

  // Close the stream
  sitemapStream.end();

  // Convert stream to promise
  await streamToPromise(sitemapStream);

  console.log('✅ Sitemap generated successfully!');
}

// Run the script
generateSitemap();
