import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";

export default function AboutPage() {
	return (
		<Container className="py-12">
			<SectionHeading subtitle="A neighbourhood wine shop with global tastes">
				Our Story
			</SectionHeading>
			<div className="prose prose-zinc mt-8 max-w-3xl text-maroon/90">
				<p>
					At Wine Haven Dún Laoghaire, we believe great wine elevates everyday moments.
					Our small team handpicks bottles from passionate growers across the world—always
					with balance, value, and food-friendliness in mind.
				</p>
				<p>
					Whether you’re after a weeknight white, a cellar-worthy red, or something
					sparkling to celebrate, we’re here to help you find the perfect bottle.
				</p>
			</div>
		</Container>
	);
}




