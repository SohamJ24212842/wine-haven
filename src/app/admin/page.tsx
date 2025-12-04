"use client";
import { useState, useEffect, Suspense } from "react";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, Star, Sparkles, LayoutDashboard, Package, ShoppingCart, Settings, Search, Filter, Upload, X, Gift, Video, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

const ADMIN_PASSWORD = "winehaven2024"; // Change this in production!

// Frontend flag that mirrors NEXT_PUBLIC_USE_SUPABASE.
// When false, the app is using local JSON data only and any
// write operations (add / edit / delete / import) will not
// hit the live database.
const USE_SUPABASE =
	typeof process !== "undefined" && process.env.NEXT_PUBLIC_USE_SUPABASE === "true";

function AdminPageContent() {
	// Hooks must be called in the same order on every render
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [productsList, setProductsList] = useState<Product[]>([]);
	const [editingProduct, setEditingProduct] = useState<Product | null>(null);
	const [showAddForm, setShowAddForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<Product["category"] | "All">("All");
	const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
	const [activeSection, setActiveSection] = useState<"products" | "gifts" | "promotional">(
		searchParams.get("section") === "gifts" ? "gifts" : searchParams.get("section") === "promotional" ? "promotional" : "products"
	);
	const [promotionalMedia, setPromotionalMedia] = useState<any[]>([]);
	const [showPromoForm, setShowPromoForm] = useState(false);
	const [editingPromo, setEditingPromo] = useState<any | null>(null);
	const [showBulkImport, setShowBulkImport] = useState(false);
	const [bulkImportJson, setBulkImportJson] = useState("");

	// Bulk actions for selected products
	const handleBulkAction = async (action: string) => {
		if (selectedProducts.size === 0) return;

		// Check if Supabase is enabled for write operations
		if (!USE_SUPABASE && (action === "delete" || action === "feature" || action === "unfeature" || action === "gift-on" || action === "gift-off" || action === "sale-on" || action === "sale-off")) {
			alert("Bulk actions are disabled in local JSON mode.\n\nEnable Supabase (NEXT_PUBLIC_USE_SUPABASE=true) to perform bulk actions on the live database.");
			return;
		}

		const count = selectedProducts.size;

		let actionLabel = "";
		let isDeleteAction = false;
		switch (action) {
			case "feature":
				actionLabel = "mark as featured";
				break;
			case "unfeature":
				actionLabel = "remove featured";
				break;
			case "gift-on":
				actionLabel = "mark as Christmas gift";
				break;
			case "gift-off":
				actionLabel = "remove Christmas gift";
				break;
			case "sale-on":
				actionLabel = "mark as on sale";
				break;
			case "sale-off":
				actionLabel = "remove on sale";
				break;
			case "delete":
				actionLabel = "delete";
				isDeleteAction = true;
				break;
			default:
				return;
		}

		const confirmMessage = isDeleteAction
			? `⚠️ WARNING: This will permanently delete ${count} selected product(s). This action cannot be undone!\n\nAre you sure you want to delete these products?`
			: `Apply "${actionLabel}" to ${count} selected product(s)?`;

		if (!confirm(confirmMessage)) {
			return;
		}

		try {
			const promises = Array.from(selectedProducts).map(async (slug) => {
				const product = productsList.find((p) => p.slug === slug);
				if (!product) return;

				// Handle delete action
				if (isDeleteAction) {
					const response = await fetch(`/api/products/${slug}`, {
						method: "DELETE",
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(`Failed to delete ${product.name}: ${errorData.error || "Unknown error"}`);
					}

					return response.json();
				}

				// Handle update actions
				let updates: Partial<Product> = {};
				if (action === "feature") updates = { featured: true };
				if (action === "unfeature") updates = { featured: false };
				if (action === "gift-on") updates = { christmasGift: true };
				if (action === "gift-off") updates = { christmasGift: false };
				if (action === "sale-on") updates = { onSale: true };
				if (action === "sale-off") updates = { onSale: false };

				const response = await fetch(`/api/products/${slug}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...product, ...updates }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(`Failed to update ${product.name}: ${errorData.error || "Unknown error"}`);
				}

				return response.json();
			});

			await Promise.all(promises);
			const selectedCount = count;
			setSelectedProducts(new Set());
			fetchProducts();
			const successMessage = isDeleteAction
				? `Successfully deleted ${selectedCount} product(s).`
				: `Successfully applied "${actionLabel}" to ${selectedCount} product(s).`;
			alert(successMessage);
		} catch (error: any) {
			const errorMessage = isDeleteAction
				? `Failed to delete products: ${error.message}`
				: `Failed to update products: ${error.message}`;
			alert(errorMessage);
			console.error(error);
			fetchProducts();
		}
	};

	// Check if already authenticated (stored in sessionStorage)
	useEffect(() => {
		const auth = sessionStorage.getItem("admin_authenticated");
		if (auth === "true") {
			setIsAuthenticated(true);
		}
	}, []);

	// Fetch products from API when authenticated
	useEffect(() => {
		if (isAuthenticated) {
			fetchProducts();
			fetchPromotionalMedia();
		}
	}, [isAuthenticated]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			// Force fresh data for admin - add timestamp to bypass cache
			const response = await fetch(`/api/products?t=${Date.now()}`, {
				cache: 'no-store', // Force no cache
			});
			if (response.ok) {
				const data = await response.json();
				setProductsList(data);
			} else {
				// Fallback to local data if API fails
				setProductsList(products);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
			// Fallback to local data
			setProductsList(products);
		} finally {
			setLoading(false);
		}
	};

	const fetchPromotionalMedia = async () => {
		try {
			const response = await fetch("/api/promotional-media");
			if (response.ok) {
				const data = await response.json();
				setPromotionalMedia(Array.isArray(data) ? data : []);
			}
		} catch (error) {
			console.error("Error fetching promotional media:", error);
		}
	};

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		if (password === ADMIN_PASSWORD) {
			setIsAuthenticated(true);
			sessionStorage.setItem("admin_authenticated", "true");
			setError("");
		} else {
			setError("Incorrect password");
		}
	};

	const handleLogout = () => {
		setIsAuthenticated(false);
		sessionStorage.removeItem("admin_authenticated");
	};

	const toggleFeatured = async (slug: string) => {
		const product = productsList.find((p) => p.slug === slug);
		if (!product) return;

		const newFeaturedValue = !product.featured;

		try {
			const response = await fetch(`/api/products/${slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...product, featured: newFeaturedValue }),
			});

			if (response.ok) {
				const updated = await response.json();
				setProductsList((prev) =>
					prev.map((p) => (p.slug === slug ? updated : p))
				);
			} else {
				const errorData = await response.json();
				console.error("Error updating product:", errorData);
				alert(`Failed to update product: ${errorData.error || "Unknown error"}`);
				// Refresh the list to get the correct state
				fetchProducts();
			}
		} catch (error: any) {
			console.error("Error updating product:", error);
			alert(`Failed to update product: ${error.message || "Network error"}`);
			// Refresh the list to get the correct state
			fetchProducts();
		}
	};

	const toggleNew = async (slug: string) => {
		const product = productsList.find((p) => p.slug === slug);
		if (!product) return;

		const newValue = !product.new;

		try {
			const response = await fetch(`/api/products/${slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...product, new: newValue }),
			});

			if (response.ok) {
				const updated = await response.json();
				setProductsList((prev) =>
					prev.map((p) => (p.slug === slug ? updated : p))
				);
			} else {
				const errorData = await response.json();
				console.error("Error updating product:", errorData);
				alert(`Failed to update product: ${errorData.error || "Unknown error"}`);
				fetchProducts();
			}
		} catch (error: any) {
			console.error("Error updating product:", error);
			alert(`Failed to update product: ${error.message || "Network error"}`);
			fetchProducts();
		}
	};

	const toggleSale = async (slug: string) => {
		const product = productsList.find((p) => p.slug === slug);
		if (!product) return;

		const newValue = !product.onSale;

		try {
			const response = await fetch(`/api/products/${slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...product, onSale: newValue }),
			});

			if (response.ok) {
				const updated = await response.json();
				setProductsList((prev) =>
					prev.map((p) => (p.slug === slug ? updated : p))
				);
			} else {
				const errorData = await response.json();
				console.error("Error updating product:", errorData);
				alert(`Failed to update product: ${errorData.error || "Unknown error"}`);
				fetchProducts();
			}
		} catch (error: any) {
			console.error("Error updating product:", error);
			alert(`Failed to update product: ${error.message || "Network error"}`);
			fetchProducts();
		}
	};

	const toggleChristmasGift = async (slug: string) => {
		const product = productsList.find((p) => p.slug === slug);
		if (!product) return;

		const newValue = !product.christmasGift;

		try {
			const response = await fetch(`/api/products/${slug}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...product, christmasGift: newValue }),
			});

			if (response.ok) {
				const updated = await response.json();
				setProductsList((prev) =>
					prev.map((p) => (p.slug === slug ? updated : p))
				);
			} else {
				const errorData = await response.json();
				console.error("Error updating product:", errorData);
				alert(`Failed to update product: ${errorData.error || "Unknown error"}`);
				fetchProducts();
			}
		} catch (error: any) {
			console.error("Error updating product:", error);
			alert(`Failed to update product: ${error.message || "Network error"}`);
			fetchProducts();
		}
	};

	const deleteProduct = async (slug: string) => {
		if (!confirm("Are you sure you want to delete this product?")) return;

		try {
			const response = await fetch(`/api/products/${slug}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setProductsList((prev) => prev.filter((p) => p.slug !== slug));
			} else {
				alert("Failed to delete product. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete product. Please try again.");
		}
	};

	if (!isAuthenticated) {
		return (
			<Container className="py-20">
				<div className="mx-auto max-w-md">
					<SectionHeading>Admin Login</SectionHeading>
					<form onSubmit={handleLogin} className="mt-8 space-y-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-2">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-md border border-maroon/20 bg-white px-4 py-2 outline-none focus:border-gold"
								placeholder="Enter admin password"
							/>
						</div>
						{error && <p className="text-sm text-red-600">{error}</p>}
						<button
							type="submit"
							className="w-full rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
						>
							Login
						</button>
					</form>
				</div>
			</Container>
		);
	}

	return (
		<Container className="py-12">
			{!USE_SUPABASE && (
				<div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-maroon/80">
					<p className="font-semibold">Local JSON mode (no live database)</p>
					<p className="mt-1">
						This admin is currently using sample data only. Changes you make here (add / edit / delete /
						import) will not be saved to the live database or appear on the production site.
					</p>
				</div>
			)}
			<div className="flex items-center justify-between mb-8">
				<SectionHeading>Admin Dashboard</SectionHeading>
				<button
					onClick={handleLogout}
					className="rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
				>
					Logout
				</button>
			</div>

			{/* Admin Navigation */}
			<div className="mb-8 flex gap-2 border-b border-maroon/20">
				<button
					onClick={() => setActiveSection("products")}
					className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
						activeSection === "products"
							? "border-gold text-maroon"
							: "border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/30"
					}`}
				>
					<Package size={18} />
					Products
				</button>
				<button
					onClick={() => setActiveSection("gifts")}
					className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
						activeSection === "gifts"
							? "border-gold text-maroon"
							: "border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/30"
					}`}
				>
					<Gift size={18} />
					Gifts ({productsList.filter(p => p.christmasGift).length})
				</button>
				<button
					onClick={() => setActiveSection("promotional")}
					className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
						activeSection === "promotional"
							? "border-gold text-maroon"
							: "border-transparent text-maroon/60 hover:text-maroon hover:border-maroon/30"
					}`}
				>
					<Sparkles size={18} />
					Promotional Media
				</button>
				<AdminNavLink href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" pathname={pathname} />
				<AdminNavLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" pathname={pathname} />
			</div>

			{/* Database Status */}
			<div className="mb-4 p-3 rounded-md border border-maroon/20 bg-soft-gray/50">
				<button
					onClick={async () => {
						try {
							const response = await fetch("/api/products/debug");
							const debug = await response.json();
							let message = "Database Status:\n\n";
							message += `✅ Supabase URL: ${debug.supabaseConfigured ? "Configured" : "❌ Not set"}\n`;
							message += `✅ Anon Key: ${debug.hasAnonKey ? "Configured" : "❌ Not set"}\n`;
							message += `✅ Service Role Key: ${debug.hasServiceRoleKey ? "Configured" : "❌ Not set"}\n`;
							if (debug.tableExists !== undefined) {
								message += `✅ Products Table: ${debug.tableExists ? "Exists" : "❌ Not found"}\n`;
								if (debug.productCount !== undefined) {
									message += `📦 Products in DB: ${debug.productCount}\n`;
								}
							}
							if (debug.errors && debug.errors.length > 0) {
								message += `\n❌ Errors:\n${debug.errors.map((e: string) => `  - ${e}`).join("\n")}`;
							}
							alert(message);
						} catch (error) {
							alert("Failed to check database status");
							console.error(error);
						}
					}}
					className="text-xs text-maroon/70 hover:text-maroon underline"
				>
					Check Database Status
				</button>
			</div>

			{/* Promotional Media Section */}
			{activeSection === "promotional" && (
				<div>
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h2 className="text-xl font-semibold text-maroon">Promotional Media</h2>
							<p className="text-sm text-maroon/60 mt-1">Manage store videos and images displayed on the home page</p>
						</div>
						<button
							onClick={() => {
								setShowPromoForm(true);
								setEditingPromo(null);
							}}
							className="flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
						>
							<Plus size={16} />
							Add Media
						</button>
					</div>

					{promotionalMedia.length === 0 ? (
						<div className="text-center py-12 text-maroon/60">
							No promotional media yet. Add your first video or image!
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{promotionalMedia.map((item, index) => (
								<div key={item.id} className="border border-maroon/20 rounded-lg overflow-hidden bg-white">
									<div className="relative aspect-video bg-soft-gray">
										{item.type === "video" ? (
											item.thumbnail ? (
												<img src={item.thumbnail} alt={item.title || "Video"} className="w-full h-full object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<Video className="text-maroon/30" size={48} />
												</div>
											)
										) : (
											<img src={item.url} alt={item.title || "Image"} className="w-full h-full object-cover" />
										)}
										<div className="absolute top-2 right-2 flex gap-2">
											<button
												onClick={async () => {
													const newOrder = Math.max(0, item.order - 1);
													try {
														await fetch(`/api/promotional-media/${item.id}`, {
															method: "PUT",
															headers: { "Content-Type": "application/json" },
															body: JSON.stringify({ order: newOrder }),
														});
														fetchPromotionalMedia();
													} catch (error) {
														alert("Failed to update order");
													}
												}}
												className="p-1 bg-white/90 rounded hover:bg-white transition-colors"
												disabled={index === 0}
											>
												<ArrowUp size={14} />
											</button>
											<button
												onClick={async () => {
													const newOrder = item.order + 1;
													try {
														await fetch(`/api/promotional-media/${item.id}`, {
															method: "PUT",
															headers: { "Content-Type": "application/json" },
															body: JSON.stringify({ order: newOrder }),
														});
														fetchPromotionalMedia();
													} catch (error) {
														alert("Failed to update order");
													}
												}}
												className="p-1 bg-white/90 rounded hover:bg-white transition-colors"
												disabled={index === promotionalMedia.length - 1}
											>
												<ArrowDown size={14} />
											</button>
										</div>
									</div>
									<div className="p-4">
										<div className="flex items-center justify-between mb-2">
											<span className="text-xs px-2 py-1 rounded bg-maroon/10 text-maroon">
												{item.type === "video" ? "Video" : "Image"}
											</span>
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="checkbox"
													checked={item.active}
													onChange={async (e) => {
														try {
															await fetch(`/api/promotional-media/${item.id}`, {
																method: "PUT",
																headers: { "Content-Type": "application/json" },
																body: JSON.stringify({ active: e.target.checked }),
															});
															fetchPromotionalMedia();
														} catch (error) {
															alert("Failed to update");
														}
													}}
													className="rounded border-maroon/20"
												/>
												<span className="text-xs text-maroon/60">Active</span>
											</label>
										</div>
										{item.title && <p className="font-semibold text-maroon text-sm mb-1">{item.title}</p>}
										{item.description && <p className="text-xs text-maroon/60 mb-3">{item.description}</p>}
										<div className="flex gap-2">
											<button
												onClick={() => {
													setEditingPromo(item);
													setShowPromoForm(true);
												}}
												className="flex-1 flex items-center justify-center gap-1 rounded-md border border-maroon/20 bg-white px-3 py-1.5 text-xs text-maroon hover:bg-soft-gray transition-colors"
											>
												<Edit size={14} />
												Edit
											</button>
											<button
												onClick={async () => {
													if (confirm("Delete this media?")) {
														try {
															await fetch(`/api/promotional-media/${item.id}`, { method: "DELETE" });
															fetchPromotionalMedia();
														} catch (error) {
															alert("Failed to delete");
														}
													}
												}}
												className="flex-1 flex items-center justify-center gap-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
											>
												<Trash2 size={14} />
												Delete
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Promotional Media Form Modal */}
					{showPromoForm && (
						<PromotionalMediaForm
							media={editingPromo}
							onClose={() => {
								setShowPromoForm(false);
								setEditingPromo(null);
							}}
							onSave={async (mediaData) => {
								try {
									if (editingPromo) {
										const response = await fetch(`/api/promotional-media/${editingPromo.id}`, {
											method: "PUT",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify(mediaData),
										});
										if (response.ok) {
											fetchPromotionalMedia();
											setShowPromoForm(false);
											setEditingPromo(null);
										} else {
											const result = await response.json();
											alert(`Failed to update: ${result.error}`);
										}
									} else {
										const response = await fetch("/api/promotional-media", {
											method: "POST",
											headers: { "Content-Type": "application/json" },
											body: JSON.stringify(mediaData),
										});
										if (response.ok) {
											fetchPromotionalMedia();
											setShowPromoForm(false);
										} else {
											const result = await response.json();
											alert(`Failed to create: ${result.error}`);
										}
									}
								} catch (error: any) {
									alert(`Error: ${error.message}`);
								}
							}}
						/>
					)}
				</div>
			)}

			{/* Search and Filter Bar */}
			{activeSection !== "promotional" && (
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon/40" size={18} />
					<input
						type="text"
						placeholder="Search products by name, country, region..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-8 py-2 rounded-md border border-maroon/20 bg-white text-sm outline-none focus:border-gold"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-maroon/40 hover:text-maroon"
							aria-label="Clear search"
						>
							<X size={14} />
						</button>
					)}
				</div>
				<div className="flex gap-2 items-center">
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value as Product["category"] | "All")}
						className="px-4 py-2 rounded-md border border-maroon/20 bg-white text-sm outline-none focus:border-gold"
					>
						<option value="All">All Categories</option>
						<option value="Wine">Wine</option>
						<option value="Beer">Beer</option>
						<option value="Spirit">Spirit</option>
					</select>
					{selectedProducts.size > 0 && (
						<>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 rounded-full bg-soft-gray px-3 py-1 text-xs sm:text-sm text-maroon/80">
									<span>Selected: {selectedProducts.size}</span>
									<button
										type="button"
										onClick={() => setSelectedProducts(new Set())}
										className="rounded-full px-1.5 text-maroon/60 hover:bg-maroon/10 hover:text-maroon text-xs"
										aria-label="Clear selection"
									>
										×
									</button>
								</div>
								<select
									defaultValue=""
									onChange={async (e) => {
										const value = e.target.value;
										if (!value) return;
										await handleBulkAction(value);
										e.target.value = "";
									}}
									className="px-3 py-2 rounded-md border border-maroon/20 bg-white text-sm outline-none focus:border-gold"
								>
									<option value="" disabled>
										Bulk actions
									</option>
									<option value="feature">Mark as Featured</option>
									<option value="unfeature">Unmark Featured</option>
									<option value="gift-on">Mark as Christmas Gift</option>
									<option value="gift-off">Unmark Christmas Gift</option>
									<option value="sale-on">Mark as On Sale</option>
									<option value="sale-off">Unmark On Sale</option>
									<option value="delete" className="text-red-600">⚠️ Delete Marked Items</option>
								</select>
							</div>
						</>
					)}
					<button
						onClick={async () => {
							if (!USE_SUPABASE) {
								alert(
									"Import is disabled in local JSON mode.\n\nEnable Supabase (NEXT_PUBLIC_USE_SUPABASE=true) to import products into the live database."
								);
								return;
							}
							if (confirm("Import all products from local data to database? This will skip products that already exist.")) {
								try {
									const response = await fetch("/api/products/import", { method: "POST" });
									const result = await response.json();
									if (response.ok) {
										let message = `Import complete!\n✅ Success: ${result.summary.success}\n⏭️ Skipped: ${result.summary.skipped}\n❌ Errors: ${result.summary.errors}`;
										
										// Show error details if any
										if (result.errorPreview && result.errorPreview.length > 0) {
											message += `\n\nFirst errors:\n${result.errorPreview.map((e: any) => `- ${e.product}: ${e.error}`).join('\n')}`;
										}
										
										alert(message);
										fetchProducts();
									} else {
										alert(`Import failed: ${result.error}\n\n${result.details || ""}`);
									}
								} catch (error) {
									alert("Failed to import products. Check console for details.");
									console.error(error);
								}
							}
						}}
						className="flex items-center gap-2 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
						title="Import all products from local data"
					>
						<Package size={16} />
						Import Products
					</button>
					<button
						onClick={() => setShowBulkImport(true)}
						className="flex items-center gap-2 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
						title="Bulk import products from JSON"
					>
						<Upload size={16} />
						Bulk Import JSON
					</button>
					<button
						onClick={() => {
							// Download CSV export
							window.open("/api/products/export-csv", "_blank");
						}}
						className="flex items-center gap-2 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
						title="Export products to CSV for Deliveroo"
					>
						<Package size={16} />
						Export CSV
					</button>
					<button
						onClick={() => {
							setShowAddForm(true);
							setEditingProduct(null);
						}}
						className="flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
					>
						<Plus size={16} />
						Add New Product
					</button>
				</div>
			</div>
			)}

			{/* Bulk Import Modal */}
			{showBulkImport && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-3xl max-h-[90vh] bg-cream rounded-lg border border-maroon/20 flex flex-col">
						<div className="flex items-center justify-between p-6 border-b border-maroon/20 flex-shrink-0">
							<h2 className="text-xl font-semibold text-maroon">Bulk Import Products</h2>
							<button
								onClick={() => {
									setShowBulkImport(false);
									setBulkImportJson("");
								}}
								className="text-maroon/70 hover:text-maroon transition-colors text-2xl leading-none"
							>
								×
							</button>
						</div>
						<div className="flex-1 overflow-y-auto p-6 space-y-4">
							<div>
								<label className="block text-sm font-medium text-maroon mb-2">
									Paste JSON Array of Products
								</label>
								<textarea
									value={bulkImportJson}
									onChange={(e) => setBulkImportJson(e.target.value)}
									placeholder='[{"name": "Product Name", "category": "Wine", "price": 45.99, "country": "France", ...}, ...]'
									className="w-full h-96 rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-gold"
								/>
								<p className="text-xs text-maroon/60 mt-2">
									Required fields: name, category, price, country. See BULK_IMPORT_FORMAT.md for full format.
									Images can use placeholder URLs and be updated later.
								</p>
							</div>
						</div>
						<div className="flex gap-3 p-6 border-t border-maroon/20 flex-shrink-0">
							<button
								onClick={async () => {
									if (!USE_SUPABASE) {
										alert("Bulk import is disabled in local JSON mode. Enable Supabase to use this feature.");
										return;
									}
									if (!bulkImportJson.trim()) {
										alert("Please paste JSON data");
										return;
									}
									try {
										const products = JSON.parse(bulkImportJson);
										if (!Array.isArray(products)) {
											alert("JSON must be an array of products");
											return;
										}
										if (confirm(`Import ${products.length} product(s)? This will skip products that already exist.`)) {
											const response = await fetch("/api/products/bulk-import", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({ products }),
											});
											const result = await response.json();
											if (response.ok) {
												let message = `Bulk import complete!\n✅ Success: ${result.summary.success}\n⏭️ Skipped: ${result.summary.skipped}\n❌ Errors: ${result.summary.errors}`;
												if (result.errorPreview && result.errorPreview.length > 0) {
													message += `\n\nFirst errors:\n${result.errorPreview.map((e: any) => `- ${e.product}: ${e.error}`).join('\n')}`;
												}
												alert(message);
												setShowBulkImport(false);
												setBulkImportJson("");
												// Force refresh with cache busting
												setTimeout(() => {
													fetchProducts();
												}, 500);
											} else {
												alert(`Import failed: ${result.error}\n\n${result.details || ""}`);
											}
										}
									} catch (error: any) {
										alert(`Invalid JSON: ${error.message}`);
									}
								}}
								className="flex-1 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
							>
								Import Products
							</button>
							<button
								onClick={() => {
									setShowBulkImport(false);
									setBulkImportJson("");
								}}
								className="flex-1 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Product List */}
			{activeSection !== "promotional" && (
				loading ? (
					<div className="text-center py-12 text-maroon/60">Loading products...</div>
				) : (() => {
					// Filter products
					const normalize = (s?: string) =>
						(s || "")
							.toLowerCase()
							.normalize("NFD")
							.replace(/\p{Diacritic}/gu, "");

					const filteredProducts = productsList.filter((product) => {
						// Filter by section (gifts vs products)
						if (activeSection === "gifts" && !product.christmasGift) return false;
						
						const q = normalize(searchQuery);
						const matchesSearch = !q ||
							normalize(product.name).includes(q) ||
							normalize(product.slug).includes(q) ||
							normalize(product.country).includes(q) ||
							normalize(product.region).includes(q) ||
							normalize(product.description).includes(q) ||
							normalize(product.producer).includes(q) ||
							normalize(product.tasteProfile).includes(q) ||
							normalize(product.foodPairing).includes(q) ||
							normalize((product.grapes || []).join(", ")).includes(q);
						
						const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
						
						return matchesSearch && matchesCategory;
					});

					return filteredProducts.length === 0 ? (
						<div className="text-center py-12 text-maroon/60">
							{productsList.length === 0 
								? "No products found. Add your first product!"
								: "No products match your search/filter criteria."}
						</div>
					) : (
						<>
							<div className="mb-4 text-sm text-maroon/60">
								Showing {filteredProducts.length} of {productsList.length} products
							</div>
							<div className="overflow-x-auto">
								<table className="w-full border-collapse border border-maroon/20">
								<thead>
									<tr className="bg-soft-gray">
										<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">
											<input
												type="checkbox"
												checked={filteredProducts.length > 0 && filteredProducts.every((p) => selectedProducts.has(p.slug))}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedProducts(new Set(filteredProducts.map((p) => p.slug)));
													} else {
														setSelectedProducts(new Set());
													}
												}}
												className="rounded border-maroon/20"
											/>
										</th>
										<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Name</th>
										<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Category</th>
										<th className="border border-maroon/20 p-3 text-left text-sm font-semibold text-maroon">Price</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">Featured</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">New</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">On Sale</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">Xmas Gift</th>
								<th className="border border-maroon/20 p-3 text-center text-sm font-semibold text-maroon">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredProducts.map((product) => (
								<tr key={product.slug} className="hover:bg-soft-gray/50">
									<td className="border border-maroon/20 p-3 text-center">
										<input
											type="checkbox"
											checked={selectedProducts.has(product.slug)}
											onChange={(e) => {
												const newSelected = new Set(selectedProducts);
												if (e.target.checked) {
													newSelected.add(product.slug);
												} else {
													newSelected.delete(product.slug);
												}
												setSelectedProducts(newSelected);
											}}
											className="rounded border-maroon/20"
										/>
									</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon">{product.name}</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon/70">{product.category}</td>
									<td className="border border-maroon/20 p-3 text-sm text-maroon">
										{product.onSale && product.salePrice ? (
											<span>
												<span className="line-through text-maroon/50">€{product.price.toFixed(2)}</span>{" "}
												<span className="text-red-600 font-semibold">€{product.salePrice.toFixed(2)}</span>
											</span>
										) : (
											`€${product.price.toFixed(2)}`
										)}
									</td>
									<td className="border border-maroon/20 p-3 text-center">
										<button
											onClick={() => toggleFeatured(product.slug)}
											className={`p-1 rounded transition-colors ${
												product.featured ? "text-gold" : "text-maroon/30"
											}`}
										>
											<Star size={18} fill={product.featured ? "currentColor" : "none"} />
										</button>
									</td>
									<td className="border border-maroon/20 p-3 text-center">
										<button
											onClick={() => toggleNew(product.slug)}
											className={`p-1 rounded transition-colors ${
												product.new ? "text-gold" : "text-maroon/30"
											}`}
										>
											<Sparkles size={18} fill={product.new ? "currentColor" : "none"} />
										</button>
									</td>
									<td className="border border-maroon/20 p-3 text-center">
										<button
											onClick={() => toggleSale(product.slug)}
											className={`p-1 rounded transition-colors ${
												product.onSale ? "text-red-600" : "text-maroon/30"
											}`}
										>
											<Tag size={18} fill={product.onSale ? "currentColor" : "none"} />
										</button>
									</td>
									<td className="border border-maroon/20 p-3 text-center">
										<button
											onClick={() => toggleChristmasGift(product.slug)}
											className={`p-1 rounded transition-colors ${
												product.christmasGift ? "text-red-500" : "text-maroon/30"
											}`}
										>
											<Gift size={18} fill={product.christmasGift ? "currentColor" : "none"} />
										</button>
									</td>
									<td className="border border-maroon/20 p-3">
										<div className="flex items-center justify-center gap-2">
											<button
												onClick={() => {
													setEditingProduct(product);
													setShowAddForm(true);
												}}
												className="p-1 text-maroon/70 hover:text-maroon transition-colors"
												title="Edit"
											>
												<Edit size={16} />
											</button>
											<button
												onClick={() => deleteProduct(product.slug)}
												className="p-1 text-red-600 hover:text-red-700 transition-colors"
												title="Delete"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
									))}
								</tbody>
							</table>
						</div>
						</>
					);
				})()
			)}

			{/* Add/Edit Form Modal */}
			{(showAddForm || editingProduct) && (
				<ProductForm
					product={editingProduct}
					productsList={productsList}
					onClose={() => {
						setShowAddForm(false);
						setEditingProduct(null);
					}}
					onSave={async (product) => {
						try {
							if (editingProduct) {
								// Update existing product
								const response = await fetch(`/api/products/${editingProduct.slug}`, {
									method: "PUT",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(product),
								});
								const result = await response.json();
								if (response.ok) {
									setProductsList((prev) =>
										prev.map((p) => (p.slug === editingProduct.slug ? result : p))
									);
									setShowAddForm(false);
									setEditingProduct(null);
								} else {
									alert(`Failed to update product: ${result.error}\n\n${result.details || ""}`);
									return;
								}
							} else {
								// Create new product
								const response = await fetch("/api/products", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify(product),
								});
								const result = await response.json();
								if (response.ok) {
									setProductsList((prev) => [...prev, result]);
									setShowAddForm(false);
									setEditingProduct(null);
								} else {
									alert(`Failed to create product: ${result.error}\n\n${result.details || ""}`);
									return;
								}
							}
						} catch (error: any) {
							console.error("Error saving product:", error);
							alert(`Failed to save product: ${error.message || "Unknown error"}\n\nCheck the browser console for details.`);
						}
					}}
				/>
			)}
		</Container>
	);
}

function ProductForm({
	product,
	onClose,
	onSave,
	productsList,
}: {
	product: Product | null;
	onClose: () => void;
	onSave: (product: Product) => void;
	productsList: Product[];
}) {
	const [formData, setFormData] = useState<Partial<Product>>(
		product || {
			slug: "",
			category: "Wine",
			name: "",
			price: 0,
			description: "",
			image: "",
			country: "",
			featured: false,
			new: false,
			onSale: false,
			christmasGift: false,
		}
	);
	const [imagePreview, setImagePreview] = useState<string>(product?.image || "");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [uploadingImage, setUploadingImage] = useState(false);
	
	// Maintain local lists that include newly added values
	const [localCategories, setLocalCategories] = useState<string[]>(["Wine", "Beer", "Spirit"]);
	const [localCountries, setLocalCountries] = useState<string[]>([]);
	const [localRegions, setLocalRegions] = useState<string[]>([]);

	// Get unique countries and regions from existing products and merge with local lists
	useEffect(() => {
		const uniqueCountries = Array.from(new Set(productsList.map(p => p.country).filter((c): c is string => Boolean(c)))).sort();
		const uniqueRegions = Array.from(new Set(productsList.map(p => p.region).filter((r): r is string => Boolean(r)))).sort();
		
		setLocalCountries((prev) => {
			const merged = Array.from(new Set([...prev, ...uniqueCountries])).sort();
			return merged;
		});
		setLocalRegions((prev) => {
			const merged = Array.from(new Set([...prev, ...uniqueRegions])).sort();
			return merged;
		});
	}, [productsList]);

	// Update form data and image preview when product changes
	useEffect(() => {
		if (product) {
			setFormData({
				slug: product.slug,
				category: product.category,
				name: product.name,
				price: product.price,
				description: product.description || "",
				image: product.image || "",
				country: product.country || "",
				region: product.region || "",
				wineType: product.wineType,
				spiritType: product.spiritType,
				beerStyle: product.beerStyle,
				abv: product.abv,
				volumeMl: product.volumeMl,
				// Note: we keep grapes as a comma-separated string in form state
				// and convert to string[] only right before saving.
				grapes: product.grapes ? (product.grapes.join(", ") as any) : undefined,
				featured: product.featured || false,
				new: product.new || false,
				onSale: product.onSale || false,
				salePrice: product.salePrice,
				stock: product.stock || 0,
				christmasGift: product.christmasGift || false,
			});
			setImagePreview(product.image || "");
			
			// Add product's country/region to local lists if not already present
			if (product.country && !localCountries.includes(product.country)) {
				setLocalCountries((prev) => [...prev, product.country!].sort());
			}
			if (product.region && product.region && !localRegions.includes(product.region)) {
				setLocalRegions((prev) => [...prev, product.region!].sort());
			}
			if (product.category && !localCategories.includes(product.category)) {
				setLocalCategories((prev) => [...prev, product.category].sort());
			}
		} else {
			setFormData({
				slug: "",
				category: "Wine",
				name: "",
				price: 0,
				description: "",
				image: "",
				country: "",
				region: "",
				grapes: undefined,
				featured: false,
				new: false,
				onSale: false,
				christmasGift: false,
			});
			setImagePreview("");
		}
	}, [product]);

	const handleImageUpload = async (file: File) => {
		setUploadingImage(true);
		try {
			// Convert to base64 for now (can be upgraded to Supabase Storage later)
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				setImagePreview(base64String);
				setFormData({ ...formData, image: base64String });
				setUploadingImage(false);
			};
			reader.onerror = () => {
				alert("Failed to read image file");
				setUploadingImage(false);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Failed to upload image");
			setUploadingImage(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				alert("Please select an image file");
				return;
			}
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert("Image size must be less than 5MB");
				return;
			}
			setImageFile(file);
			handleImageUpload(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.name || !formData.slug || !formData.price) {
			alert("Please fill in all required fields");
			return;
		}
		// Ensure image is set
		if (!formData.image) {
			alert("Please upload an image or provide an image URL");
			return;
		}
		const asProduct = formData as Product & { grapes?: string; images?: string[] };
		const prepared: Product = {
			...asProduct,
			grapes: asProduct.grapes
				? asProduct.grapes
						.split(",")
						.map((g: string) => g.trim())
						.filter(Boolean)
				: undefined,
			images: Array.isArray(asProduct.images) && asProduct.images.length ? asProduct.images : undefined,
		};
		// Ensure primary image appears first in gallery without duplicates
		if (prepared.images && prepared.images.length) {
			const unique = Array.from(new Set(prepared.images.filter(Boolean)));
			prepared.images = [prepared.image, ...unique.filter((u) => u !== prepared.image)];
		}

		onSave(prepared);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream rounded-lg border border-maroon/20 p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-xl font-semibold text-maroon">
						{product ? "Edit Product" : "Add New Product"}
					</h2>
					<button
						onClick={onClose}
						className="text-maroon/70 hover:text-maroon transition-colors"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Name *</label>
							<input
								type="text"
								value={formData.name || ""}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">
								URL Name *{" "}
								<span className="text-xs text-maroon/60">(used in the link, e.g. /product/url-name)</span>
							</label>
							<input
								type="text"
								value={formData.slug || ""}
								onFocus={() => {
									// Auto-generate from Name the first time user clicks into the field,
									// but only if it's currently empty.
									if (!formData.slug && formData.name) {
										setFormData({
											...formData,
											slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
										});
									}
								}}
								onChange={(e) =>
									setFormData({
										...formData,
										slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
									})
								}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Category *</label>
							<SearchableSelect
								value={formData.category || "Wine"}
								onChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
								options={localCategories}
								placeholder="Select category"
								onAddNew={(value) => {
									if (!localCategories.includes(value)) {
										setLocalCategories((prev) => [...prev, value].sort());
									}
									setFormData({ ...formData, category: value as Product["category"] });
								}}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Price (€) *</label>
							<input
								type="number"
								step="0.01"
								value={formData.price || ""}
								onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								required
							/>
						</div>
						{formData.onSale && (
							<div>
								<label className="block text-sm font-medium text-maroon mb-1">Sale Price (€)</label>
								<input
									type="number"
									step="0.01"
									value={formData.salePrice || ""}
									onChange={(e) =>
										setFormData({ ...formData, salePrice: parseFloat(e.target.value) })
									}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								/>
							</div>
						)}
					</div>

					{/* Category-specific type fields (optional but recommended for filters) */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{formData.category === "Wine" && (
							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Wine type
									<span className="block text-[11px] text-maroon/60">
										Used for filters (Red, White, Rosé, Sparkling, Prosecco)
									</span>
								</label>
								<select
									value={formData.wineType || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											wineType: (e.target.value || undefined) as Product["wineType"],
										})
									}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								>
									<option value="">Not set</option>
									<option value="Red">Red</option>
									<option value="White">White</option>
									<option value="Rosé">Rosé</option>
									<option value="Sparkling">Sparkling</option>
								<option value="Prosecco">Prosecco</option>
								</select>
							</div>
						)}

						{formData.category === "Spirit" && (
							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Spirit type
									<span className="block text-[11px] text-maroon/60">
										Used for filters (Whiskey, Gin, etc.)
									</span>
								</label>
								<select
									value={formData.spiritType || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											spiritType: (e.target.value || undefined) as Product["spiritType"],
										})
									}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								>
									<option value="">Not set</option>
									<option value="Whiskey">Whiskey</option>
									<option value="Gin">Gin</option>
									<option value="Vodka">Vodka</option>
									<option value="Rum">Rum</option>
									<option value="Tequila">Tequila</option>
									<option value="Liqueur">Liqueur</option>
								</select>
							</div>
						)}

						{formData.category === "Beer" && (
							<div>
								<label className="block text-sm font-medium text-maroon mb-1">
									Beer style
									<span className="block text-[11px] text-maroon/60">
										Used for filters (Lager, IPA, Stout, etc.)
									</span>
								</label>
								<select
									value={formData.beerStyle || ""}
									onChange={(e) =>
										setFormData({
											...formData,
											beerStyle: (e.target.value || undefined) as Product["beerStyle"],
										})
									}
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								>
									<option value="">Not set</option>
									<option value="Lager">Lager</option>
									<option value="IPA">IPA</option>
									<option value="Pale Ale">Pale Ale</option>
									<option value="Stout">Stout</option>
									<option value="Porter">Porter</option>
									<option value="Pilsner">Pilsner</option>
									<option value="Sour">Sour</option>
									<option value="Wheat Beer">Wheat Beer</option>
									<option value="Ginger Beer">Ginger Beer</option>
								</select>
							</div>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Description</label>
						<textarea
							value={formData.description || ""}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							rows={4}
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
					</div>

					{/* Producer / Tasting Info (optional) */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="md:col-span-1">
							<label className="block text-sm font-medium text-maroon mb-1">
								Producer / Distillery
								<span className="block text-[11px] text-maroon/60">
									Winery, brewery or distillery name (optional)
								</span>
							</label>
							<input
								type="text"
								value={formData.producer || ""}
								onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								placeholder="e.g. Castello di Albola"
							/>
						</div>
						<div className="md:col-span-1">
							<label className="block text-sm font-medium text-maroon mb-1">
								Taste profile
								<span className="block text-[11px] text-maroon/60">
									Short tasting notes (optional)
								</span>
							</label>
							<textarea
								value={formData.tasteProfile || ""}
								onChange={(e) => setFormData({ ...formData, tasteProfile: e.target.value })}
								rows={3}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								placeholder="Red cherry, dried rose, spice..."
							/>
						</div>
						<div className="md:col-span-1">
							<label className="block text-sm font-medium text-maroon mb-1">
								Food pairing
								<span className="block text-[11px] text-maroon/60">
									Ideal dishes to serve with (optional)
								</span>
							</label>
							<textarea
								value={formData.foodPairing || ""}
								onChange={(e) => setFormData({ ...formData, foodPairing: e.target.value })}
								rows={3}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								placeholder="Braised beef, truffle risotto..."
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">
								Country
								{formData.category === "Spirit" && formData.spiritType === "Whiskey" && (
									<span className="block text-[11px] text-maroon/60">
										For whiskey filters, use exactly: Ireland, Scotland, USA, or Japan.
									</span>
								)}
							</label>
							<SearchableSelect
								value={formData.country || ""}
								onChange={(value) => setFormData({ ...formData, country: value })}
								options={localCountries}
								placeholder="Select country"
								onAddNew={(value) => {
									if (!localCountries.includes(value)) {
										setLocalCountries((prev) => [...prev, value].sort());
									}
									setFormData({ ...formData, country: value });
								}}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Region</label>
							<SearchableSelect
								value={formData.region || ""}
								onChange={(value) => setFormData({ ...formData, region: value || undefined })}
								options={localRegions}
								placeholder="Select region (optional)"
								onAddNew={(value) => {
									if (!localRegions.includes(value)) {
										setLocalRegions((prev) => [...prev, value].sort());
									}
									setFormData({ ...formData, region: value });
								}}
							/>
						</div>
					</div>

					{/* ABV, Volume & Grapes */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">ABV (%)</label>
							<input
								type="number"
								step="0.1"
								min="0"
								max="100"
								value={formData.abv || ""}
								onChange={(e) => setFormData({ ...formData, abv: e.target.value ? parseFloat(e.target.value) : undefined })}
								placeholder="e.g., 13.5"
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Volume (ml)</label>
							<input
								type="text"
								inputMode="numeric"
								pattern="\d*"
								value={formData.volumeMl ?? ""}
								onChange={(e) => {
									const raw = e.target.value.replace(/[^\d]/g, "");
									setFormData({
										...formData,
										volumeMl: raw ? parseInt(raw, 10) : undefined,
									});
								}}
								placeholder="e.g., 750"
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">
								Grapes
								<span className="block text-[11px] text-maroon/60">
									Comma-separated, e.g. Nebbiolo, Corvina, Rondinella
								</span>
							</label>
							<input
								type="text"
								value={(formData.grapes as unknown as string) || ""}
								onChange={(e) =>
									setFormData({
										...formData,
										grapes: e.target.value as unknown as string[],
									})
								}
								placeholder="e.g., Cabernet Sauvignon, Merlot"
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							/>
						</div>
					</div>

					{/* Image Upload Section */}
					<div>
						<label className="block text-sm font-medium text-maroon mb-2">Product Image *</label>
						
						{/* Image Preview */}
						{imagePreview && (
							<div className="mb-3 relative inline-block">
								<img
									src={imagePreview}
									alt="Preview"
									className="w-32 h-40 object-cover rounded-md border border-maroon/20"
								/>
								<button
									type="button"
									onClick={() => {
										setImagePreview("");
										setFormData({ ...formData, image: "" });
										setImageFile(null);
									}}
									className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
								>
									<X size={16} />
								</button>
							</div>
						)}

						{/* File Upload */}
						<div className="mb-3">
							<label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded-md border border-maroon/20 bg-white text-sm text-maroon hover:bg-soft-gray transition-colors">
								<Upload size={16} />
								{uploadingImage ? "Uploading..." : imageFile ? "Change Image" : "Upload Image"}
								<input
									type="file"
									accept="image/*"
									onChange={handleFileChange}
									className="hidden"
									disabled={uploadingImage}
								/>
							</label>
						</div>

						{/* Or use URL */}
						<div className="text-xs text-maroon/60 mb-2">OR</div>
						<input
							type="text"
							placeholder="Or paste image URL here"
							value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""}
							onChange={(e) => {
								const url = e.target.value;
								if (url) {
									setFormData({ ...formData, image: url });
									setImagePreview(url);
									setImageFile(null);
								}
							}}
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
						{/* Additional gallery images (comma separated URLs) */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-maroon mb-1">
								Additional Image URLs
								<span className="block text-[11px] text-maroon/60">
									Optional: comma-separated list. The primary image above will be shown first.
								</span>
							</label>
							<textarea
								rows={2}
								placeholder="Add more images (comma-separated URLs)"
								value={Array.isArray((formData as any).images) ? ((formData as any).images as string[]).join(', ') : ''}
								onChange={(e) => {
									const arr = e.target.value
										.split(',')
										.map((s) => s.trim())
										.filter(Boolean);
									setFormData({ ...formData, images: arr as unknown as any });
								}}
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-3">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.featured || false}
									onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
									className="rounded border-maroon/20"
								/>
								<span className="text-sm text-maroon">Featured</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.new || false}
									onChange={(e) => setFormData({ ...formData, new: e.target.checked })}
									className="rounded border-maroon/20"
								/>
								<span className="text-sm text-maroon">New</span>
							</label>
						</div>
						<div className="flex flex-col gap-3">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.onSale || false}
									onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
									className="rounded border-maroon/20"
								/>
								<span className="text-sm text-maroon">On Sale</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.christmasGift || false}
									onChange={(e) => setFormData({ ...formData, christmasGift: e.target.checked })}
									className="rounded border-maroon/20"
								/>
								<span className="text-sm text-maroon">Christmas Gift</span>
							</label>
						</div>
					</div>

					<div className="flex gap-4 pt-4">
						<button
							type="submit"
							className="flex-1 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
						>
							{product ? "Update Product" : "Add Product"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function PromotionalMediaForm({
	media,
	onClose,
	onSave,
}: {
	media: any | null;
	onClose: () => void;
	onSave: (media: any) => void;
}) {
	const [formData, setFormData] = useState({
		type: media?.type || "image",
		url: media?.url || "",
		thumbnail: media?.thumbnail || "",
		title: media?.title || "",
		description: media?.description || "",
		order: media?.order ?? 0,
		active: media?.active !== false,
	});
	const [imagePreview, setImagePreview] = useState<string>(media?.url || "");
	const [thumbnailPreview, setThumbnailPreview] = useState<string>(media?.thumbnail || "");
	const [videoPreview, setVideoPreview] = useState<string>(media?.type === "video" ? media?.url || "" : "");
	const [uploading, setUploading] = useState(false);

	const handleImageUpload = async (file: File, isThumbnail: boolean = false) => {
		setUploading(true);
		try {
			// Convert to base64 for now (can be upgraded to Supabase Storage later)
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				if (isThumbnail) {
					setThumbnailPreview(base64String);
					setFormData({ ...formData, thumbnail: base64String });
				} else {
					setImagePreview(base64String);
					setFormData({ ...formData, url: base64String });
				}
				setUploading(false);
			};
			reader.onerror = () => {
				alert("Failed to read image file");
				setUploading(false);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error("Error uploading image:", error);
			alert("Failed to upload image");
			setUploading(false);
		}
	};

	const handleVideoUpload = async (file: File) => {
		setUploading(true);
		try {
			// Convert to base64 for now (can be upgraded to Supabase Storage later)
			// Note: Large videos will create very large base64 strings. Consider using Supabase Storage for production.
			if (file.size > 20 * 1024 * 1024) {
				alert("Video file is too large for base64 upload (max 20MB). Please use a URL or upload to a storage service.");
				setUploading(false);
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				setVideoPreview(base64String);
				setFormData({ ...formData, url: base64String });
				setUploading(false);
			};
			reader.onerror = () => {
				alert("Failed to read video file");
				setUploading(false);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error("Error uploading video:", error);
			alert("Failed to upload video");
			setUploading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean = false) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
				alert("Please select an image or video file");
				return;
			}
			// Validate file size (max 10MB for images, 50MB for videos)
			const maxSize = file.type.startsWith("video/") ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
			if (file.size > maxSize) {
				alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
				return;
			}
			if (file.type.startsWith("image/")) {
				handleImageUpload(file, isThumbnail);
			} else if (file.type.startsWith("video/") && !isThumbnail) {
				handleVideoUpload(file);
			}
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		// Validation based on type
		if (formData.type === "image") {
			if (!formData.url) {
				alert("Please upload an image or provide an image URL");
				return;
			}
			// Check if it's a valid image URL or base64 image
			const isImageUrl = formData.url.startsWith("data:image/") || 
				/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(formData.url);
			if (!isImageUrl && !formData.url.startsWith("data:")) {
				alert("Please provide a valid image URL (jpg, png, gif, webp, svg) or upload an image");
				return;
			}
		} else if (formData.type === "video") {
			if (!formData.url) {
				alert("Please upload a video or provide a video URL");
				return;
			}
			// Check if it's a valid video URL or base64 video
			const isVideoUrl = formData.url.startsWith("data:video/") ||
				/\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(formData.url) ||
				formData.url.includes("youtube.com") ||
				formData.url.includes("youtu.be") ||
				formData.url.includes("vimeo.com");
			if (!isVideoUrl && !formData.url.startsWith("data:")) {
				alert("Please provide a valid video URL (mp4, webm, mov, or YouTube/Vimeo link) or upload a video");
				return;
			}
		}
		
		onSave(formData);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="w-full max-w-2xl max-h-[90vh] bg-cream rounded-lg border border-maroon/20 flex flex-col">
				<div className="flex items-center justify-between p-6 border-b border-maroon/20 flex-shrink-0">
					<h2 className="text-xl font-semibold text-maroon">
						{media ? "Edit Promotional Media" : "Add Promotional Media"}
					</h2>
					<button
						onClick={onClose}
						className="text-maroon/70 hover:text-maroon transition-colors text-2xl leading-none"
					>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Type *</label>
						<select
							value={formData.type}
							onChange={(e) => {
								const newType = e.target.value as "video" | "image";
								// Reset URL and previews when switching types
								if (newType !== formData.type) {
									setFormData({ ...formData, type: newType, url: "", thumbnail: "" });
									setImagePreview("");
									setThumbnailPreview("");
									setVideoPreview("");
								}
							}}
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							required
						>
							<option value="image">Image</option>
							<option value="video">Video</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">
							{formData.type === "image" ? "Image" : "Video"} {formData.type === "image" ? "Upload or URL" : "URL"} *
						</label>
						
						{formData.type === "image" ? (
							<>
								{/* Image Preview */}
								{imagePreview && (
									<div className="mb-3 relative inline-block">
										<img
											src={imagePreview}
											alt="Preview"
											className="w-32 h-32 object-cover rounded-md border border-maroon/20"
										/>
										<button
											type="button"
											onClick={() => {
												setImagePreview("");
												setFormData({ ...formData, url: "" });
											}}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
										>
											<X size={16} />
										</button>
									</div>
								)}

								{/* File Upload */}
								<div className="mb-3">
									<label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded-md border border-maroon/20 bg-white text-sm text-maroon hover:bg-soft-gray transition-colors">
										<Upload size={16} />
										{uploading ? "Uploading..." : imagePreview ? "Change Image" : "Upload Image"}
										<input
											type="file"
											accept="image/*"
											onChange={(e) => handleFileChange(e, false)}
											className="hidden"
											disabled={uploading}
										/>
									</label>
								</div>

								{/* Or use URL */}
								<div className="text-xs text-maroon/60 mb-2">OR paste image URL</div>
								
								<input
									type="text"
									value={formData.url && !formData.url.startsWith("data:") ? formData.url : ""}
									onChange={(e) => {
										const url = e.target.value;
										if (url) {
											setFormData({ ...formData, url: url });
											setImagePreview(url);
										} else {
											setFormData({ ...formData, url: "" });
											if (!imagePreview || imagePreview.startsWith("data:")) {
												setImagePreview("");
											}
										}
									}}
									placeholder="https://example.com/image.jpg"
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								/>
								{!imagePreview && !formData.url && (
									<p className="text-xs text-red-600 mt-1">Please upload an image or provide an image URL</p>
								)}
							</>
						) : (
							<>
								{/* Video Preview */}
								{videoPreview && (
									<div className="mb-3 relative inline-block">
										<video
											src={videoPreview}
											className="w-64 h-36 object-cover rounded-md border border-maroon/20"
											controls
										/>
										<button
											type="button"
											onClick={() => {
												setVideoPreview("");
												setFormData({ ...formData, url: "" });
											}}
											className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
										>
											<X size={16} />
										</button>
									</div>
								)}

								{/* Video File Upload */}
								<div className="mb-3">
									<label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded-md border border-maroon/20 bg-white text-sm text-maroon hover:bg-soft-gray transition-colors">
										<Upload size={16} />
										{uploading ? "Uploading..." : videoPreview ? "Change Video" : "Upload Video"}
										<input
											type="file"
											accept="video/*"
											onChange={(e) => handleFileChange(e, false)}
											className="hidden"
											disabled={uploading}
										/>
									</label>
									<p className="text-xs text-maroon/60 mt-1">Max 20MB for direct upload (larger files: use URL)</p>
								</div>

								{/* Or use URL */}
								<div className="text-xs text-maroon/60 mb-2">OR paste video URL</div>
								<input
									type="text"
									value={formData.url && !formData.url.startsWith("data:") ? formData.url : ""}
									onChange={(e) => {
										const url = e.target.value;
										if (url) {
											setFormData({ ...formData, url: url });
											setVideoPreview(url);
										} else {
											setFormData({ ...formData, url: "" });
											if (!videoPreview || videoPreview.startsWith("data:")) {
												setVideoPreview("");
											}
										}
									}}
									placeholder="https://example.com/video.mp4 or YouTube/Vimeo link"
									className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
								/>
								{!videoPreview && !formData.url && (
									<p className="text-xs text-red-600 mt-1">Please upload a video or provide a video URL (mp4, webm, mov, or YouTube/Vimeo)</p>
								)}
								<p className="text-xs text-maroon/60 mt-1">
									Supported formats: MP4, WebM, MOV, or YouTube/Vimeo links
								</p>
							</>
						)}
					</div>

					{formData.type === "video" && (
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Thumbnail Upload or URL (optional)</label>
							
							{/* Thumbnail Preview */}
							{thumbnailPreview && (
								<div className="mb-3 relative inline-block">
									<img
										src={thumbnailPreview}
										alt="Thumbnail preview"
										className="w-32 h-32 object-cover rounded-md border border-maroon/20"
									/>
									<button
										type="button"
										onClick={() => {
											setThumbnailPreview("");
											setFormData({ ...formData, thumbnail: "" });
										}}
										className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
									>
										<X size={16} />
									</button>
								</div>
							)}

							{/* File Upload */}
							<div className="mb-3">
								<label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 rounded-md border border-maroon/20 bg-white text-sm text-maroon hover:bg-soft-gray transition-colors">
									<Upload size={16} />
									{uploading ? "Uploading..." : thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleFileChange(e, true)}
										className="hidden"
										disabled={uploading}
									/>
								</label>
							</div>

							{/* Or use URL */}
							<div className="text-xs text-maroon/60 mb-2">OR</div>
							<input
								type="text"
								value={formData.thumbnail && !formData.thumbnail.startsWith("data:") ? formData.thumbnail : ""}
								onChange={(e) => {
									const url = e.target.value;
									if (url) {
										setFormData({ ...formData, thumbnail: url });
										setThumbnailPreview(url);
									}
								}}
								placeholder="Or paste thumbnail URL here"
								className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Title (optional)</label>
						<input
							type="text"
							value={formData.title}
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							placeholder="Store Interior"
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Description (optional)</label>
						<textarea
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							rows={3}
							placeholder="A brief description of the media"
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Display Order</label>
						<input
							type="number"
							value={formData.order}
							onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
						<p className="text-xs text-maroon/60 mt-1">Lower numbers appear first</p>
					</div>

					<div>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.active}
								onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
								className="rounded border-maroon/20"
							/>
							<span className="text-sm text-maroon">Active (visible on home page)</span>
						</label>
					</div>

					<div className="flex gap-4 pt-4 border-t border-maroon/20 flex-shrink-0">
						<button
							type="submit"
							className="flex-1 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
						>
							{media ? "Update Media" : "Add Media"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
						>
							Cancel
						</button>
					</div>
				</form>
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

export default function AdminPage() {
	return (
		<Suspense fallback={
			<Container className="py-20">
				<div className="text-center text-maroon/60">Loading admin panel...</div>
			</Container>
		}>
			<AdminPageContent />
		</Suspense>
	);
}

