import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      try {
        const response = await fetch('https://specialcart-dashboard.tryasp.net/api/Blog/published');
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        const params: Array<{ id: string }> = [];
        if (Array.isArray(data)) {
          data.forEach((post: any) => {
            if (post.id) {
              params.push({ id: post.id.toString() });
            }
            if (post.slug && post.slug !== post.id?.toString()) {
              params.push({ id: post.slug });
            }
          });
        }
        return params;
      } catch (error) {
        console.error('[prerender] Error fetching blog post routes:', error);
        return [];
      }
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
