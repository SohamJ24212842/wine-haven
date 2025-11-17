"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";
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

export function PromotionalMedia() {
	const [media, setMedia] = useState<PromotionalMedia[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedMedia, setSelectedMedia] = useState<PromotionalMedia | null>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const sectionRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	// Intersection Observer to only animate when visible
	useEffect(() => {
		const element = sectionRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
					}
				});
			},
			{ threshold: 0.1 }
		);

		observer.observe(element);

		return () => {
			observer.unobserve(element);
		};
	}, []);

	// Fetch media once
	useEffect(() => {
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

		return () => {
			if (autoRotateRef.current) {
				clearInterval(autoRotateRef.current);
			}
		};
	}, []);

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

	// Auto play rotation - only when visible
	useEffect(() => {
		if (media.length <= 1 || isHovered || !isVisible) {
			if (autoRotateRef.current) {
				clearInterval(autoRotateRef.current);
				autoRotateRef.current = null;
			}
			return;
		}

		autoRotateRef.current = setInterval(() => {
			nextSlide();
		}, 6000);

		return () => {
			if (autoRotateRef.current) {
				clearInterval(autoRotateRef.current);
				autoRotateRef.current = null;
			}
		};
	}, [media.length, isHovered, isVisible, nextSlide]);

	// Handle video play/pause based on visibility
	useEffect(() => {
		if (loading || media.length === 0) return;
		
		const video = videoRef.current;
		const currentMedia = media[activeIndex];
		if (!video || !currentMedia) return;

		if (isVisible && currentMedia.type === "video" && !currentMedia.thumbnail) {
			video.play().catch(() => {
				// Autoplay might be blocked, that's okay
			});
		} else {
			video.pause();
		}
	}, [isVisible, activeIndex, media, loading]);

	if (loading || media.length === 0) {
		return null;
	}

	const currentMedia = media[activeIndex];

	return (
		<section ref={sectionRef} className="py-16 bg-gradient-to-b from-cream to-soft-gray">
			<Container>
				<SectionHeading>Visit Our Store</SectionHeading>
				<p className="text-center text-maroon/70 mb-12 max-w-3xl mx-auto">
					Experience Wine Haven in person. Browse our curated selection and discover your next favorite bottle.
				</p>

				<div
					className="relative max-w-6xl mx-auto"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<AnimatePresence mode="wait">
						{currentMedia && (
							<motion.div
								key={`${currentMedia.id}-${activeIndex}`}
								initial={{ opacity: 0, scale: 0.98, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 1.02, y: -10 }}
								transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
								className="relative h-[260px] sm:h-[360px] lg:h-[420px] rounded-[32px] overflow-hidden shadow-2xl"
							>
								<div className="absolute inset-0">
									{currentMedia.type === "video" ? (
										currentMedia.thumbnail ? (
											<Image
												src={currentMedia.thumbnail}
												alt={currentMedia.title || "Promotional video"}
												fill
												className="object-cover"
												sizes="(min-width: 1024px) 1024px, 100vw"
												loading="lazy"
												quality={85}
											/>
										) : (
											<video
												ref={videoRef}
												src={currentMedia.url}
												className="w-full h-full object-cover"
												preload="metadata"
												muted
												loop
												playsInline
											/>
										)
									) : (
										<Image
											src={currentMedia.url}
											alt={currentMedia.title || "Store image"}
											fill
											className="object-cover"
											sizes="(min-width: 1024px) 1024px, 100vw"
											loading="lazy"
											quality={85}
										/>
									)}
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
							</motion.div>
						)}
					</AnimatePresence>

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
			<AnimatePresence>
				{selectedMedia && selectedMedia.type === "video" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
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
					</motion.div>
				)}
			</AnimatePresence>

			{/* Image Modal */}
			<AnimatePresence>
				{selectedMedia && selectedMedia.type === "image" && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
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
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
