"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart, Wine, UtensilsCrossed, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAllProducts } from "@/hooks/useAllProducts";
import { hasMultipleVarietiesEnhanced, findProductVarietiesEnhanced } from "@/lib/utils/varieties";
import { VarietySelectionModal } from "./VarietySelectionModal";

type QuickViewModalProps = {
	product: Product | null;
	isOpen: boolean;
	onClose: () => void;
};

function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
	return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
	const { addItem } = useCart();
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(0);
	const [zoom, setZoom] = useState(false);
	const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
	const lastUpdateRef = useRef<number>(0);
	const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
	const [showVarietyModal, setShowVarietyModal] = useState(false);
	const allProducts = useAllProducts();

	// Detect mobile/tablet
	useEffect(() => {
		const checkDevice = () => {
			setIsMobileOrTablet(window.innerWidth < 1024); // lg breakpoint
		};
		checkDevice();
		window.addEventListener("resize", checkDevice);
		return () => window.removeEventListener("resize", checkDevice);
	}, []);

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

	// Throttled zoom origin update to prevent INP issues
	const updateZoomOrigin = useCallback((x: number, y: number) => {
		const now = Date.now();
		if (now - lastUpdateRef.current < 16) return; // ~60fps throttling
		lastUpdateRef.current = now;
		setZoomOrigin({ x, y });
	}, []);

	if (!product) return null;

	const hasVarieties = hasMultipleVarietiesEnhanced(product, allProducts);
	const varieties = hasVarieties ? findProductVarietiesEnhanced(product, allProducts) : [];

	const discountPercentage = product.onSale && product.salePrice 
		? calculateDiscountPercentage(product.price, product.salePrice)
		: null;

	const images =
		product.images && product.images.length
			? [product.image, ...product.images.filter((u) => u !== product.image)]
			: [product.image];

	const handleAddToCart = () => {
		// If product has multiple varieties, show modal instead
		if (hasVarieties) {
			setShowVarietyModal(true);
			return;
		}
		
		// Otherwise, add the product with the specified quantity
		for (let i = 0; i < quantity; i++) {
			addItem(product);
		}
		onClose();
	};
	
	const handleVarietySelected = (selectedProduct: Product) => {
		// Product is already added in the modal
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-50 bg-black/50"
					/>
					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							onClick={(e) => e.stopPropagation()}
							className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-cream rounded-lg border border-maroon/20 shadow-xl"
						>
							{/* Close Button */}
							<button
								onClick={onClose}
								className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-maroon hover:bg-white transition-colors shadow-md"
							>
								<X size={20} />
							</button>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
								{/* Product Image with zoom + arrows (no thumbnail strip) */}
								<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white flex items-center justify-center">
									{/* Badges */}
									<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
										{product.onSale && discountPercentage && (
											<span className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide">
												-{discountPercentage}%
											</span>
										)}
										{product.new && !product.christmasGift && (
											<span className="rounded-md bg-gold px-3 py-1.5 text-sm font-bold text-maroon shadow-lg uppercase tracking-wide">
												NEW
											</span>
										)}
										{product.christmasGift && (
											<span className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide">
												🎁 GIFT
											</span>
										)}
									</div>
									<div className="absolute inset-0">
										<Image
											src={images[selectedImage]}
											alt={product.name}
											fill
											className={`object-contain p-4 transition-transform duration-200 ${
												!isMobileOrTablet && zoom ? "cursor-zoom-out" : !isMobileOrTablet ? "cursor-zoom-in" : ""
											}`}
											style={
												!isMobileOrTablet && zoom
													? {
															transform: "scale(1.8)",
															transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
													  }
													: undefined
											}
											onClick={() => {
												if (!isMobileOrTablet) {
													setZoom((z) => !z);
												}
											}}
											onMouseMove={!isMobileOrTablet ? (e: React.MouseEvent<HTMLImageElement>) => {
												if (!zoom) return;
												e.preventDefault();
												e.stopPropagation();
												const rect = (e.currentTarget as HTMLImageElement).getBoundingClientRect();
												const x = ((e.clientX - rect.left) / rect.width) * 100;
												const y = ((e.clientY - rect.top) / rect.height) * 100;
												updateZoomOrigin(x, y);
											} : undefined}
											sizes="(max-width: 768px) 100vw, 50vw"
											priority
										/>
									</div>
									{images.length > 1 && (
										<>
											<button
												type="button"
												aria-label="Previous image"
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
												aria-label="Next image"
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

								{/* Product Details (side-by-side as before) */}
								<div className="flex flex-col">
									<h2 className="text-2xl font-semibold text-maroon mb-2">{product.name}</h2>
									<p className="text-sm text-maroon/70 mb-4">
										{product.category}
										{product.wineType ? ` • ${product.wineType}` : ""}
										{product.spiritType ? ` • ${product.spiritType}` : ""}
										{product.beerStyle ? ` • ${product.beerStyle}` : ""} • {product.country}
										{product.region ? ` • ${product.region}` : ""}
										{product.volumeMl ? ` • ${product.volumeMl}ml` : ""}
									</p>

									{/* Price */}
									<div className="mb-6">
										{product.onSale && product.salePrice ? (
											<div className="flex items-center gap-3 flex-wrap">
												<span className="text-3xl font-semibold text-red-600">€{product.salePrice.toFixed(2)}</span>
												<span className="text-lg text-maroon/50 line-through">€{product.price.toFixed(2)}</span>
												{discountPercentage && (
													<span className="rounded-md bg-red-100 px-2 py-1 text-sm font-bold text-red-700">
														-{discountPercentage}% OFF
													</span>
												)}
												<span className="text-base font-semibold text-red-600">
													Save €{(product.price - product.salePrice).toFixed(2)}
												</span>
											</div>
										) : (
											<span className="text-3xl font-semibold text-maroon">€{product.price.toFixed(2)}</span>
										)}
									</div>

									{/* Product Details */}
									<div className="mb-6 flex items-center gap-4 text-sm text-maroon/70">
										{product.abv != null && (
											<p>ABV: {product.abv}%</p>
										)}
										{product.volumeMl && (
											<p>Volume: {product.volumeMl} ml</p>
										)}
									</div>

									{/* Basic profiles */}
									{(product.producer || product.tasteProfile || product.foodPairing) && (
										<div className="mb-6 space-y-1 text-sm text-maroon/90">
											{product.producer && (
												<p className="flex items-start gap-2">
													<Sparkles className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
													<span>
														<span className="font-semibold">Producer:</span> {product.producer}
													</span>
												</p>
											)}
											{product.tasteProfile && (
												<p className="flex items-start gap-2 whitespace-pre-line">
													<Wine className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
													<span>
														<span className="font-semibold">Tastes:</span> {product.tasteProfile}
													</span>
												</p>
											)}
											{product.foodPairing && (
												<p className="flex items-start gap-2 whitespace-pre-line">
													<UtensilsCrossed className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
													<span>
														<span className="font-semibold">Food pairing:</span> {product.foodPairing}
													</span>
												</p>
											)}
										</div>
									)}

									{/* Quantity Selector */}
									<div className="mb-6">
										<label className="block text-sm font-medium text-maroon mb-2">Quantity *</label>
										<div className="flex items-center gap-3">
											<button
												type="button"
												onClick={() => setQuantity((q) => Math.max(1, q - 1))}
												className="rounded-md border border-maroon/20 bg-white px-3 py-2 text-maroon hover:bg-soft-gray transition-colors"
											>
												-
											</button>
											<input
												type="number"
												min="1"
												value={quantity}
												onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
												className="w-20 rounded-md border border-maroon/20 bg-white px-3 py-2 text-center text-sm outline-none focus:border-gold"
											/>
											<button
												type="button"
												onClick={() => setQuantity((q) => q + 1)}
												className="rounded-md border border-maroon/20 bg-white px-3 py-2 text-maroon hover:bg-soft-gray transition-colors"
											>
												+
											</button>
										</div>
									</div>

									{/* Add to Cart Button */}
									<button
										onClick={handleAddToCart}
										className="flex items-center justify-center gap-2 rounded-md bg-maroon px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-maroon/90 transition-colors mb-4"
									>
										<ShoppingCart size={18} />
										Add to Cart
									</button>

									{/* View More Details Link */}
									<Link
										href={`/product/${product.slug}`}
										onClick={onClose}
										className="text-center text-sm text-maroon/70 hover:text-maroon underline transition-colors"
									>
										View More Details
									</Link>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
			{product && (
				<VarietySelectionModal
					isOpen={showVarietyModal}
					onClose={() => setShowVarietyModal(false)}
					product={product}
					varieties={varieties}
					onSelect={handleVarietySelected}
				/>
			)}
		</AnimatePresence>
	);
}

