"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";

type CartItem = {
	product: Product;
	quantity: number;
};

type CartContextType = {
	items: CartItem[];
	addItem: (product: Product) => void;
	removeItem: (slug: string) => void;
	updateQuantity: (slug: string, quantity: number) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	lastAddedItem: CartItem | null;
	showAddedNotification: boolean;
	setShowAddedNotification: (show: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
	const [showAddedNotification, setShowAddedNotification] = useState(false);

	const addItem = (product: Product) => {
		let newItem: CartItem | null = null;
		setItems((prev) => {
			const existing = prev.find((item) => item.product.slug === product.slug);
			if (existing) {
				newItem = { ...existing, quantity: existing.quantity + 1 };
				return prev.map((item) =>
					item.product.slug === product.slug ? newItem! : item
				);
			}
			newItem = { product, quantity: 1 };
			return [...prev, newItem];
		});
		// Show the "Added to Cart" notification
		if (newItem) {
			setLastAddedItem(newItem);
			setShowAddedNotification(true);
		}
	};

	const removeItem = (slug: string) => {
		setItems((prev) => prev.filter((item) => item.product.slug !== slug));
	};

	const updateQuantity = (slug: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(slug);
			return;
		}
		setItems((prev) => {
			const updated = prev.map((item) =>
				item.product.slug === slug ? { ...item, quantity } : item
			);
			// Update lastAddedItem if it's the same product
			if (lastAddedItem?.product.slug === slug) {
				const updatedItem = updated.find((item) => item.product.slug === slug);
				if (updatedItem) {
					setLastAddedItem(updatedItem);
				}
			}
			return updated;
		});
	};

	const clearCart = () => {
		setItems([]);
	};

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = items.reduce((sum, item) => {
		const price = item.product.onSale && item.product.salePrice 
			? item.product.salePrice 
			: item.product.price;
		return sum + price * item.quantity;
	}, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				totalItems,
				totalPrice,
				isOpen,
				setIsOpen,
				lastAddedItem,
				showAddedNotification,
				setShowAddedNotification,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within CartProvider");
	}
	return context;
}

