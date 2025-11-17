"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Minus, X, MapPin, Phone, Mail } from "lucide-react";

export default function CheckoutPage() {
	const router = useRouter();
	const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		collectionDate: "",
		collectionTime: "",
		notes: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (items.length === 0) {
			alert("Your cart is empty");
			return;
		}

		setIsSubmitting(true);

		try {
			const orderData = {
				customer_name: formData.name,
				customer_email: formData.email,
				customer_phone: formData.phone,
				collection_date: formData.collectionDate,
				collection_time: formData.collectionTime,
				notes: formData.notes,
				items: items.map((item) => ({
					product_slug: item.product.slug,
					product_name: item.product.name,
					product_price: item.product.onSale && item.product.salePrice 
						? item.product.salePrice 
						: item.product.price,
					quantity: item.quantity,
					subtotal: (item.product.onSale && item.product.salePrice 
						? item.product.salePrice 
						: item.product.price) * item.quantity,
				})),
				subtotal: totalPrice,
				total: totalPrice,
			};

			const response = await fetch("/api/orders", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(orderData),
			});

			if (response.ok) {
				const result = await response.json();
				clearCart();
				router.push(`/order-confirmation?orderId=${result.orderId}`);
			} else {
				const error = await response.json();
				alert(`Failed to submit order: ${error.error || "Unknown error"}`);
			}
		} catch (error: any) {
			console.error("Error submitting order:", error);
			alert("Failed to submit order. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (items.length === 0) {
		return (
			<Container className="py-12">
				<SectionHeading>Your Cart is Empty</SectionHeading>
				<p className="mt-4 text-center text-maroon/70">
					Add some products to your cart to proceed with collection.
				</p>
				<div className="mt-8 text-center">
					<a
						href="/shop"
						className="inline-block rounded-md bg-gold px-6 py-3 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
					>
						Continue Shopping
					</a>
				</div>
			</Container>
		);
	}

	return (
		<Container className="py-12">
			<SectionHeading subtitle="Review your order and provide collection details">
				Click & Collect
			</SectionHeading>

			<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
				{/* Order Summary */}
				<div className="lg:col-span-2">
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<h2 className="text-lg font-semibold text-maroon mb-4">Order Summary</h2>
						<div className="space-y-4">
							{items.map((item) => {
								const itemPrice = item.product.onSale && item.product.salePrice 
									? item.product.salePrice 
									: item.product.price;
								return (
									<div
										key={item.product.slug}
										className="flex gap-4 rounded-lg border border-maroon/10 p-4"
									>
										<div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded">
											<Image
												src={item.product.image}
												alt={item.product.name}
												fill
												className="object-cover"
												sizes="80px"
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
													<span className="text-sm text-maroon w-8 text-center">{item.quantity}</span>
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
																€{(itemPrice * item.quantity).toFixed(2)}
															</p>
															<p className="text-xs text-maroon/50 line-through">
																€{(item.product.price * item.quantity).toFixed(2)}
															</p>
														</>
													) : (
														<p className="text-sm font-semibold text-maroon">
															€{(itemPrice * item.quantity).toFixed(2)}
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
								);
							})}
						</div>
						<div className="mt-6 border-t border-maroon/10 pt-4">
							<div className="flex items-center justify-between">
								<span className="text-lg font-semibold text-maroon">Total</span>
								<span className="text-xl font-semibold text-maroon">€{totalPrice.toFixed(2)}</span>
							</div>
						</div>
					</div>
				</div>

				{/* Collection Form */}
				<div className="lg:col-span-1">
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<h2 className="text-lg font-semibold text-maroon mb-4">Collection Details</h2>
						
						{/* Store Info */}
						<div className="mb-6 rounded-lg bg-soft-gray p-4">
							<div className="flex items-start gap-3 mb-3">
								<MapPin className="text-gold mt-1" size={18} />
								<div className="text-sm text-maroon/80">
									<p className="font-medium mb-1">Collection Address</p>
									<p>
										47, George's Street Upper<br />
										Dún Laoghaire, Dublin<br />
										A96 K2H2
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Phone className="text-gold mt-1" size={18} />
								<div className="text-sm text-maroon/80">
									<p className="font-medium mb-1">Contact</p>
									<p>
										<a href="tel:+3538954581875" className="hover:text-gold">+353 89 4581875</a>
									</p>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Full Name *
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Email *
								</label>
								<input
									type="email"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Phone Number *
								</label>
								<input
									type="tel"
									value={formData.phone}
									onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Preferred Collection Date *
								</label>
								<input
									type="date"
									value={formData.collectionDate}
									onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
									min={new Date().toISOString().split("T")[0]}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Preferred Collection Time *
								</label>
								<select
									value={formData.collectionTime}
									onChange={(e) => setFormData({ ...formData, collectionTime: e.target.value })}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
									required
								>
									<option value="">Select time</option>
									<option value="11:00-12:00">11:00 AM - 12:00 PM</option>
									<option value="12:00-13:00">12:00 PM - 1:00 PM</option>
									<option value="13:00-14:00">1:00 PM - 2:00 PM</option>
									<option value="14:00-15:00">2:00 PM - 3:00 PM</option>
									<option value="15:00-16:00">3:00 PM - 4:00 PM</option>
									<option value="16:00-17:00">4:00 PM - 5:00 PM</option>
									<option value="17:00-18:00">5:00 PM - 6:00 PM</option>
									<option value="18:00-19:00">6:00 PM - 7:00 PM</option>
									<option value="19:00-20:00">7:00 PM - 8:00 PM</option>
									<option value="20:00-21:00">8:00 PM - 9:00 PM</option>
									<option value="21:00-22:00">9:00 PM - 10:00 PM</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Additional Notes (Optional)
								</label>
								<textarea
									value={formData.notes}
									onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
									rows={3}
									placeholder="Any special instructions or requests..."
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								/>
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full rounded-md bg-maroon px-4 py-3 text-sm font-semibold text-white hover:bg-maroon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Submitting Order..." : "Submit Collection Request"}
							</button>

							<p className="text-xs text-maroon/60 text-center">
								We'll contact you to confirm your collection time.
							</p>
						</form>
					</div>
				</div>
			</div>
		</Container>
	);
}



