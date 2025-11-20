import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";

export default function AboutPage() {
	return (
		<Container className="py-12">
			<SectionHeading subtitle="Dún Laoghaire's cozy off-licence for exceptional wines">
				Our Story
			</SectionHeading>
			<div className="prose prose-zinc mt-8 max-w-3xl mx-auto text-maroon/90">
				<p>
					Welcome to <strong>Wine Haven</strong>, Dún Laoghaire's cozy and welcoming off-licence dedicated to exceptional wines, premium spirits, and warm customer care. Founded by <strong>Rahul Mahajan</strong> and his wife, <strong>Shalini Mahajan</strong>, Wine Haven was created from their shared passion for bringing quality, discovery, and genuine hospitality to the community.
				</p>
				<p>
					Although we are an off-licence store, our approach goes far beyond retail. Every bottle on our shelves is handpicked and thoughtfully curated to suit every taste, occasion, and budget. From local Irish labels to classic European vineyards and exciting new-world selections, we offer a collection designed to spark curiosity and elevate everyday moments.
				</p>
				<p>
					At Wine Haven, we believe choosing a bottle should feel enjoyable and personal. Whether you're looking for the perfect pairing, a special celebration bottle, a unique gift, or something new to try, our friendly team is here to guide you with care and expertise.
				</p>
				<p>
					We're proud to host tastings, bottle showcases, and conversations that bring wine lovers and neighbours together. Step inside and explore — because at Wine Haven, every bottle has a story waiting to be discovered.
				</p>
				
				<div className="mt-10 space-y-6 border-t border-maroon/20 pt-8">
					<blockquote className="text-lg italic text-maroon/80 border-l-4 border-gold pl-6">
						<p className="mb-2">"Wine is an invitation—to slow down, savour, and truly connect."</p>
						<p className="text-base not-italic font-semibold text-maroon">— Shalini Mahajan</p>
					</blockquote>
					
					<blockquote className="text-lg italic text-maroon/80 border-l-4 border-gold pl-6">
						<p className="mb-2">"A great bottle isn't just bought — it's experienced, shared, and remembered."</p>
						<p className="text-base not-italic font-semibold text-maroon">— Rahul Mahajan</p>
					</blockquote>
				</div>
				
				<p className="text-center italic mt-10 text-maroon/70">
					<strong>Wine Haven,</strong><br />
					founded by <strong>Rahul & Shalini Mahajan</strong>
				</p>
			</div>
		</Container>
	);
}




