"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Package, Search, Filter, Download, LayoutDashboard, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Placeholder order type
type Order = {
	id: string;
	customerName: string;
	email: string;
	total: number;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	items: Array<{ name: string; quantity: number; price: number }>;
	date: string;
};

export default function OrdersPage() {
	const pathname = usePathname();
	const [orders, setOrders] = useState<Order[]>([]);
	const [filter, setFilter] = useState<string>("all");
	const [search, setSearch] = useState("");

	// TODO: Fetch from database
	useEffect(() => {
		// Placeholder - replace with actual API call
		setOrders([]);
	}, []);

	const filteredOrders = orders.filter((order) => {
		const matchesFilter = filter === "all" || order.status === filter;
		const matchesSearch =
			!search ||
			order.customerName.toLowerCase().includes(search.toLowerCase()) ||
			order.email.toLowerCase().includes(search.toLowerCase()) ||
			order.id.toLowerCase().includes(search.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	return (
		<Container className="py-12">
			<div className="mb-8 flex items-center justify-between">
				<SectionHeading>Order Management</SectionHeading>
			</div>

			{/* Admin Navigation */}
			<div className="mb-8 flex gap-2 border-b border-maroon/20">
				<AdminNavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" pathname={pathname} />
				<AdminNavLink href="/admin" icon={<Package size={18} />} label="Products" pathname={pathname} />
				<AdminNavLink href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" pathname={pathname} active />
				<AdminNavLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" pathname={pathname} />
			</div>

			<div className="mb-6 flex items-center justify-between">
				<button className="flex items-center gap-2 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors">
					<Download size={16} />
					Export
				</button>
			</div>

			<div className="mb-6 flex gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon/40" size={18} />
					<input
						type="text"
						placeholder="Search orders by customer, email, or ID..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full rounded-md border border-maroon/20 bg-white pl-10 pr-4 py-2 text-sm outline-none focus:border-gold"
					/>
				</div>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm outline-none focus:border-gold"
				>
					<option value="all">All Orders</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="shipped">Shipped</option>
					<option value="delivered">Delivered</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>

			{filteredOrders.length === 0 ? (
				<div className="rounded-lg border border-maroon/20 bg-soft-gray p-12 text-center">
					<Package size={48} className="mx-auto mb-4 text-maroon/30" />
					<p className="text-maroon/60">No orders found</p>
					<p className="mt-2 text-sm text-maroon/40">Orders will appear here once customers start purchasing</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full border-collapse border border-maroon/20">
						<thead>
							<tr className="bg-soft-gray">
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Order ID</th>
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Customer</th>
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Items</th>
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Total</th>
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Status</th>
								<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Date</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredOrders.map((order) => (
								<tr key={order.id} className="hover:bg-soft-gray/50">
									<td className="border border-maroon/20 p-3 text-sm text-maroon font-mono">#{order.id.slice(0, 8)}</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon">
										<div>
											<div className="font-medium">{order.customerName}</div>
											<div className="text-xs text-maroon/60">{order.email}</div>
										</div>
									</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon">{order.items.length} items</td>
									<td className="border border-maroon/20 p-3 text-sm font-semibold text-maroon">€{order.total.toFixed(2)}</td>
									<td className="border border-maroon/20 p-3">
										<select
											value={order.status}
											onChange={(e) => {
												// TODO: Update order status
											}}
											className="rounded border border-maroon/20 bg-white px-2 py-1 text-xs outline-none focus:border-gold"
										>
											<option value="pending">Pending</option>
											<option value="processing">Processing</option>
											<option value="shipped">Shipped</option>
											<option value="delivered">Delivered</option>
											<option value="cancelled">Cancelled</option>
										</select>
									</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon/70">{order.date}</td>
									<td className="border border-maroon/20 p-3">
										<button className="text-sm text-maroon/70 hover:text-maroon underline">View</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</Container>
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

