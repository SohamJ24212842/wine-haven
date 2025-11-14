import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Instagram, Facebook, Mail } from "lucide-react";

export function Footer() {
	return (
		<footer className="border-t-2 border-maroon/20 bg-gradient-to-b from-maroon to-maroon/95 text-cream">
			<Container className="py-12 grid grid-cols-1 gap-8 md:grid-cols-3">
				<div>
					<h3 className="text-xl font-[var(--font-display)] font-bold text-gold mb-3">Wine Haven</h3>
					<p className="text-sm text-cream/90 leading-relaxed">
						Curated wines in Dún Laoghaire. Premium selection & friendly advice.
					</p>
					<div className="mt-4 flex items-center gap-3">
						<a
							href="https://www.instagram.com/winehaven"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cream/80 hover:text-gold transition-colors"
							aria-label="Instagram"
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://www.facebook.com/winehaven"
							target="_blank"
							rel="noopener noreferrer"
							className="text-cream/80 hover:text-gold transition-colors"
							aria-label="Facebook"
						>
							<Facebook size={20} />
						</a>
					</div>
				</div>
				<div>
					<h4 className="text-base font-[var(--font-display)] font-semibold text-gold mb-3">Visit Us</h4>
					<p className="text-sm text-cream/90">
						George's Street Upper<br />
						Dún Laoghaire, Dublin<br />
						A96 K2H2
					</p>
					<p className="mt-3 text-sm text-cream/90">
						<a href="tel:+3538954581875" className="hover:text-gold transition-colors">+353 89 4581875</a>
					</p>
					<p className="text-sm text-cream/90">
						<a href="tel:+35315644028" className="hover:text-gold transition-colors">(01) 564 4028</a>
					</p>
					<p className="mt-3 text-sm text-cream/90">
						<a href="mailto:mahajanwinehaven24@gmail.com" className="hover:text-gold transition-colors flex items-center gap-1">
							<Mail size={14} />
							mahajanwinehaven24@gmail.com
						</a>
					</p>
					<p className="mt-3 text-sm text-cream/90">
						Mon–Sat: 11 a.m.–10 p.m.<br />
						Sun: 12:30 p.m.–10 p.m.
					</p>
				</div>
				<div>
					<h4 className="text-base font-[var(--font-display)] font-semibold text-gold mb-3">Links</h4>
					<ul className="space-y-2 text-sm">
						<li>
							<Link className="text-cream/90 hover:text-gold transition-colors" href="/shop">
								Shop
							</Link>
						</li>
						<li>
							<Link className="text-cream/90 hover:text-gold transition-colors" href="/about">
								About
							</Link>
						</li>
						<li>
							<Link className="text-cream/90 hover:text-gold transition-colors" href="/visit-us">
								Visit Us
							</Link>
						</li>
						<li>
							<Link className="text-cream/90 hover:text-gold transition-colors" href="/contact">
								Contact
							</Link>
						</li>
					</ul>
				</div>
			</Container>
			<div className="border-t border-gold/20">
				<Container className="py-6 text-xs text-cream/70 text-center">
					© {new Date().getFullYear()} Wine Haven. All rights reserved.
				</Container>
			</div>
		</footer>
	);
}


