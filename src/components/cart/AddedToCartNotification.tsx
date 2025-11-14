"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, CheckCircle2, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function AddedToCartNotification() {
	const { lastAddedItem, showAddedNotification, setShowAddedNotification, updateQuantity, removeItem, totalPrice } = useCart();

	// Auto-dismiss after 8 seconds
	useEffect(() => {
		if (showAddedNotification && lastAddedItem) {
			const timer = setTimeout(() => {
				setShowAddedNotification(false);
			}, 8000);
			return () => clearTimeout(timer);
		}
	}, [showAddedNotification, lastAddedItem, setShowAddedNotification]);

	if (!lastAddedItem) return null;

	const itemPrice = lastAddedItem.product.onSale && lastAddedItem.product.salePrice 
		? lastAddedItem.product.salePrice 
		: lastAddedItem.product.price;

	return (
		<AnimatePresence>
			{showAddedNotification && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-40 bg-black/20"
						onClick={() => setShowAddedNotification(false)}
					/>
					{/* Notification Sidebar */}
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex h-full flex-col">
							{/* Header */}
							<div className="flex items-center justify-between border-b border-maroon/10 p-4 bg-white">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="text-green-600" size={20} />
									<span className="text-sm font-semibold text-maroon">Added to your cart</span>
								</div>
								<button
									onClick={() => setShowAddedNotification(false)}
									className="rounded-md p-1 text-maroon/60 hover:text-maroon hover:bg-soft-gray transition-colors"
									aria-label="Close"
								>
									<X size={18} />
								</button>
							</div>

							{/* Product Details */}
							<div className="flex-1 overflow-y-auto p-6">
								<div className="space-y-4">
									{/* Product Image */}
									<div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto overflow-hidden rounded-lg border border-maroon/10 bg-white">
										<Image
											src={lastAddedItem.product.image}
											alt={lastAddedItem.product.name}
											fill
											className="object-cover"
											sizes="200px"
										/>
									</div>

									{/* Product Info */}
									<div className="text-center">
										<h3 className="text-lg font-semibold text-maroon mb-1">
											{lastAddedItem.product.name}
										</h3>
										<p className="text-sm text-maroon/70 mb-2">
											{lastAddedItem.product.category}
											{lastAddedItem.product.wineType ? ` • ${lastAddedItem.product.wineType}` : ""}
											{lastAddedItem.product.spiritType ? ` • ${lastAddedItem.product.spiritType}` : ""}
											{lastAddedItem.product.beerStyle ? ` • ${lastAddedItem.product.beerStyle}` : ""}
										</p>
										<p className="text-xs text-maroon/60 mb-4">
											{lastAddedItem.product.country}
											{lastAddedItem.product.region ? ` • ${lastAddedItem.product.region}` : ""}
										</p>

										{/* Price */}
										<div className="mb-4">
											{lastAddedItem.product.onSale && lastAddedItem.product.salePrice ? (
												<div className="flex items-center justify-center gap-2">
													<span className="text-xl font-semibold text-red-600">
														€{itemPrice.toFixed(2)}
													</span>
													<span className="text-sm text-maroon/50 line-through">
														€{lastAddedItem.product.price.toFixed(2)}
													</span>
												</div>
											) : (
												<span className="text-xl font-semibold text-maroon">
													€{itemPrice.toFixed(2)}
												</span>
											)}
										</div>

										{/* Quantity Selector */}
										<div className="flex items-center justify-center gap-3 mb-6">
											<button
												onClick={() => updateQuantity(lastAddedItem.product.slug, lastAddedItem.quantity - 1)}
												className="rounded-md border border-maroon/20 bg-white px-3 py-2 text-maroon hover:bg-soft-gray transition-colors"
											>
												<Minus size={16} />
											</button>
											<span className="text-lg font-semibold text-maroon w-12 text-center">
												{lastAddedItem.quantity}
											</span>
											<button
												onClick={() => updateQuantity(lastAddedItem.product.slug, lastAddedItem.quantity + 1)}
												className="rounded-md border border-maroon/20 bg-white px-3 py-2 text-maroon hover:bg-soft-gray transition-colors"
											>
												<Plus size={16} />
											</button>
										</div>

										{/* Remove Link */}
										<button
											onClick={() => {
												removeItem(lastAddedItem.product.slug);
												setShowAddedNotification(false);
											}}
											className="text-sm text-maroon/60 underline hover:text-maroon transition-colors"
										>
											Remove
										</button>
									</div>
								</div>
							</div>

							{/* Footer Actions */}
							<div className="border-t border-maroon/10 p-4 bg-white space-y-3">
								<div className="flex items-center justify-between">
									<span className="text-sm font-semibold text-maroon">Total:</span>
									<span className="text-lg font-semibold text-maroon">€{totalPrice.toFixed(2)}</span>
								</div>
								<Link
									href="/checkout"
									onClick={() => setShowAddedNotification(false)}
									className="flex items-center justify-center gap-2 w-full rounded-md bg-maroon px-4 py-3 text-sm font-semibold text-white hover:bg-maroon/90 transition-colors"
								>
									<Lock size={16} />
									Go To Checkout
								</Link>
								<button
									onClick={() => setShowAddedNotification(false)}
									className="w-full rounded-md border border-maroon/20 bg-white px-4 py-2 text-center text-sm font-semibold text-maroon hover:bg-soft-gray transition-colors"
								>
									Continue Shopping
								</button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}



