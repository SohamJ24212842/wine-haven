"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wine } from "@/types/wine";
import { useState } from "react";

type WineCardProps = {
	wine: Wine;
};

export function WineCard({ wine }: WineCardProps) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="group relative"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Link href={`/wine/${wine.slug}`} className="block">
				<div className="overflow-hidden rounded-lg border border-maroon/10 bg-white shadow-sm">
					<div className="relative aspect-[4/5] overflow-hidden bg-soft-gray">
						<motion.div
							animate={{ scale: isHovered ? 1.15 : 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							className="h-full w-full"
						>
							<Image
								src={wine.image}
								alt={wine.name}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
							/>
						</motion.div>
					</div>
					<div className="p-4">
						<h3 className="text-sm font-medium text-maroon">{wine.name}</h3>
						<p className="mt-1 text-xs text-maroon/70">
							{wine.type} • {wine.country}
						</p>
						<p className="mt-2 text-sm font-semibold text-maroon">€{wine.price.toFixed(2)}</p>
					</div>
				</div>
			</Link>
		</div>
	);
}


