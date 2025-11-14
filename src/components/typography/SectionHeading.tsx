"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	children: ReactNode;
	subtitle?: string;
	className?: string;
};

export function SectionHeading({ children, subtitle, className }: SectionHeadingProps) {
	return (
		<motion.div
			className={cn("text-center", className)}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<h2 className="font-[var(--font-display)] text-3xl md:text-4xl tracking-tight text-maroon">
				{children}
			</h2>
			{subtitle ? (
				<motion.p
					className="mt-2 text-maroon/70 max-w-2xl mx-auto"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
				>
					{subtitle}
				</motion.p>
			) : null}
		</motion.div>
	);
}


