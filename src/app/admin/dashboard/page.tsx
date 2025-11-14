"use client";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { TrendingUp, Package, Users, Euro, LayoutDashboard, ShoppingCart, Settings } from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardPage() {
	const pathname = usePathname();
	
	// TODO: Fetch real data from database
	const stats = {
		totalProducts: products.length,
		featuredProducts: products.filter((p) => p.featured).length,
		onSaleProducts: products.filter((p) => p.onSale).length,
		newProducts: products.filter((p) => p.new).length,
		totalRevenue: 0, // TODO: Calculate from orders
		totalOrders: 0, // TODO: Fetch from database
		totalCustomers: 0, // TODO: Fetch from database
	};

	return (
		<Container className="py-12">
			<SectionHeading>Dashboard Overview</SectionHeading>

			{/* Admin Navigation */}
			<div className="mb-8 flex gap-2 border-b border-maroon/20">
				<AdminNavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} active />
				<AdminNavLink href="/admin" icon={<Package size={18} />} label="Products" pathname={pathname} />
				<AdminNavLink href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" pathname={pathname} />
				<AdminNavLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" pathname={pathname} />
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Products"
					value={stats.totalProducts}
					icon={<Package size={24} />}
					color="bg-blue-100 text-blue-600"
				/>
				<StatCard
					title="Featured Products"
					value={stats.featuredProducts}
					icon={<TrendingUp size={24} />}
					color="bg-gold/20 text-gold"
				/>
				<StatCard
					title="On Sale"
					value={stats.onSaleProducts}
					icon={<Euro size={24} />}
					color="bg-red-100 text-red-600"
				/>
				<StatCard
					title="New Arrivals"
					value={stats.newProducts}
					icon={<Users size={24} />}
					color="bg-green-100 text-green-600"
				/>
			</div>

			{/* TODO: Add charts, recent orders, top products */}
			<div className="mt-8 rounded-lg border border-maroon/20 bg-soft-gray p-8 text-center">
				<p className="text-maroon/60">Analytics charts coming soon...</p>
				<p className="mt-2 text-sm text-maroon/40">Sales trends, top products, revenue charts</p>
			</div>
		</Container>
	);
}

function StatCard({
	title,
	value,
	icon,
	color,
}: {
	title: string;
	value: number;
	icon: React.ReactNode;
	color: string;
}) {
	return (
		<div className="rounded-lg border border-maroon/20 bg-white p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm text-maroon/60">{title}</p>
					<p className="mt-2 text-3xl font-semibold text-maroon">{value}</p>
				</div>
				<div className={`rounded-full p-3 ${color}`}>{icon}</div>
			</div>
		</div>
	);
}

function AdminNavLink({
	href,
	icon,
	label,
	pathname,
	active,
}: {
	href: string;
	icon: React.ReactNode;
	label: string;
	pathname: string;
	active?: boolean;
}) {
	const isActive = active || pathname === href;
	return (
		<Link
			href={href}
			className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
				isActive
					? "border-gold text-maroon"
					: "border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/30"
			}`}
		>
			{icon}
			{label}
		</Link>
	);
}

