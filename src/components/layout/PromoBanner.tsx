"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useState } from "react";

export function PromoBanner() {
	const [isVisible, setIsVisible] = useState(true);

	if (!isVisible) return null;

	return (
		<motion.div
			initial={{ y: -50, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			exit={{ y: -50, opacity: 0 }}
			className="bg-gradient-to-r from-maroon to-maroon/90 text-gold py-2.5 px-4 relative overflow-hidden"
		>
			{/* Decorative sparkles */}
			<div className="absolute inset-0 opacity-10">
				<Sparkles className="absolute top-1 left-10 w-4 h-4" />
				<Sparkles className="absolute bottom-1 right-20 w-3 h-3" />
				<Sparkles className="absolute top-2 right-40 w-5 h-5" />
			</div>
			
			<div className="container mx-auto flex items-center justify-center gap-3 relative z-10">
				<Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
				<Link
					href="/shop?christmasGift=true"
					className="text-sm md:text-base font-semibold text-center hover:underline transition-all"
				>
					✨ Christmas Offers Now Live — Browse Gift Sets →
				</Link>
				<button
					onClick={() => setIsVisible(false)}
					className="ml-auto text-gold/80 hover:text-gold transition-colors p-1"
					aria-label="Close banner"
				>
					<X size={16} />
				</button>
			</div>
		</motion.div>
	);
}


