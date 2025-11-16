import Image from "next/image";
import { notFound } from "next/navigation";
import { wines } from "@/data/wines";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Metadata } from "next";

type Params = { slug: string };

export async function generateStaticParams() {
	return wines.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
	const wine = wines.find((w) => w.slug === params.slug);
	return {
		title: wine ? `${wine.name} | Wine Haven` : "Wine | Wine Haven",
	};
}

export default function WineDetailPage({ params }: { params: Params }) {
	const wine = wines.find((w) => w.slug === params.slug);
	if (!wine) return notFound();

	return (
		<Container className="py-12">
			<SectionHeading>{wine.name}</SectionHeading>
			<div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
				<div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-maroon/10 bg-white flex items-center justify-center">
					<Image
						src={wine.image}
						alt={wine.name}
						fill
						className="object-contain p-6"
						sizes="(max-width: 768px) 100vw, 50vw"
						priority
					/>
				</div>
				<div>
					<p className="text-sm text-maroon/70">
						{wine.type} • {wine.country}
						{wine.region ? ` • ${wine.region}` : ""}
					</p>
					<p className="mt-3 text-2xl font-semibold text-maroon">€{wine.price.toFixed(2)}</p>
					<p className="mt-6 text-maroon/90 leading-relaxed whitespace-pre-line">
						{wine.description}
					</p>
					<div className="mt-8">
						<button className="inline-flex items-center rounded-md border border-maroon/20 bg-white px-6 py-3 text-sm font-semibold text-maroon shadow-sm transition hover:bg-soft-gray">
							Add to Cart (placeholder)
						</button>
					</div>
				</div>
			</div>
		</Container>
	);
}




