"use client";
import Image from "next/image";

type WineBottlesLogoProps = {
	className?: string;
	size?: number;
	useImage?: boolean;
	imageSrc?: string;
};

export function WineBottlesLogo({ 
	className = "", 
	size = 80,
	useImage = false,
	imageSrc = "/logo-wine-bottles.png"
}: WineBottlesLogoProps) {
	// If using an image, render it
	if (useImage && imageSrc) {
		return (
			<div 
				className={`relative ${className}`} 
				style={{ 
					width: size, 
					height: size,
				}}
			>
				<Image
					src={imageSrc}
					alt="Wine Haven Logo - Clinking Wine Glasses"
					fill
					className="object-contain"
					priority
					style={{
						// Enhance visibility on maroon background
						filter: 'brightness(1.1) contrast(1.2) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.6))',
					}}
				/>
			</div>
		);
	}

	// Otherwise, render SVG version - Wine Glasses Clinking
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 160 160"
			className={className}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{/* Red banner with swallowtail ends and stars */}
			<path
				d="M 20 30 Q 80 15 140 30"
				stroke="currentColor"
				strokeWidth="5"
				fill="currentColor"
				strokeLinecap="round"
			/>
			{/* Swallowtail ends */}
			<path d="M 20 30 L 15 35 L 20 40 Z" fill="currentColor" />
			<path d="M 140 30 L 145 35 L 140 40 Z" fill="currentColor" />
			
			{/* Five white stars on banner */}
			<g fill="white" opacity="0.9">
				<path d="M 35 28 L 36.5 32 L 41 32.5 L 37.5 35.5 L 38.5 40 L 35 37.5 L 31.5 40 L 32.5 35.5 L 29 32.5 L 33.5 32 Z" />
				<path d="M 55 26 L 56.5 30 L 61 30.5 L 57.5 33.5 L 58.5 38 L 55 35.5 L 51.5 38 L 52.5 33.5 L 49 30.5 L 53.5 30 Z" />
				<path d="M 80 25 L 81.5 29 L 86 29.5 L 82.5 32.5 L 83.5 37 L 80 34.5 L 76.5 37 L 77.5 32.5 L 74 29.5 L 78.5 29 Z" />
				<path d="M 105 26 L 106.5 30 L 111 30.5 L 107.5 33.5 L 108.5 38 L 105 35.5 L 101.5 38 L 102.5 33.5 L 99 30.5 L 103.5 30 Z" />
				<path d="M 125 28 L 126.5 32 L 131 32.5 L 127.5 35.5 L 128.5 40 L 125 37.5 L 121.5 40 L 122.5 35.5 L 119 32.5 L 123.5 32 Z" />
			</g>
			
			{/* Left wine glass */}
			<g>
				{/* Glass bowl outline */}
				<ellipse cx="50" cy="75" rx="18" ry="22" stroke="currentColor" strokeWidth="2.5" fill="none" />
				{/* Wine liquid with splash effect */}
				<ellipse cx="50" cy="80" rx="16" ry="18" fill="currentColor" />
				{/* Splash droplets */}
				<circle cx="45" cy="65" r="2" fill="currentColor" />
				<circle cx="48" cy="62" r="1.5" fill="currentColor" />
				<circle cx="52" cy="64" r="1.8" fill="currentColor" />
				<circle cx="55" cy="66" r="1.5" fill="currentColor" />
				{/* Curved splash lines */}
				<path d="M 42 68 Q 45 65 48 67" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
				<path d="M 52 66 Q 55 63 58 65" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
				{/* Stem */}
				<line x1="50" y1="97" x2="50" y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
				{/* Base */}
				<ellipse cx="50" cy="115" rx="8" ry="3" fill="currentColor" />
				{/* Base highlight */}
				<ellipse cx="50" cy="114" rx="6" ry="1.5" fill="currentColor" opacity="0.3" />
				{/* Motion lines below base */}
				<line x1="25" y1="120" x2="35" y2="120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1="25" y1="123" x2="35" y2="123" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1="25" y1="126" x2="35" y2="126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</g>
			
			{/* Right wine glass (mirrored) */}
			<g>
				{/* Glass bowl outline */}
				<ellipse cx="110" cy="75" rx="18" ry="22" stroke="currentColor" strokeWidth="2.5" fill="none" />
				{/* Wine liquid with splash effect */}
				<ellipse cx="110" cy="80" rx="16" ry="18" fill="currentColor" />
				{/* Splash droplets */}
				<circle cx="105" cy="65" r="2" fill="currentColor" />
				<circle cx="108" cy="62" r="1.5" fill="currentColor" />
				<circle cx="112" cy="64" r="1.8" fill="currentColor" />
				<circle cx="115" cy="66" r="1.5" fill="currentColor" />
				{/* Curved splash lines */}
				<path d="M 102 68 Q 105 65 108 67" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
				<path d="M 112 66 Q 115 63 118 65" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
				{/* Stem */}
				<line x1="110" y1="97" x2="110" y2="110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
				{/* Base */}
				<ellipse cx="110" cy="115" rx="8" ry="3" fill="currentColor" />
				{/* Base highlight */}
				<ellipse cx="110" cy="114" rx="6" ry="1.5" fill="currentColor" opacity="0.3" />
				{/* Motion lines below base */}
				<line x1="125" y1="120" x2="135" y2="120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1="125" y1="123" x2="135" y2="123" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				<line x1="125" y1="126" x2="135" y2="126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</g>
			
			{/* Clinking splash effect between glasses */}
			<g opacity="0.7">
				<circle cx="80" cy="75" r="4" fill="currentColor" />
				<circle cx="78" cy="73" r="2" fill="currentColor" />
				<circle cx="82" cy="77" r="2.5" fill="currentColor" />
			</g>
		</svg>
	);
}

