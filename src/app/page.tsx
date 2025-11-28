import { Hero } from "@/components/home/Hero";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { PromotionalMedia } from "@/components/home/PromotionalMedia";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { getFeaturedProducts, getNewProducts, getChristmasGifts } from "@/lib/db/products";

// Enable caching to reduce database load
// Revalidate every 5 minutes (300 seconds) - products don't change that frequently
export const revalidate = 300;

export default async function Home() {
  // Fetch only what we need with optimized queries
  // This reduces database load significantly
  const [featuredWines, featuredSpirits, newArrivals, christmasGifts] = await Promise.all([
    getFeaturedProducts("Wine", 10),
    getFeaturedProducts("Spirit", 10),
    getNewProducts(10),
    getChristmasGifts(10),
  ]);

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
