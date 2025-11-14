"use client";
import { useState, useEffect, Suspense } from "react";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/typography/SectionHeading";
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, Star, Sparkles, LayoutDashboard, Package, ShoppingCart, Settings, Search, Filter, Upload, X, Gift } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchableSelect } from "@/components/admin/SearchableSelect";

const ADMIN_PASSWORD = "winehaven2024"; // Change this in production!

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
	const [activeSection, setActiveSection] = useState<"products" | "gifts">(
		searchParams.get("section") === "gifts" ? "gifts" : "products"
	);

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
		}
	}, [isAuthenticated]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/products");
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

			{/* Search and Filter Bar */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-maroon/40" size={18} />
					<input
						type="text"
						placeholder="Search products by name, country, region..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-md border border-maroon/20 bg-white text-sm outline-none focus:border-gold"
					/>
				</div>
				<div className="flex gap-2">
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
							<button
								onClick={async () => {
									const count = selectedProducts.size;
									if (confirm(`Mark ${count} selected product(s) as featured?`)) {
										try {
											const promises = Array.from(selectedProducts).map(async (slug) => {
												const product = productsList.find((p) => p.slug === slug);
												if (!product) return;
												const response = await fetch(`/api/products/${slug}`, {
													method: "PUT",
													headers: { "Content-Type": "application/json" },
													body: JSON.stringify({ ...product, featured: true }),
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
											alert(`Successfully marked ${selectedCount} product(s) as featured!`);
										} catch (error: any) {
											alert(`Failed to update products: ${error.message}`);
											console.error(error);
											fetchProducts();
										}
									}
								}}
								className="flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-maroon hover:brightness-95 transition-colors"
							>
								<Star size={16} />
								Mark as Featured ({selectedProducts.size})
							</button>
							<button
								onClick={() => setSelectedProducts(new Set())}
								className="flex items-center gap-2 rounded-md border border-maroon/20 bg-white px-4 py-2 text-sm text-maroon hover:bg-soft-gray transition-colors"
							>
								Clear Selection
							</button>
						</>
					)}
					<button
						onClick={async () => {
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

			{/* Product List */}
			{loading ? (
				<div className="text-center py-12 text-maroon/60">Loading products...</div>
			) : (() => {
				// Filter products
				const filteredProducts = productsList.filter((product) => {
					// Filter by section (gifts vs products)
					if (activeSection === "gifts" && !product.christmasGift) return false;
					
					const matchesSearch = !searchQuery || 
						product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						product.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						product.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
						product.description?.toLowerCase().includes(searchQuery.toLowerCase());
					
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
			})()}

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
		onSave(formData as Product);
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
							<label className="block text-sm font-medium text-maroon mb-1">Slug *</label>
							<input
								type="text"
								value={formData.slug || ""}
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

					<div>
						<label className="block text-sm font-medium text-maroon mb-1">Description</label>
						<textarea
							value={formData.description || ""}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							rows={3}
							className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-maroon mb-1">Country</label>
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

					{/* ABV and Volume */}
					<div className="grid grid-cols-2 gap-4">
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
								type="number"
								min="0"
								value={formData.volumeMl || ""}
								onChange={(e) => setFormData({ ...formData, volumeMl: e.target.value ? parseInt(e.target.value) : undefined })}
								placeholder="e.g., 750"
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
							type="url"
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

