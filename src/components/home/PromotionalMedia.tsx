"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

type PromotionalMedia = {
	id: string;
	type: "video" | "image";
	url: string;
	thumbnail?: string;
	title?: string;
	description?: string;
	order: number;
	active: boolean;
};

type PromotionalMediaProps = {
	initialMedia?: PromotionalMedia[];
};

export function PromotionalMedia({ initialMedia = [] }: PromotionalMediaProps) {
	const [media, setMedia] = useState<PromotionalMedia[]>(initialMedia);
	const [loading, setLoading] = useState(initialMedia.length === 0);
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedMedia, setSelectedMedia] = useState<PromotionalMedia | null>(null);

	// Only fetch if not provided server-side (fallback)
	useEffect(() => {
		if (initialMedia.length > 0) {
			setLoading(false);
			return;
		}
		
		fetch("/api/promotional-media")
			.then((res) => res.json())
			.then((data) => {
				const activeMedia = (Array.isArray(data) ? data : [])
					.filter((item: PromotionalMedia) => item.active)
					.sort((a, b) => a.order - b.order);
				setMedia(activeMedia);
				setActiveIndex(0);
			})
			.catch((error) => console.error("Failed to fetch promotional media:", error))
			.finally(() => setLoading(false));
	}, [initialMedia]);

	const nextSlide = useCallback(() => {
		setActiveIndex((prev) => {
			if (media.length === 0) return 0;
			return (prev + 1) % media.length;
		});
	}, [media.length]);

	const previousSlide = useCallback(() => {
		setActiveIndex((prev) => {
			if (media.length === 0) return 0;
			return (prev - 1 + media.length) % media.length;
		});
	}, [media.length]);

	// Auto play rotation - disabled for performance
	// useEffect(() => {
	// 	if (media.length <= 1 || isHovered) {
	// 		if (autoRotateRef.current) {
	// 			clearInterval(autoRotateRef.current);
	// 			autoRotateRef.current = null;
	// 		}
	// 		return;
	// 	}

	// 	autoRotateRef.current = setInterval(() => {
	// 		nextSlide();
	// 	}, 6000);

	// 	return () => {
	// 		if (autoRotateRef.current) {
	// 			clearInterval(autoRotateRef.current);
	// 			autoRotateRef.current = null;
	// 		}
	// 	};
	// }, [media.length, isHovered, nextSlide]);

	if (loading) {
		return null;
	}

	if (media.length === 0) {
		return null;
	}

	const currentMedia = media[activeIndex];

	return (
		<section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-cream to-soft-gray">
			<Container>
				<SectionHeading>Visit Our Store</SectionHeading>
				<p className="text-center text-maroon/70 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto text-sm sm:text-base">
					Experience Wine Haven in person. Browse our curated selection and discover your next favorite bottle.
				</p>

				<div className="relative max-w-6xl mx-auto">
					{currentMedia && (
						<div
							key={`${currentMedia.id}-${activeIndex}`}
							className="relative h-[200px] sm:h-[300px] md:h-[360px] lg:h-[420px] rounded-2xl sm:rounded-[32px] overflow-hidden shadow-xl sm:shadow-2xl"
						>
							<div className="absolute inset-0 bg-soft-gray">
								<Image
									src={currentMedia.type === "video" && currentMedia.thumbnail ? currentMedia.thumbnail : currentMedia.url}
									alt={currentMedia.title || (currentMedia.type === "video" ? "Promotional video" : "Store image")}
									fill
									className="object-cover"
									sizes="(min-width: 1024px) 1024px, 100vw"
									loading="eager"
									quality={90}
									priority
								/>
							</div>

							<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent">
								<div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full text-white">
									<div>
										<p className="uppercase tracking-[0.3em] text-xs text-white/70">Wine Haven</p>
										<h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mt-3">
											{currentMedia.title || "Discover the atmosphere"}
										</h3>
										{currentMedia.description && (
											<p className="text-white/80 text-sm sm:text-base mt-4 max-w-xl">
												{currentMedia.description}
											</p>
										)}
									</div>
									<button
										onClick={() => setSelectedMedia(currentMedia)}
										className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur border border-white/30 text-sm font-semibold w-fit"
									>
										<Play size={16} />
										{currentMedia.type === "video" ? "Play Video" : "View Photo"}
									</button>
								</div>
							</div>
						</div>
					)}

					{media.length > 1 && (
						<>
							<button
								onClick={previousSlide}
								className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-maroon hover:bg-white transition"
								aria-label="Previous banner"
							>
								<ChevronLeft size={22} />
							</button>
							<button
								onClick={nextSlide}
								className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-maroon hover:bg-white transition"
								aria-label="Next banner"
							>
								<ChevronRight size={22} />
							</button>
						</>
					)}
				</div>

				{media.length > 1 && (
					<div className="flex justify-center gap-3 mt-6">
						{media.map((_, index) => (
							<button
								key={index}
								onClick={() => setActiveIndex(index)}
								className={`h-2 rounded-full transition-all ${
									index === activeIndex ? "w-10 bg-gold" : "w-2 bg-maroon/30 hover:bg-maroon/60"
								}`}
								aria-label={`Go to banner ${index + 1}`}
							/>
						))}
					</div>
				)}
			</Container>

			{/* Video Modal */}
			{selectedMedia && selectedMedia.type === "video" && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
					onClick={() => setSelectedMedia(null)}
				>
					<div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
						<button
							onClick={() => setSelectedMedia(null)}
							className="absolute -top-10 right-0 text-white hover:text-gold transition"
						>
							Close
						</button>
						<video 
							src={selectedMedia.url} 
							controls 
							autoPlay 
							className="w-full h-full rounded-lg"
							preload="auto"
						/>
					</div>
				</div>
			)}

			{/* Image Modal */}
			{selectedMedia && selectedMedia.type === "image" && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
					onClick={() => setSelectedMedia(null)}
				>
					<div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
						<button
							onClick={() => setSelectedMedia(null)}
							className="absolute -top-10 right-0 text-white hover:text-gold transition"
						>
							Close
						</button>
						<div className="relative aspect-video rounded-lg overflow-hidden">
							<Image
								src={selectedMedia.url}
								alt={selectedMedia.title || "Promotional image"}
								fill
								className="object-contain"
								quality={90}
							/>
						</div>
						{selectedMedia.title && (
							<div className="mt-4 text-center text-white">
								<p className="text-xl font-semibold">{selectedMedia.title}</p>
								{selectedMedia.description && (
									<p className="text-white/80 mt-2">{selectedMedia.description}</p>
								)}
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
