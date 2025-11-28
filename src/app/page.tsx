import { Hero } from "@/components/home/Hero";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { PromotionalMedia } from "@/components/home/PromotionalMedia";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { getFeaturedProducts, getNewProducts, getChristmasGifts } from "@/lib/db/products";

// Aggressive caching to reduce database load and egress
// Revalidate every 1 hour (3600 seconds) - products don't change frequently
// This significantly reduces database queries and data transfer
export const revalidate = 3600;

export default async function Home() {
  // Fetch only what we need with optimized queries
  // This reduces database load significantly
  // Use Promise.allSettled to prevent one slow query from blocking the page
  const results = await Promise.allSettled([
    getFeaturedProducts("Wine", 10),
    getFeaturedProducts("Spirit", 10),
    getNewProducts(10),
    getChristmasGifts(10),
  ]);

  // Extract results, defaulting to empty arrays if any query fails
  const featuredWines = results[0].status === 'fulfilled' ? results[0].value : [];
  const featuredSpirits = results[1].status === 'fulfilled' ? results[1].value : [];
  const newArrivals = results[2].status === 'fulfilled' ? results[2].value : [];
  const christmasGifts = results[3].status === 'fulfilled' ? results[3].value : [];

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
