import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { Phone, MapPin, Mail } from "lucide-react";

export default function ContactPage() {
	return (
		<Container className="py-12">
			<SectionHeading subtitle="Have a question or need a recommendation?">
				Get in Touch
			</SectionHeading>
			<div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
				<div className="space-y-6">
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<h3 className="text-lg font-semibold mb-4">Contact Details</h3>
						
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<Phone className="text-gold mt-1" size={20} />
								<div>
									<p className="text-sm text-maroon/60 mb-1">Phone</p>
									<p className="text-maroon/80">
										<a href="tel:+3538954581875" className="hover:text-gold transition-colors">
											+353 89 4581875
										</a>
									</p>
									<p className="text-maroon/80">
										<a href="tel:+35315644028" className="hover:text-gold transition-colors">
											(01) 564 4028
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<Mail className="text-gold mt-1" size={20} />
								<div>
									<p className="text-sm text-maroon/60 mb-1">Email</p>
									<p className="text-maroon/80">
										<a href="mailto:mahajanwinehaven24@gmail.com" className="hover:text-gold transition-colors">
											mahajanwinehaven24@gmail.com
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3">
								<MapPin className="text-gold mt-1" size={20} />
								<div>
									<p className="text-sm text-maroon/60 mb-1">Address</p>
									<p className="text-maroon/80 leading-relaxed">
										George's Street Upper<br />
										Dún Laoghaire, Dublin<br />
										A96 K2H2
									</p>
								</div>
							</div>
						</div>

						<p className="mt-6 text-sm text-maroon/70 border-t border-maroon/10 pt-4">
							We usually reply within one working day.
						</p>
					</div>
				</div>
				<div className="rounded-lg border border-maroon/10 bg-white p-6">
					<ContactForm />
				</div>
			</div>
		</Container>
	);
}


