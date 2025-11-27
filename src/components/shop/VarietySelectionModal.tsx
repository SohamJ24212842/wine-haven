"use client";
import { Product } from "@/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type VarietySelectionModalProps = {
	isOpen: boolean;
	onClose: () => void;
	product: Product;
	varieties: Product[];
	onSelect: (selectedProduct: Product) => void;
};

export function VarietySelectionModal({
	isOpen,
	onClose,
	product,
	varieties,
	onSelect,
}: VarietySelectionModalProps) {
	const { addItem } = useCart();
	
	// Include the current product in the list
	const allVarieties = [product, ...varieties];
	
	// Sort by volume (ascending) if available, otherwise by price
	const sortedVarieties = [...allVarieties].sort((a, b) => {
		if (a.volumeMl && b.volumeMl) {
			return a.volumeMl - b.volumeMl;
		}
		return a.price - b.price;
	});

	const handleSelect = (selectedProduct: Product) => {
		addItem(selectedProduct);
		onSelect(selectedProduct);
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
						className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
					/>
					
					{/* Bottom Sheet */}
					<motion.div
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl bg-cream shadow-2xl"
					>
						{/* Handle bar */}
						<div className="flex items-center justify-center pt-3 pb-2">
							<div className="h-1 w-12 rounded-full bg-maroon/30" />
						</div>
						
						{/* Header */}
						<div className="flex items-center justify-between border-b border-maroon/10 px-6 pb-4">
							<h2 className="text-xl font-bold text-maroon">Select Size</h2>
							<button
								onClick={onClose}
								className="rounded-full p-2 text-maroon/70 hover:bg-maroon/10 hover:text-maroon transition-colors"
								aria-label="Close"
							>
								<X size={20} />
							</button>
						</div>
						
						{/* Varieties List */}
						<div className="overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 120px)" }}>
							<div className="space-y-3">
								{sortedVarieties.map((variety) => {
									const isOnSale = variety.onSale && variety.salePrice;
									const displayPrice = isOnSale ? variety.salePrice! : variety.price;
									const originalPrice = isOnSale ? variety.price : null;
									
									return (
										<motion.button
											key={variety.slug}
											onClick={() => handleSelect(variety)}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className="w-full rounded-lg border-2 border-maroon/20 bg-white p-4 text-left transition-all hover:border-gold hover:shadow-md"
										>
											<div className="flex items-center gap-4">
												{/* Image */}
												<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-maroon/10 bg-soft-gray">
													<Image
														src={variety.image}
														alt={variety.name}
														fill
														className="object-contain p-2"
														sizes="80px"
													/>
												</div>
												
												{/* Info */}
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-maroon truncate">
														{variety.name}
													</h3>
													<div className="mt-1 flex items-center gap-2">
														{variety.volumeMl && (
															<span className="text-sm text-maroon/70">
																{variety.volumeMl}ml
															</span>
														)}
														{variety.abv && (
															<span className="text-sm text-maroon/70">
																• {variety.abv}% ABV
															</span>
														)}
													</div>
													<div className="mt-2 flex items-center gap-2">
														{isOnSale && originalPrice && (
															<span className="text-xs text-maroon/50 line-through">
																€{originalPrice.toFixed(2)}
															</span>
														)}
														<span className="text-lg font-bold text-maroon">
															€{displayPrice.toFixed(2)}
														</span>
														{isOnSale && (
															<span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
																Sale
															</span>
														)}
													</div>
												</div>
												
												{/* Add to Cart Icon */}
												<div className="flex-shrink-0">
													<div className="rounded-full bg-gold p-2">
														<ShoppingCart size={18} className="text-maroon" />
													</div>
												</div>
											</div>
										</motion.button>
									);
								})}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}






