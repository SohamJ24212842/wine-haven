import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";

export default function AboutPage() {
	return (
		<Container className="py-12">
			<SectionHeading subtitle="Dún Laoghaire's cozy destination for exceptional wines">
				Our Story
			</SectionHeading>
			<div className="prose prose-zinc mt-8 max-w-3xl mx-auto text-maroon/90">
				<p>
					Welcome to <strong>Wine Haven</strong>, Dún Laoghaire's cozy destination for exceptional wines and warm hospitality. Founded by <strong>Rahul Mahajan</strong>, Wine Haven was created from a simple passion: to share great wine and great stories with the community.
				</p>
				<p>
					Every bottle in our collection is handpicked, thoughtfully curated, and chosen to suit every taste, occasion, and budget. From local Irish producers to timeless European classics and exciting new-world finds, we offer wines that inspire discovery.
				</p>
				<p>
					At Wine Haven, we believe wine is best enjoyed with guidance and connection. Whether you're looking for a perfect pairing, a special gift, or a hidden gem, our friendly team is here to help.
				</p>
				<p>
					We're proud to host tastings, wine discussions, and conversations that bring wine lovers together. Step inside, explore something new, and raise a glass with us — because at Wine Haven, every bottle feels like home.
				</p>
				<p className="text-right italic mt-6">
					— <strong>Wine Haven, founded by Rahul Mahajan</strong>
				</p>
			</div>
		</Container>
	);
}




