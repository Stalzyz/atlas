import { MetadataRoute } from 'next';
import { API_URL } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://raaghas.in';
  
  // Base routes
  const staticRoutes = [
    '',
    '/about',
    '/collections/all',
    '/collections/new-arrivals',
    '/collections/bestsellers',
    '/pages/shipping',
    '/pages/returns',
    '/pages/size-guide',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch dynamic products
    const res = await fetch(`${API_URL}/products?status=ACTIVE&limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const { items } = await res.json();
      const productRoutes = items.map((product: any) => ({
        url: `${baseUrl}/products/${product.handle}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      }));
      return [...staticRoutes, ...productRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap for products:', error);
  }

  return staticRoutes;
}
