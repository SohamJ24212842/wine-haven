"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
	const [status, setStatus] = useState<Status>("idle");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const payload = Object.fromEntries(formData.entries());
		setStatus("loading");
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error("Request failed");
			setStatus("success");
			form.reset();
		} catch {
			setStatus("error");
		}
	}

	return (
		<form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
			<input
				name="name"
				required
				placeholder="Your name"
				className="rounded-md border border-maroon/20 bg-white px-4 py-2"
			/>
			<input
				name="email"
				required
				type="email"
				placeholder="Email address"
				className="rounded-md border border-maroon/20 bg-white px-4 py-2"
			/>
			<textarea
				name="message"
				required
				placeholder="How can we help?"
				rows={5}
				className="rounded-md border border-maroon/20 bg-white px-4 py-2"
			/>
			<button
				disabled={status === "loading"}
				className="inline-flex items-center justify-center rounded-md bg-gold px-6 py-3 text-sm font-semibold text-maroon shadow-sm transition hover:brightness-95 disabled:opacity-50"
			>
				{status === "loading" ? "Sending..." : "Send Message"}
			</button>
			{status === "success" ? (
				<p className="text-sm text-green-700">Thanks! We'll be in touch shortly.</p>
			) : null}
			{status === "error" ? (
				<p className="text-sm text-red-700">Something went wrong. Please try again.</p>
			) : null}
		</form>
	);
}




