"use client";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { hasMultipleVarietiesEnhanced, findProductVarietiesEnhanced } from "@/lib/utils/varieties";
import { VarietySelectionModal } from "./VarietySelectionModal";
import { useMemo } from "react";

type AddToCartButtonProps = {
	product: Product;
	variant?: "default" | "large";
	allProducts?: Product[]; // Pass from parent to avoid multiple API calls
};

export function AddToCartButton({ product, variant = "default", allProducts = [] }: AddToCartButtonProps) {
	const { addItem } = useCart();
	const [quantity, setQuantity] = useState(1);
	const [added, setAdded] = useState(false);
	const [showVarietyModal, setShowVarietyModal] = useState(false);
	
	// Memoize variety detection to avoid recalculating on every render
	const { hasVarieties, varieties } = useMemo(() => {
		if (allProducts.length === 0) {
			return { hasVarieties: false, varieties: [] };
		}
		const has = hasMultipleVarietiesEnhanced(product, allProducts);
		const vars = has ? findProductVarietiesEnhanced(product, allProducts) : [];
		return { hasVarieties: has, varieties: vars };
	}, [product, allProducts]);

	const handleAddToCart = () => {
		// If product has multiple varieties, show modal instead
		if (hasVarieties) {
			setShowVarietyModal(true);
			return;
		}
		
		// Otherwise, add directly to cart
		for (let i = 0; i < quantity; i++) {
			addItem(product);
		}
		setAdded(true);
		setTimeout(() => setAdded(false), 2000);
	};

	const handleVarietySelected = (selectedProduct: Product) => {
		// Product is already added in the modal, just show feedback
		setAdded(true);
		setTimeout(() => setAdded(false), 2000);
	};

	if (variant === "large") {
		return (
			<>
				<div className="mt-8">
					<div className="mb-4 flex items-center gap-3">
						<button
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
							onClick={() => setQuantity((q) => q + 1)}
							className="rounded-md border border-maroon/20 bg-white px-3 py-2 text-maroon hover:bg-soft-gray transition-colors"
						>
							+
						</button>
					</div>
					<button
						onClick={handleAddToCart}
						className="inline-flex items-center gap-2 rounded-md bg-maroon px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-maroon/90"
					>
						<ShoppingCart size={18} />
						{added ? "Added to Cart!" : "Add to Cart"}
					</button>
				</div>
				<VarietySelectionModal
					isOpen={showVarietyModal}
					onClose={() => setShowVarietyModal(false)}
					product={product}
					varieties={varieties}
					onSelect={handleVarietySelected}
				/>
			</>
		);
	}

	return (
		<>
			<button
				onClick={handleAddToCart}
				className="inline-flex items-center rounded-md border border-maroon/20 bg-white px-6 py-3 text-sm font-semibold text-maroon shadow-sm transition hover:bg-soft-gray"
			>
				{added ? "Added!" : "Add to Cart"}
			</button>
			<VarietySelectionModal
				isOpen={showVarietyModal}
				onClose={() => setShowVarietyModal(false)}
				product={product}
				varieties={varieties}
				onSelect={handleVarietySelected}
			/>
		</>
	);
}



