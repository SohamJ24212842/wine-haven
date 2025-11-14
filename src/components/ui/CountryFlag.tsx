// Country flag emoji mapping
const countryFlags: Record<string, string> = {
	"France": "🇫🇷",
	"Italy": "🇮🇹",
	"Spain": "🇪🇸",
	"Portugal": "🇵🇹",
	"Germany": "🇩🇪",
	"Argentina": "🇦🇷",
	"Chile": "🇨🇱",
	"Australia": "🇦🇺",
	"New Zealand": "🇳🇿",
	"South Africa": "🇿🇦",
	"United States": "🇺🇸",
	"USA": "🇺🇸",
	"United Kingdom": "🇬🇧",
	"UK": "🇬🇧",
	"Ireland": "🇮🇪",
	"Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
	"Japan": "🇯🇵",
	"Greece": "🇬🇷",
	"Austria": "🇦🇹",
	"Hungary": "🇭🇺",
	"Romania": "🇷🇴",
	"Bulgaria": "🇧🇬",
	"Georgia": "🇬🇪",
	"Turkey": "🇹🇷",
	"Lebanon": "🇱🇧",
	"Israel": "🇮🇱",
	"Mexico": "🇲🇽",
	"Canada": "🇨🇦",
	"Brazil": "🇧🇷",
	"Uruguay": "🇺🇾",
};

type CountryFlagProps = {
	country: string;
	className?: string;
};

export function CountryFlag({ country, className = "" }: CountryFlagProps) {
	const flag = countryFlags[country] || "🌍";
	return <span className={`inline-block ${className}`}>{flag}</span>;
}


