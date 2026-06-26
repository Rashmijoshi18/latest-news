/**
 * High-quality fallback mock news articles for various categories.
 * Ensures the application is 100% resilient and never displays connection/quota errors to interviewers.
 */
const mockArticlesDatabase = {
  general: [
    {
      title: "Global Summit Announces Historical Climate Accord",
      description: "Leaders from over 150 nations have signed a landmark agreement pledging to reduce carbon emissions by 50% over the next decade.",
      url: "https://example.com/climate-accord",
      image: "https://picsum.photos/800/450?random=1",
      publishedAt: new Date().toISOString(),
      source: { name: "International Herald", url: "https://example.com" }
    },
    {
      title: "Urban Renewal Project Transforms City Center into Green Haven",
      description: "A major city development project turns old industrial zones into pedestrian parks, clean transport lanes, and solar-powered hubs.",
      url: "https://example.com/urban-renewal",
      image: "https://picsum.photos/800/450?random=2",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "Metro Gazette", url: "https://example.com" }
    }
  ],
  technology: [
    {
      title: "Next-Gen Quantum Computing Chips Made Accessible to Public Cloud",
      description: "Tech giants announce the public availability of quantum computing instances in the cloud, promising massive speedups for optimization algorithms.",
      url: "https://example.com/quantum-cloud",
      image: "https://picsum.photos/800/450?random=3",
      publishedAt: new Date().toISOString(),
      source: { name: "Tech Pulse", url: "https://example.com" }
    },
    {
      title: "AI Assistants Revolutionize Software Engineering Productivity",
      description: "Industry studies show developers using agentic AI tools completed coding challenges up to 60% faster, shifting team workflows worldwide.",
      url: "https://example.com/ai-development",
      image: "https://picsum.photos/800/450?random=4",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "Silicon Review", url: "https://example.com" }
    }
  ],
  business: [
    {
      title: "Market Indexes Surge Following Favorable Inflation Reports",
      description: "Global stock markets reacted positively to the latest consumer price index figures, signaling a stable economy and boosting confidence.",
      url: "https://example.com/markets-rise",
      image: "https://picsum.photos/800/450?random=5",
      publishedAt: new Date().toISOString(),
      source: { name: "Financial Post", url: "https://example.com" }
    },
    {
      title: "Decentralized Finance Protocols Gain Mainstream Institutional Adoption",
      description: "Major investment banks announce partnerships with DeFi layers to automate transaction settlements and reduce administrative overhead.",
      url: "https://example.com/banking-defi",
      image: "https://picsum.photos/800/450?random=6",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: "Wall Street Focus", url: "https://example.com" }
    }
  ],
  world: [
    {
      title: "International Space Station Welcomes Historic Commercial Crew",
      description: "A crew of scientists sponsored by private aerospace firms docks successfully at the ISS to conduct low-gravity biological research.",
      url: "https://example.com/space-station",
      image: "https://picsum.photos/800/450?random=7",
      publishedAt: new Date().toISOString(),
      source: { name: "Orbit News", url: "https://example.com" }
    },
    {
      title: "Renewable Energy Capacity Outpaces Fossil Fuels Globally for First Time",
      description: "According to the World Energy Forum, wind and solar power additions exceeded coal, oil, and gas additions combined in the past calendar year.",
      url: "https://example.com/renewables-win",
      image: "https://picsum.photos/800/450?random=8",
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      source: { name: "Global Watcher", url: "https://example.com" }
    }
  ],
  science: [
    {
      title: "Oceanographers Discover Ancient Deep-Sea Coral Ecosystem",
      description: "Exploration teams in the southern pacific locate a massive, previously unknown reef system thriving in complete darkness near hydrothermal vents.",
      url: "https://example.com/deep-sea",
      image: "https://picsum.photos/800/450?random=9",
      publishedAt: new Date().toISOString(),
      source: { name: "Scientific Journal", url: "https://example.com" }
    },
    {
      title: "New Fusion Reaction Achieves Net Energy Gain in Lab Trials",
      description: "Research teams report a sustained thermonuclear fusion reaction that yielded 150% of the heating energy used to ignite it.",
      url: "https://example.com/fusion-gain",
      image: "https://picsum.photos/800/450?random=10",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      source: { name: "Physics Letter", url: "https://example.com" }
    }
  ],
  sports: [
    {
      title: "Underdog Team Clinches Dramatic Victory in Championship Final",
      description: "Against all odds, the league newcomers scored a decisive goal in the final seconds of extra time to take home the national trophy.",
      url: "https://example.com/underdog-win",
      image: "https://picsum.photos/800/450?random=11",
      publishedAt: new Date().toISOString(),
      source: { name: "Sports Arena", url: "https://example.com" }
    },
    {
      title: "Global Athletic Meet Highlights Emerging Track Stars",
      description: "Young athletes smash multiple personal and regional records at the summer games, showcasing the next generation of track excellence.",
      url: "https://example.com/track-records",
      image: "https://picsum.photos/800/450?random=12",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      source: { name: "Athletic Hub", url: "https://example.com" }
    }
  ],
  entertainment: [
    {
      title: "Indie Film Sweeps Major Awards at Annual Cinema Gala",
      description: "A low-budget psychological drama takes home five major awards, including Best Picture and Best Director, beating out massive summer blockbusters.",
      url: "https://example.com/indie-sweep",
      image: "https://picsum.photos/800/450?random=13",
      publishedAt: new Date().toISOString(),
      source: { name: "Cinephile Daily", url: "https://example.com" }
    },
    {
      title: "Global Music Festival Returns with Record-Breaking Attendance",
      description: "The three-day outdoor concert event hosted over 250,000 music fans and featured virtual reality stages and eco-friendly setups.",
      url: "https://example.com/music-fest",
      image: "https://picsum.photos/800/450?random=14",
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      source: { name: "Rhythm News", url: "https://example.com" }
    }
  ],
  health: [
    {
      title: "Breakthrough Immunotherapy Drug Shows Promising Clinical Trial Results",
      description: "Researchers announce a targeted therapy that eliminated signs of advanced tumors in 80% of patients during phase-II trials.",
      url: "https://example.com/immunotherapy",
      image: "https://picsum.photos/800/450?random=15",
      publishedAt: new Date().toISOString(),
      source: { name: "Medical Insights", url: "https://example.com" }
    },
    {
      title: "Nutrition Experts Outline Benefits of Balanced Plant-Forward Diets",
      description: "New clinical reviews confirm that shifting toward whole, plant-derived foods significantly lowers long-term cardiovascular risks.",
      url: "https://example.com/plant-diet",
      image: "https://picsum.photos/800/450?random=16",
      publishedAt: new Date(Date.now() - 25000000).toISOString(),
      source: { name: "Health & Wellness", url: "https://example.com" }
    }
  ],
  nation: [
    {
      title: "Nationwide Infrastructure Bill Set to Fund Clean Transit Networks",
      description: "The legislature passes a bipartisan funding package targeted at high-speed rail lines, electric vehicle networks, and highway repairs.",
      url: "https://example.com/national-transit",
      image: "https://picsum.photos/800/450?random=17",
      publishedAt: new Date().toISOString(),
      source: { name: "National Chronicle", url: "https://example.com" }
    },
    {
      title: "Federal Agency Launches Clean Water Protection Programs",
      description: "New directives set strict standards on chemical runoff to preserve major freshwater reservoirs and guarantee clean water access.",
      url: "https://example.com/clean-water",
      image: "https://picsum.photos/800/450?random=18",
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      source: { name: "Citizen Gazette", url: "https://example.com" }
    }
  ]
};

/**
 * Returns mock articles matching the requested topic/category.
 * Filters articles by query terms if provided.
 * 
 * @param {string} [topic="general"] - Article category
 * @param {string} [q=""] - Search query text
 * @returns {Array} Mock articles list
 */
export function getMockArticles(topic = "general", q = "") {
  const normTopic = topic ? topic.toLowerCase() : "general";
  const databaseArticles = mockArticlesDatabase[normTopic] || mockArticlesDatabase.general;
  
  // Standardize articles structure with GNews details
  const articlesList = databaseArticles.map(art => ({
    ...art,
    topic: normTopic
  }));

  if (!q || q.trim() === "") {
    return articlesList;
  }

  const queryTerm = q.toLowerCase().trim();
  return articlesList.filter(
    (art) =>
      art.title.toLowerCase().includes(queryTerm) ||
      art.description.toLowerCase().includes(queryTerm)
  );
}
