"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";

export function CartTray() {
	const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

	return (
		<>
			{/* Click and Collect Button */}
			<Link
				href="/checkout"
				className="relative inline-flex items-center gap-2 rounded-md bg-maroon px-4 py-2 text-sm text-white hover:bg-maroon/90 transition-colors font-medium"
			>
				<ShoppingBag size={18} />
				<span className="hidden sm:inline">Click & Collect</span>
				{totalItems > 0 && (
					<span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-semibold text-maroon">
						{totalItems}
					</span>
				)}
			</Link>

			{/* Cart Tray */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 bg-black/50"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className="fixed right-0 top-0 z-[100] h-full w-full max-w-md bg-cream shadow-xl overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex h-full flex-col">
								<div className="flex items-center justify-between border-b border-maroon/10 p-4 bg-white">
									<h2 className="text-lg font-semibold text-maroon">Shopping Cart</h2>
									<button
										onClick={() => setIsOpen(false)}
										className="rounded-md p-1 text-maroon hover:bg-soft-gray transition-colors"
										aria-label="Close cart"
									>
										<X size={20} />
									</button>
								</div>

								<div className="flex-1 overflow-y-auto p-4 relative">
									{/* Fade gradient at bottom */}
									<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent pointer-events-none z-10" />
									{items.length === 0 ? (
										<div className="flex h-full items-center justify-center text-center text-maroon/60">
											<div>
												<ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
												<p>Your cart is empty</p>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											{items.map((item) => (
												<div
													key={item.product.slug}
													className="flex gap-4 rounded-lg border border-maroon/10 bg-white p-3"
												>
													<div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded">
														<Image
															src={item.product.image}
															alt={item.product.name}
															fill
															className="object-cover"
															sizes="64px"
														/>
													</div>
													<div className="flex-1">
														<h3 className="text-sm font-medium text-maroon">{item.product.name}</h3>
														<p className="text-xs text-maroon/70">{item.product.category}</p>
														<div className="mt-2 flex items-center justify-between">
															<div className="flex items-center gap-2">
																<button
																	onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
																	className="rounded border border-maroon/20 p-1 hover:bg-soft-gray"
																>
																	<Minus size={14} />
																</button>
																<span className="text-sm text-maroon">{item.quantity}</span>
																<button
																	onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
																	className="rounded border border-maroon/20 p-1 hover:bg-soft-gray"
																>
																	<Plus size={14} />
																</button>
															</div>
															<div className="text-right">
														{item.product.onSale && item.product.salePrice ? (
															<>
																<p className="text-sm font-semibold text-red-600">
																	€{(item.product.salePrice * item.quantity).toFixed(2)}
																</p>
																<p className="text-xs text-maroon/50 line-through">
																	€{(item.product.price * item.quantity).toFixed(2)}
																</p>
															</>
														) : (
															<p className="text-sm font-semibold text-maroon">
																€{(item.product.price * item.quantity).toFixed(2)}
															</p>
														)}
													</div>
														</div>
													</div>
													<button
														onClick={() => removeItem(item.product.slug)}
														className="self-start rounded p-1 text-maroon/60 hover:text-maroon"
													>
														<X size={16} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								{items.length > 0 && (
									<div className="border-t border-maroon/10 p-4 bg-white">
										<div className="mb-4 flex items-center justify-between">
											<span className="text-lg font-semibold text-maroon">Total</span>
											<span className="text-lg font-semibold text-maroon">€{totalPrice.toFixed(2)}</span>
										</div>
										<div className="space-y-2">
											<Link
												href="/checkout"
												onClick={() => setIsOpen(false)}
												className="block w-full rounded-md bg-maroon px-4 py-3 text-center text-sm font-semibold text-white hover:bg-maroon/90 transition-colors"
											>
												Proceed to Collection
											</Link>
											<button
												onClick={() => setIsOpen(false)}
												className="w-full rounded-md border border-maroon/20 bg-white px-4 py-2 text-center text-sm font-semibold text-maroon hover:bg-soft-gray transition-colors"
											>
												Continue Shopping
											</button>
										</div>
									</div>
								)}
								{items.length === 0 && (
									<div className="border-t border-maroon/10 p-4 bg-white">
										<button
											onClick={() => setIsOpen(false)}
											className="w-full rounded-md border border-maroon/20 bg-white px-4 py-2 text-center text-sm font-semibold text-maroon hover:bg-soft-gray transition-colors"
										>
											Continue Shopping
										</button>
									</div>
								)}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}

