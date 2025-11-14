"use client";
import { motion } from "framer-motion";

type SectionDividerProps = {
	variant?: "gold" | "maroon" | "subtle";
	className?: string;
};

export function SectionDivider({ variant = "gold", className = "" }: SectionDividerProps) {
	const colors = {
		gold: "border-gold",
		maroon: "border-maroon/20",
		subtle: "border-maroon/10",
	};

	return (
		<div className={`flex items-center justify-center py-8 ${className}`}>
			<div className="flex items-center gap-4 w-full max-w-2xl">
				<div className={`flex-1 h-px ${colors[variant]}`} />
				<motion.div
					initial={{ scale: 0 }}
					whileInView={{ scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className={`w-2 h-2 rounded-full ${variant === "gold" ? "bg-gold" : "bg-maroon/30"}`}
				/>
				<div className={`flex-1 h-px ${colors[variant]}`} />
			</div>
		</div>
	);
}


