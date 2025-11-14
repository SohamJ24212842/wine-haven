import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function VisitUsPage() {
	const openingHours = [
		{ day: "Monday", hours: "11 a.m.–10 p.m." },
		{ day: "Tuesday", hours: "11 a.m.–10 p.m." },
		{ day: "Wednesday", hours: "11 a.m.–10 p.m." },
		{ day: "Thursday", hours: "11 a.m.–10 p.m." },
		{ day: "Friday", hours: "11 a.m.–10 p.m." },
		{ day: "Saturday", hours: "11 a.m.–10 p.m." },
		{ day: "Sunday", hours: "12:30 p.m.–10 p.m." },
	];

	return (
		<Container className="py-12">
			<SectionHeading subtitle="Drop by the shop — we love a chat">Visit Us</SectionHeading>
			<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="space-y-6">
					{/* Address */}
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<div className="flex items-start gap-3">
							<MapPin className="text-gold mt-1" size={20} />
							<div>
								<h3 className="text-lg font-semibold mb-2">Address</h3>
								<p className="text-maroon/80 leading-relaxed">
									George's Street Upper<br />
									Dún Laoghaire, Dublin<br />
									A96 K2H2
								</p>
							</div>
						</div>
					</div>

					{/* Contact */}
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<div className="flex items-start gap-3">
							<Phone className="text-gold mt-1" size={20} />
							<div>
								<h3 className="text-lg font-semibold mb-2">Contact</h3>
								<p className="text-maroon/80 mb-1">
									<a href="tel:+3538954581875" className="hover:text-gold transition-colors">
										+353 89 4581875
									</a>
								</p>
								<p className="text-maroon/80 mb-1">
									<a href="tel:+35315644028" className="hover:text-gold transition-colors">
										(01) 564 4028
									</a>
								</p>
								<p className="text-maroon/80">
									<a href="mailto:mahajanwinehaven24@gmail.com" className="hover:text-gold transition-colors flex items-center gap-1">
										<Mail size={14} />
										mahajanwinehaven24@gmail.com
									</a>
								</p>
							</div>
						</div>
					</div>

					{/* Opening Hours */}
					<div className="rounded-lg border border-maroon/10 bg-white p-6">
						<div className="flex items-start gap-3">
							<Clock className="text-gold mt-1" size={20} />
							<div className="flex-1">
								<h3 className="text-lg font-semibold mb-3">Opening Hours</h3>
								<ul className="space-y-2">
									{openingHours.map((schedule) => (
										<li key={schedule.day} className="flex justify-between text-maroon/80">
											<span className="font-medium">{schedule.day}</span>
											<span>{schedule.hours}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Map */}
				<div className="rounded-lg border border-maroon/10 overflow-hidden">
					<iframe
						title="Wine Haven Location"
						className="h-full w-full min-h-[500px]"
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2382.4733412562445!2d-6.1313088!3d53.2901592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486707001ecfc2ab%3A0x3a4db1ad01379619!2sWine%20Haven!5e0!3m2!1sen!2sie!4v1700000000000!5m2!1sen!2sie"
						allowFullScreen
					/>
				</div>
			</div>
		</Container>
	);
}


