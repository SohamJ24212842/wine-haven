import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		// Placeholder: In production, integrate with EmailJS, Resend, or SMTP.
		console.log("Contact form submission:", body);
		return NextResponse.json({ ok: true });
	} catch (e) {
		return NextResponse.json({ ok: false }, { status: 400 });
	}
}




