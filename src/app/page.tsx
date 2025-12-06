import { Hero } from "@/components/home/Hero";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { PromotionalMedia } from "@/components/home/PromotionalMedia";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { getFeaturedProducts, getNewProducts, getChristmasGifts } from "@/lib/db/products";

// ISR: Revalidate every hour (3600 seconds) - products don't change frequently
// This significantly reduces database queries and data transfer
export const revalidate = 3600;

export default async function Home() {
  // Fetch only what we need with optimized queries
  // Use Promise.allSettled with timeouts to prevent one slow query from blocking the page
  // Note: Promotional media is fetched client-side to avoid bloating the static page
  // (videos/images would make the page too large for Vercel's 19MB limit)
  // Note: allProducts for variety detection is fetched client-side to keep page size under 19MB
  
  // Wrap each query with timeout to prevent hanging during build
  const createTimeoutPromise = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      )
    ]);
  };

  const results = await Promise.allSettled([
    createTimeoutPromise(getFeaturedProducts("Wine", 10), 30000).catch(() => []),
    createTimeoutPromise(getFeaturedProducts("Spirit", 10), 30000).catch(() => []),
    createTimeoutPromise(getNewProducts(10), 30000).catch(() => []),
    createTimeoutPromise(getChristmasGifts(10), 30000).catch(() => []),
  ]);

  // Extract results, defaulting to empty arrays if any query fails
  const featuredWines = results[0].status === 'fulfilled' ? results[0].value : [];
  const featuredSpirits = results[1].status === 'fulfilled' ? results[1].value : [];
  const newArrivals = results[2].status === 'fulfilled' ? results[2].value : [];
  const christmasGifts = results[3].status === 'fulfilled' ? results[3].value : [];
  
  // Don't fetch allProducts server-side - it makes the page too large (20MB+)
  // ProductCards will fetch it client-side if needed (cached API, so still fast)
  // Pass undefined to let ProductCards handle their own fetching

  return (
    <div>
      <Hero />
      <ShopByOccasion />
      <SectionDivider variant="gold" />
      {newArrivals.length > 0 && (
        <>
          <HorizontalScrollSection
            title="New Arrivals"
            subtitle="Latest additions to our collection"
            products={newArrivals}
            filterUrl="new=true"
          />
          <SectionDivider variant="subtle" />
        </>
      )}
      {christmasGifts.length > 0 && (
        <>
          <HorizontalScrollSection
            title="Christmas Gifts"
            subtitle="Perfect presents for the wine lovers in your life"
            products={christmasGifts}
            filterUrl="christmasGift=true"
          />
          <SectionDivider variant="subtle" />
        </>
      )}
      {featuredWines.length > 0 && (
        <>
          <HorizontalScrollSection
            title="Featured Wines"
            subtitle="Hand-picked favourites from our shelves"
            products={featuredWines}
            filterUrl="category=Wine&featured=true"
          />
          <SectionDivider variant="subtle" />
        </>
      )}
      {featuredSpirits.length > 0 && (
        <>
          <HorizontalScrollSection
            title="Featured Spirits"
            subtitle="Premium selection of gins, vodkas, and more"
            products={featuredSpirits}
            filterUrl="category=Spirit"
          />
          <SectionDivider variant="subtle" />
        </>
      )}
      <PromotionalMedia />
    </div>
  );
}
