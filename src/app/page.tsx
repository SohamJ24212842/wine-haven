import { Hero } from "@/components/home/Hero";
import { HorizontalScrollSection } from "@/components/home/HorizontalScrollSection";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { getAllProducts } from "@/lib/db/products";

export default async function Home() {
  const products = await getAllProducts();
  const featuredWines = products.filter((p) => p.category === "Wine" && p.featured).slice(0, 10);
  const featuredSpirits = products.filter((p) => p.category === "Spirit" && p.featured).slice(0, 10);
  const newArrivals = products.filter((p) => p.new).slice(0, 10);
  const christmasGifts = products.filter((p) => p.christmasGift).slice(0, 10);

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
            filterUrl="category=Wine"
          />
          <SectionDivider variant="subtle" />
        </>
      )}
      {featuredSpirits.length > 0 && (
        <HorizontalScrollSection
          title="Featured Spirits"
          subtitle="Premium selection of gins, vodkas, and more"
          products={featuredSpirits}
          filterUrl="category=Spirit"
        />
      )}
    </div>
  );
}
