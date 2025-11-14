"use client";
import { useState, useRef, useEffect } from "react";

type SearchableSelectProps = {
	value: string;
	onChange: (value: string) => void;
	options: string[];
	placeholder?: string;
	onAddNew?: (value: string) => void;
	required?: boolean;
};

export function SearchableSelect({
	value,
	onChange,
	options,
	placeholder = "Select...",
	onAddNew,
	required = false,
}: SearchableSelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Filter options based on search query
	const filteredOptions = options.filter((option) =>
		option.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Show "Add New" option if search query doesn't match any option
	const showAddNew = onAddNew && searchQuery.trim() && !filteredOptions.includes(searchQuery.trim());

	// Reset search when dropdown closes
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery("");
			setHighlightedIndex(-1);
		}
	}, [isOpen]);

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) {
			if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
				e.preventDefault();
				setIsOpen(true);
			}
			return;
		}

		const totalOptions = filteredOptions.length + (showAddNew ? 1 : 0);

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setHighlightedIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : prev));
				break;
			case "ArrowUp":
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case "Enter":
				e.preventDefault();
				if (highlightedIndex >= 0) {
					if (highlightedIndex < filteredOptions.length) {
						onChange(filteredOptions[highlightedIndex]);
						setIsOpen(false);
					} else if (showAddNew) {
						onAddNew(searchQuery.trim());
						setIsOpen(false);
					}
				} else if (showAddNew && searchQuery.trim()) {
					onAddNew(searchQuery.trim());
					setIsOpen(false);
				}
				break;
			case "Escape":
				e.preventDefault();
				setIsOpen(false);
				break;
		}
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				inputRef.current &&
				!inputRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative">
			<input
				ref={inputRef}
				type="text"
				value={isOpen ? searchQuery : value}
				onChange={(e) => {
					setSearchQuery(e.target.value);
					if (!isOpen) setIsOpen(true);
				}}
				onFocus={() => {
					setIsOpen(true);
					setSearchQuery(value);
				}}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="w-full rounded-md border border-maroon/20 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
				required={required}
			/>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-maroon/20 bg-white shadow-lg"
				>
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option, index) => (
							<button
								key={option}
								type="button"
								onClick={() => {
									onChange(option);
									setIsOpen(false);
								}}
								className={`w-full px-3 py-2 text-left text-sm hover:bg-soft-gray ${
									index === highlightedIndex ? "bg-soft-gray" : ""
								} ${option === value ? "bg-gold/20 font-semibold" : ""}`}
							>
								{option}
							</button>
						))
					) : (
						<div className="px-3 py-2 text-sm text-maroon/60">No options found</div>
					)}
					{showAddNew && (
						<button
							type="button"
							onClick={() => {
								onAddNew(searchQuery.trim());
								setIsOpen(false);
							}}
							className={`w-full border-t border-maroon/10 px-3 py-2 text-left text-sm text-gold hover:bg-soft-gray ${
								highlightedIndex === filteredOptions.length ? "bg-soft-gray" : ""
							}`}
						>
							+ Add "{searchQuery.trim()}"
						</button>
					)}
				</div>
			)}
		</div>
	);
}



