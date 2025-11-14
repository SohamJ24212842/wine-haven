"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { CheckCircle, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function OrderConfirmationContent() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderId");
	const [orderDetails, setOrderDetails] = useState<any>(null);

	useEffect(() => {
		if (orderId) {
			// Fetch order details if needed
			// For now, just show confirmation
		}
	}, [orderId]);

	return (
		<Container className="py-12">
			<div className="mx-auto max-w-2xl text-center">
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="mb-6"
				>
					<CheckCircle className="mx-auto text-gold" size={64} />
				</motion.div>
				<SectionHeading>Order Confirmed!</SectionHeading>
				<p className="mt-4 text-lg text-maroon/80">
					Thank you for your order. We've received your collection request.
				</p>

				{orderId && (
					<div className="mt-6 rounded-lg border border-maroon/10 bg-white p-6">
						<p className="text-sm text-maroon/60 mb-2">Order Reference</p>
						<p className="text-lg font-semibold text-maroon">{orderId}</p>
					</div>
				)}

				<div className="mt-8 rounded-lg border border-maroon/10 bg-white p-6 text-left">
					<h3 className="text-lg font-semibold text-maroon mb-4">What's Next?</h3>
					<ol className="space-y-3 text-maroon/80">
						<li className="flex gap-3">
							<span className="font-semibold text-gold">1.</span>
							<span>We'll review your order and contact you via email or phone to confirm your collection time.</span>
						</li>
						<li className="flex gap-3">
							<span className="font-semibold text-gold">2.</span>
							<span>Once confirmed, visit us at the shop during your selected time slot.</span>
						</li>
						<li className="flex gap-3">
							<span className="font-semibold text-gold">3.</span>
							<span>Pay for your order when you collect it.</span>
						</li>
					</ol>
				</div>

				<div className="mt-8 rounded-lg border border-maroon/10 bg-soft-gray p-6">
					<h3 className="text-lg font-semibold text-maroon mb-4">Collection Address</h3>
					<div className="space-y-3 text-maroon/80">
						<div className="flex items-start gap-3">
							<MapPin className="text-gold mt-1" size={18} />
							<div className="text-left">
								<p>George's Street Upper</p>
								<p>Dún Laoghaire, Dublin</p>
								<p>A96 K2H2</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<Phone className="text-gold mt-1" size={18} />
							<div className="text-left">
								<p>
									<a href="tel:+3538954581875" className="hover:text-gold">+353 89 4581875</a>
								</p>
								<p>
									<a href="tel:+35315644028" className="hover:text-gold">(01) 564 4028</a>
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						href="/shop"
						className="rounded-md bg-gold px-6 py-3 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
					>
						Continue Shopping
					</Link>
					<Link
						href="/"
						className="rounded-md border border-maroon/20 bg-white px-6 py-3 text-sm font-semibold text-maroon hover:bg-soft-gray transition-colors"
					>
						Back to Home
					</Link>
				</div>
			</div>
		</Container>
	);
}

export default function OrderConfirmationPage() {
	return (
		<Suspense fallback={
			<Container className="py-12">
				<div className="text-center text-maroon/60">Loading order confirmation...</div>
			</Container>
		}>
			<OrderConfirmationContent />
		</Suspense>
	);
}

