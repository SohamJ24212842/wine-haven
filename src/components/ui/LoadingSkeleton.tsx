"use client";
import { motion } from "framer-motion";

export function ProductCardSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border border-maroon/10 bg-white shadow-sm">
			<div className="relative aspect-[4/5] overflow-hidden bg-soft-gray">
				<motion.div
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "linear",
					}}
					className="h-full w-full bg-gradient-to-r from-soft-gray via-maroon/5 to-soft-gray bg-[length:200%_200%]"
				/>
			</div>
			<div className="p-4">
				<div className="h-3 w-20 bg-maroon/10 rounded mb-2" />
				<div className="h-4 w-32 bg-maroon/20 rounded mb-2" />
				<div className="h-3 w-24 bg-maroon/10 rounded mb-3" />
				<div className="h-5 w-16 bg-maroon/20 rounded" />
			</div>
		</div>
	);
}

export function ProductPageSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white">
				<motion.div
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "linear",
					}}
					className="h-full w-full bg-gradient-to-r from-soft-gray via-maroon/5 to-soft-gray bg-[length:200%_200%]"
				/>
			</div>
			<div className="space-y-4">
				<div className="h-4 w-48 bg-maroon/10 rounded" />
				<div className="h-8 w-32 bg-maroon/20 rounded" />
				<div className="h-4 w-24 bg-maroon/10 rounded" />
				<div className="space-y-2">
					<div className="h-4 w-full bg-maroon/10 rounded" />
					<div className="h-4 w-full bg-maroon/10 rounded" />
					<div className="h-4 w-3/4 bg-maroon/10 rounded" />
				</div>
				<div className="h-12 w-48 bg-gold/20 rounded" />
			</div>
		</div>
	);
}


