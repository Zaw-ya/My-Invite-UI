const fs = require('fs');
const path = require('path');

const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
const apiUrl = 'https://specialcart-dashboard.tryasp.net/api/Blog/published';

async function generateSitemap() {
  console.log('[sitemap] Fetching published blog posts from API...');
  
  let blogUrls = '';
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    
    if (Array.isArray(posts)) {
      console.log(`[sitemap] Found ${posts.length} blog posts. Adding to sitemap...`);
      posts.forEach(post => {
        const slug = post.slug || post.id?.toString();
        if (slug) {
          const date = post.createdAt || post.createdDate || new Date().toISOString();
          const formattedDate = new Date(date).toISOString().split('T')[0];
          
          blogUrls += `
  <!-- Blog Post: ${post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')} -->
  <url>
    <loc>https://www.specialcards.net/blog/${slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
      });
    }
  } catch (error) {
    console.error('[sitemap] Failed to fetch blog posts. Sitemap will only contain static pages.', error);
  }

  const today = new Date().toISOString().split('T')[0];

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <!-- Homepage -->
  <url>
    <loc>https://www.specialcards.net/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="https://www.specialcards.net/"/>
  </url>

  <!-- Designs Catalog -->
  <url>
    <loc>https://www.specialcards.net/designs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="https://www.specialcards.net/designs"/>
  </url>

  <!-- Blog Listing -->
  <url>
    <loc>https://www.specialcards.net/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="https://www.specialcards.net/blog"/>
  </url>

  <!-- Privacy Policy -->
  <url>
    <loc>https://www.specialcards.net/privacy-policy</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Terms & Conditions -->
  <url>
    <loc>https://www.specialcards.net/terms</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Cancellation Policy -->
  <url>
    <loc>https://www.specialcards.net/cancellation-policy</loc>
    <lastmod>2026-05-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>${blogUrls}

</urlset>
`;

  fs.writeFileSync(sitemapPath, content, 'utf-8');
  console.log('[sitemap] Successfully generated public/sitemap.xml');
}

generateSitemap();
