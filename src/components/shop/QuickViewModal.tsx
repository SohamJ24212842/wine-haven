"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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

	if (!product) return null;

	const discountPercentage = product.onSale && product.salePrice 
		? calculateDiscountPercentage(product.price, product.salePrice)
		: null;

	const handleAddToCart = () => {
		// Add the product with the specified quantity
		for (let i = 0; i < quantity; i++) {
			addItem(product);
		}
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
								{/* Product Image */}
								<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white">
									{/* Badges */}
									<div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
										{product.onSale && discountPercentage && (
											<span className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-bold text-white shadow-lg uppercase tracking-wide">
												-{discountPercentage}%
											</span>
										)}
										{product.new && (
											<span className="rounded-md bg-gold px-3 py-1.5 text-sm font-bold text-maroon shadow-lg uppercase tracking-wide">
												NEW
											</span>
										)}
									</div>
									<Image
										src={product.image}
										alt={product.name}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 100vw, 50vw"
										priority
									/>
								</div>

								{/* Product Details */}
								<div className="flex flex-col">
									<h2 className="text-2xl font-semibold text-maroon mb-2">{product.name}</h2>
									<p className="text-sm text-maroon/70 mb-4">
										{product.category}
										{product.wineType ? ` • ${product.wineType}` : ""}
										{product.spiritType ? ` • ${product.spiritType}` : ""}
										{product.beerStyle ? ` • ${product.beerStyle}` : ""} • {product.country}
										{product.region ? ` • ${product.region}` : ""}
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
											</div>
										) : (
											<span className="text-3xl font-semibold text-maroon">€{product.price.toFixed(2)}</span>
										)}
									</div>

									{/* Product Details */}
									{product.abv != null && (
										<p className="text-sm text-maroon/70 mb-2">ABV: {product.abv}%</p>
									)}
									{product.volumeMl && (
										<p className="text-sm text-maroon/70 mb-4">Volume: {product.volumeMl} ml</p>
									)}

									{/* Description */}
									{product.description && (
										<p className="text-maroon/90 leading-relaxed mb-6">{product.description}</p>
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
		</AnimatePresence>
	);
}

