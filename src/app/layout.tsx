import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { DynamicNavbar } from "@/components/layout/DynamicNavbar";
import { Footer } from "@/components/layout/Footer";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { CartProvider } from "@/contexts/CartContext";
import { AddedToCartNotification } from "@/components/cart/AddedToCartNotification";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wine Haven Dun Laoghaire",
  description: "Boutique wine shop in Dún Laoghaire — premium selection & service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-cream text-maroon`}
      >
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <PromoBanner />
            <DynamicNavbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AddedToCartNotification />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
