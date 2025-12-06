import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		// Optimize images to reduce bandwidth
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "images.pexels.com",
			},
			{
				protocol: "https",
				hostname: "www.sansilvestrovini.com",
			},
		],
	},
	// Optimize video delivery
	async headers() {
		return [
			{
				source: "/:path*.mp4",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Accept-Ranges",
						value: "bytes",
					},
				],
			},
			{
				source: "/:path*.webm",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Accept-Ranges",
						value: "bytes",
					},
				],
			},
			{
				source: "/:path*.mov",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
					{
						key: "Accept-Ranges",
						value: "bytes",
					},
				],
			},
		];
	},
};

export default nextConfig;
