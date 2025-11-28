"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wine, UtensilsCrossed, Sparkles } from "lucide-react";
import { hasMultipleVarietiesEnhanced, findProductVarietiesEnhanced } from "@/lib/utils/varieties";

type ProductDetailClientProps = {
	product: Product;
	discountPercentage: number | null;
	allProducts?: Product[]; // Passed from server to avoid client-side fetch
};

export function ProductDetailClient({ product, discountPercentage, allProducts: serverProducts }: ProductDetailClientProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const images =
		product.images && product.images.length
			? [product.image, ...product.images.filter((u) => u !== product.image)]
			: [product.image];
	const [zoom, setZoom] = useState(false);
	const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
	const lastUpdateRef = useRef<number | null>(null);
	
	// Use server-provided products or fetch on client as fallback
	const [clientProducts, setClientProducts] = useState<Product[]>(serverProducts || []);
	
	useEffect(() => {
		// Only fetch if server didn't provide products
		if (!serverProducts || serverProducts.length === 0) {
			fetch('/api/products')
				.then(r => r.json())
				.then(data => {
					const productsArray = Array.isArray(data) ? data : (data.products || []);
					setClientProducts(productsArray);
				})
				.catch(() => {
					// Silently fail, keep empty array
				});
		}
	}, [serverProducts]);
	
	const allProducts = (serverProducts && serverProducts.length > 0) ? serverProducts : clientProducts;
	
	// Memoize variety detection to avoid recalculating on every render
	const { hasVarieties, varieties, sortedVarieties } = useMemo(() => {
		if (allProducts.length === 0) {
			return { hasVarieties: false, varieties: [], sortedVarieties: [product] };
		}
		const has = hasMultipleVarietiesEnhanced(product, allProducts);
		const vars = has ? findProductVarietiesEnhanced(product, allProducts) : [];
		const allVars = has ? [product, ...vars] : [product];
		const sorted = [...allVars].sort((a, b) => {
			if (a.volumeMl && b.volumeMl) {
				return a.volumeMl - b.volumeMl;
			}
			return a.price - b.price;
		});
		return { hasVarieties: has, varieties: vars, sortedVarieties: sorted };
	}, [product, allProducts]);

	// Prevent page scroll when zoomed
	useEffect(() => {
		if (zoom) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [zoom]);

	// Optimized zoom origin update using requestAnimationFrame for smooth performance
	const updateZoomOrigin = useCallback((x: number, y: number) => {
		if (lastUpdateRef.current) {
			cancelAnimationFrame(lastUpdateRef.current);
		}
		lastUpdateRef.current = requestAnimationFrame(() => {
			setZoomOrigin({ x, y });
		});
	}, []);

	return (
		<Container className="py-12">
			<SectionHeading>{product.name}</SectionHeading>
			<div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Sticky Image Gallery */}
				<div className="lg:sticky lg:top-24 lg:self-start">
					<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white shadow-lg flex items-center justify-center">
						{/* Badges - Top Left */}
						<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
							{product.onSale && discountPercentage && (
								<motion.span
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide"
								>
									-{discountPercentage}%
								</motion.span>
							)}
							{product.new && !product.christmasGift && (
								<motion.span
									initial={{ scale: 0, rotate: -12 }}
									animate={{ scale: 1, rotate: -12 }}
									className="rounded-md bg-gold px-3 py-1.5 text-sm font-bold text-maroon shadow-lg uppercase tracking-wide border-2 border-maroon/20"
								>
									NEW
								</motion.span>
							)}
							{product.christmasGift && (
								<motion.span
									initial={{ scale: 0, rotate: 12 }}
									animate={{ scale: 1, rotate: 12 }}
									className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide border-2 border-white/20"
								>
									🎁 GIFT
								</motion.span>
							)}
						</div>
						
						{/* Premium floating shadow */}
						<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
						
						{/* Main Image with smooth fade */}
						<AnimatePresence mode="wait">
							<motion.div
								key={selectedImage}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="absolute inset-0"
							>
								<Image
									src={images[selectedImage]}
									alt={product.name}
									fill
									className={`object-contain p-6 transition-transform duration-200 ${
										zoom ? "cursor-zoom-out" : "cursor-zoom-in"
									}`}
									style={
										zoom
											? {
													transform: "scale(1.8)",
													transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
											  }
											: undefined
									}
									onClick={() => setZoom((z) => !z)}
									onMouseMove={(e: React.MouseEvent<HTMLImageElement>) => {
										if (!zoom) return;
										e.preventDefault();
										e.stopPropagation();
										const rect = e.currentTarget.getBoundingClientRect();
										const x = ((e.clientX - rect.left) / rect.width) * 100;
										const y = ((e.clientY - rect.top) / rect.height) * 100;
										updateZoomOrigin(x, y);
									}}
									onTouchMove={(e: React.TouchEvent<HTMLImageElement>) => {
										if (!zoom || e.touches.length === 0) return;
										e.preventDefault();
										e.stopPropagation();
										const touch = e.touches[0];
										const rect = e.currentTarget.getBoundingClientRect();
										const x = ((touch.clientX - rect.left) / rect.width) * 100;
										const y = ((touch.clientY - rect.top) / rect.height) * 100;
										updateZoomOrigin(x, y);
									}}
									sizes="(max-width: 768px) 100vw, 50vw"
									priority
								/>
							</motion.div>
						</AnimatePresence>
						{images.length > 1 && (
							<>
								<button
									type="button"
									aria-label="Previous"
									onClick={() => {
										setSelectedImage((i) => (i - 1 + images.length) % images.length);
										setZoom(false);
									}}
									className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 border border-maroon/20 p-1 text-maroon hover:bg-white"
								>
									‹
								</button>
								<button
									type="button"
									aria-label="Next"
									onClick={() => {
										setSelectedImage((i) => (i + 1) % images.length);
										setZoom(false);
									}}
									className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 border border-maroon/20 p-1 text-maroon hover:bg-white"
								>
									›
								</button>
							</>
						)}
					</div>
					
					{/* Thumbnail Gallery */}
					{images.length > 1 && (
						<div className="mt-4 flex gap-2 overflow-x-auto pb-2">
							{images.map((img, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
										selectedImage === index
											? "border-gold shadow-md"
											: "border-maroon/20 hover:border-maroon/40"
									}`}
								>
									<Image
										src={img}
										alt={`${product.name} view ${index + 1}`}
										fill
										className="object-contain p-1"
										sizes="80px"
									/>
								</button>
							))}
						</div>
					)}
				</div>
				
				{/* Product Info */}
				<div>
					<p className="text-sm text-maroon/70">
						{product.category}
						{product.wineType ? ` • ${product.wineType}` : ""}
						{product.spiritType ? ` • ${product.spiritType}` : ""}
						{product.beerStyle ? ` • ${product.beerStyle}` : ""}
						{product.country ? ` • ${product.country}` : ""}
						{product.region ? ` • ${product.region}` : ""}
					</p>
					<div className="mt-4 flex items-center gap-3 flex-wrap">
						{product.onSale && product.salePrice ? (
							<>
								<span className="text-3xl font-bold text-red-600">€{product.salePrice.toFixed(2)}</span>
								<span className="text-xl text-maroon/50 line-through">€{product.price.toFixed(2)}</span>
								{discountPercentage && (
									<span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
										-{discountPercentage}% OFF
									</span>
								)}
								<span className="text-base font-semibold text-red-600">
									Save €{(product.price - product.salePrice).toFixed(2)}
								</span>
							</>
						) : (
							<span className="text-3xl font-bold text-maroon">€{product.price.toFixed(2)}</span>
						)}
					</div>
					
					
					<div className="mt-4 flex items-center gap-4 text-sm text-maroon/70">
						{product.abv != null && (
							<p>
								<strong>ABV:</strong> {product.abv}%
							</p>
						)}
						{product.volumeMl && (
							<p>
								<strong>Volume:</strong> {product.volumeMl} ml
							</p>
						)}
					</div>
					
					<p className="mt-6 text-maroon/90 leading-relaxed text-lg whitespace-pre-line">
						{product.description}
					</p>
					
					{/* Show related products at bottom if available */}
					{hasVarieties && sortedVarieties.length > 1 && (
						<div className="mt-6 pt-6 border-t border-maroon/10">
							<p className="text-sm font-semibold text-maroon mb-3">Also available:</p>
							<div className="flex flex-wrap gap-2">
								{sortedVarieties
									.filter(v => v.slug !== product.slug)
									.slice(0, 4) // Show max 4 related products
									.map((variety) => (
										<Link
											key={variety.slug}
											href={`/product/${variety.slug}`}
											className="text-sm text-maroon/70 hover:text-maroon hover:underline"
										>
											{variety.name}
										</Link>
									))}
								{sortedVarieties.length > 5 && (
									<span className="text-sm text-maroon/60">
										— prices may differ
									</span>
								)}
							</div>
						</div>
					)}
					
					{/* Producer / Tasting info */}
					{(product.producer || product.tasteProfile || product.foodPairing) && (
						<div className="mt-8 grid gap-6 pt-6 border-t border-maroon/10 sm:grid-cols-2 lg:grid-cols-3">
							{product.producer && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<Sparkles className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Producer</span>
									</div>
									<p className="text-sm text-maroon/80">{product.producer}</p>
								</div>
							)}
							{product.tasteProfile && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<Wine className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Tastes</span>
									</div>
									<p className="text-sm text-maroon/80 whitespace-pre-line">
										{product.tasteProfile}
									</p>
								</div>
							)}
							{product.foodPairing && (
								<div>
									<div className="flex items-center gap-2 text-maroon/80 mb-1">
										<UtensilsCrossed className="w-5 h-5 text-gold" />
										<span className="text-sm font-semibold">Food pairing</span>
									</div>
									<p className="text-sm text-maroon/80 whitespace-pre-line">
										{product.foodPairing}
									</p>
								</div>
							)}
						</div>
					)}
					
					<div className="mt-8">
						<AddToCartButton product={product} variant="large" allProducts={allProducts} />
					</div>
				</div>
			</div>
		</Container>
	);
}

