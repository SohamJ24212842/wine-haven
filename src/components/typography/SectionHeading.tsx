"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	children: ReactNode;
	subtitle?: string;
	className?: string;
};

// Simplified heading without scroll-triggered animations
// Used across homepage sections (New Arrivals, Featured, etc.) and other pages
export function SectionHeading({ children, subtitle, className }: SectionHeadingProps) {
	return (
		<div className={cn("text-center", className)}>
			<h2 className="font-[var(--font-display)] text-3xl md:text-4xl tracking-tight text-maroon">
				{children}
			</h2>
			{subtitle ? (
				<p className="mt-2 text-maroon/70 max-w-2xl mx-auto">
					{subtitle}
				</p>
			) : null}
		</div>
	);
}


