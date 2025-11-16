import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
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
	turbopack: {
		// Ensure Turbopack resolves the correct project root when multiple lockfiles exist
		root: __dirname,
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
