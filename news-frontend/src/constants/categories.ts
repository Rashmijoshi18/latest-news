export interface Country {
  code: string;
  name: string;
}

export interface Category {
  code: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { code: "in", name: "🇮🇳 India" },
  { code: "us", name: "🇺🇸 USA" },
  { code: "gb", name: "🇬🇧 United Kingdom" },
  { code: "au", name: "🇦🇺 Australia" },
  { code: "ca", name: "🇨🇦 Canada" },
  { code: "sg", name: "🇸🇬 Singapore" },
  { code: "ie", name: "🇮🇪 Ireland" },
];

export const CATEGORIES: Category[] = [
  { code: "general", name: "📰 General" },
  { code: "world", name: "🌐 World" },
  { code: "nation", name: "🏙️ Nation" },
  { code: "business", name: "💼 Business" },
  { code: "technology", name: "💻 Technology" },
  { code: "sports", name: "⚽ Sports" },
  { code: "entertainment", name: "🎬 Entertainment" },
  { code: "science", name: "🔬 Science" },
  { code: "health", name: "🏥 Health" },
];
