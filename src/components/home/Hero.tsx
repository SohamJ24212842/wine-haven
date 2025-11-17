"use client";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function Hero() {
	const ref = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const rafRef = useRef<number | null>(null);
	const lastUpdateRef = useRef<number>(0);
	const isMobileRef = useRef<boolean>(false);
	const [videoDuration, setVideoDuration] = useState(1);
	const [videoError, setVideoError] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
	
	// Detect mobile on mount
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			isMobileRef.current = mobile;
			setIsMobile(mobile);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);
	
	// Defer video loading slightly to prioritize initial page render
	useEffect(() => {
		const timer = setTimeout(() => {
			setShouldLoadVideo(true);
		}, 100); // Small delay to let initial content render
		return () => clearTimeout(timer);
	}, []);
	
	// Track scroll relative to the hero section for video control
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end start"],
	});
	
	// Get video duration when loaded
	useEffect(() => {
		const video = videoRef.current;
		if (video && shouldLoadVideo) {
			const handleLoadedMetadata = () => {
				if (video.duration && video.duration !== Infinity) {
					setVideoDuration(video.duration);
				}
			};
			video.addEventListener("loadedmetadata", handleLoadedMetadata);
			video.addEventListener("loadeddata", handleLoadedMetadata);
			if (video.readyState >= 1) {
				handleLoadedMetadata();
			}
			return () => {
				video.removeEventListener("loadedmetadata", handleLoadedMetadata);
				video.removeEventListener("loadeddata", handleLoadedMetadata);
			};
		}
	}, [shouldLoadVideo]);
	
	// Optimized scroll-controlled video playback with throttling
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const now = performance.now();
		// Throttle updates: only update every ~33ms (30fps) on mobile, ~16ms (60fps) on desktop
		const throttleMs = isMobileRef.current ? 33 : 16;
		
		if (now - lastUpdateRef.current < throttleMs) {
			return; // Skip this update
		}
		lastUpdateRef.current = now;
		
		// Cancel any pending RAF
		if (rafRef.current !== null) {
			cancelAnimationFrame(rafRef.current);
		}
		
		// Use RAF for smooth, frame-synced updates
		rafRef.current = requestAnimationFrame(() => {
			const video = videoRef.current;
			if (!video || !videoDuration || videoDuration <= 0) return;
			
			// Ensure video is ready
			if (video.readyState >= 2) {
				const targetTime = latest * videoDuration;
				const currentTime = video.currentTime;
				
				// Larger threshold on mobile for better performance
				const threshold = isMobileRef.current ? 0.05 : 0.016;
				
				if (Math.abs(currentTime - targetTime) > threshold) {
					const clampedTime = Math.max(0, Math.min(targetTime, videoDuration));
					video.currentTime = clampedTime;
				}
			}
		});
	});
	
	// Cleanup RAF on unmount
	useEffect(() => {
		return () => {
			if (rafRef.current !== null) {
				cancelAnimationFrame(rafRef.current);
			}
		};
	}, []);
	
	// Reduced parallax on mobile for better performance
	const y = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "4%" : "8%"]);
	const opacity = useTransform(scrollYProgress, [0, 0.98, 1], [1, 1, 0]);

	return (
		<div ref={containerRef} className="relative">
			{/* Scroll-controlled wine pouring video - Bottom layer */}
			{shouldLoadVideo && (
				<div className="absolute inset-0 z-0 overflow-hidden" style={{ 
					willChange: "transform",
					transform: "translateZ(0)",
				}}>
					<video
						ref={videoRef}
						src="/7102288-hd_1920_1080_30fps.mp4"
						muted
						playsInline
						preload={isMobile ? "none" : "auto"} // Lazy load on mobile
						className="absolute inset-0 w-full h-full object-cover"
						style={{ 
							objectPosition: "center",
							willChange: "contents",
							transform: "translateZ(0)",
							backfaceVisibility: "hidden",
							WebkitBackfaceVisibility: "hidden",
						}}
						onLoadedMetadata={(e) => {
							const video = e.currentTarget;
							if (video.duration && video.duration !== Infinity) {
								setVideoDuration(video.duration);
							}
						}}
						onLoadedData={(e) => {
							const video = e.currentTarget;
							if (video.duration && video.duration !== Infinity) {
								setVideoDuration(video.duration);
							}
						}}
						onError={(e) => {
							console.error("Video failed to load:", e);
							setVideoError(true);
						}}
						onCanPlay={() => {
							setVideoError(false);
						}}
					/>
				</div>
			)}
			
			{/* Fallback background image - Shows during loading or on error */}
			{(!shouldLoadVideo || videoError) && (
				<motion.div 
					style={{ y, opacity }}
					className="absolute inset-0 z-[1] pointer-events-none"
				>
					<Image
						src="https://images.pexels.com/photos/1374552/pexels-photo-1374552.jpeg"
						alt="Wine cellar background"
						fill
						className="object-cover brightness-[0.7]"
						priority
						quality={isMobile ? 75 : 90} // Lower quality on mobile
						sizes="100vw"
					/>
				</motion.div>
			)}
			
			{/* Overlays */}
			<div className="absolute inset-0 z-[2] bg-gradient-to-b from-maroon/50 via-maroon/30 to-maroon/40 pointer-events-none" />
			<div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/30 via-black/15 to-black/25 pointer-events-none" />
			<div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.05)_100%)] pointer-events-none" />
			
			<section ref={ref} className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
				<Container className="relative z-10 h-full flex items-center">
					<div className="flex h-full flex-col items-center justify-center text-center text-cream max-w-4xl mx-auto">
						{/* Decorative golden star */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.8 }}
							className="mb-6"
						>
							<Sparkles className="w-12 h-12 text-gold/60" />
						</motion.div>
						
						<motion.h1
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight mb-4"
						>
							Wine Haven
							<br />
							<span className="text-gold">Dún Laoghaire</span>
						</motion.h1>
						
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="text-lg md:text-xl text-cream/90 font-light tracking-wide mb-2"
						>
							Curated Wines • Premium Spirits • Craft Beers
						</motion.p>
						
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}
							className="mt-4 max-w-2xl text-base md:text-lg text-cream/80 leading-relaxed"
						>
							Discover handpicked bottles from the world's finest vineyards. 
							Thoughtful advice, exceptional selection, and a passion for the perfect pour.
						</motion.p>
						
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
						>
							<Link
								href="/shop"
								className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-4 text-base font-semibold text-maroon shadow-2xl transition-all hover:brightness-110 hover:shadow-gold/50 hover:scale-105 active:scale-95"
							>
								Shop Wines
							</Link>
							<Link
								href="/shop?christmasGift=true"
								className="inline-flex items-center justify-center rounded-lg border-2 border-gold bg-transparent px-8 py-4 text-base font-semibold text-gold shadow-lg transition-all hover:bg-gold/10 hover:shadow-gold/30 hover:scale-105 active:scale-95"
							>
								Shop Christmas Gifts
							</Link>
						</motion.div>
					</div>
				</Container>
			</section>
			{/* Enhanced spacer with smoother gradient fade */}
			<div className="relative h-48 md:h-64">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/50 to-cream" />
			</div>
		</div>
	);
}
