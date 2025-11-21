import { Calendar, ExternalLink, TrendingUp, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      category: "Platform Update",
      title: "Phantom Market Launches FHE-Powered Private Predictions",
      excerpt: "Revolutionary fully homomorphic encryption technology enables completely private prediction markets on Ethereum Sepolia testnet.",
      date: "2024-11-24",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
      featured: true,
    },
    {
      id: 2,
      category: "Crypto",
      title: "Bitcoin Reaches New All-Time High",
      excerpt: "BTC surpasses $100,000 milestone as institutional adoption continues to accelerate globally.",
      date: "2024-11-23",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&auto=format&fit=crop&q=80",
      featured: false,
    },
    {
      id: 3,
      category: "Technology",
      title: "Understanding FHE: The Future of Privacy",
      excerpt: "A deep dive into Fully Homomorphic Encryption and how it's transforming blockchain privacy.",
      date: "2024-11-22",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
      featured: false,
    },
    {
      id: 4,
      category: "Market Analysis",
      title: "Prediction Markets See 300% Growth in 2024",
      excerpt: "Decentralized prediction markets experience unprecedented growth as users seek alternatives to traditional betting.",
      date: "2024-11-21",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
      featured: false,
    },
    {
      id: 5,
      category: "Sports",
      title: "2026 FIFA World Cup: Early Predictions",
      excerpt: "Analyzing the favorites for the upcoming World Cup tournament based on current form and historical data.",
      date: "2024-11-20",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80",
      featured: false,
    },
    {
      id: 6,
      category: "Economy",
      title: "US GDP Growth Exceeds Expectations",
      excerpt: "Latest economic data shows robust growth in Q4 2024, beating analyst forecasts.",
      date: "2024-11-19",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80",
      featured: false,
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Platform Update": "bg-primary/10 text-primary",
      "Crypto": "bg-orange-500/10 text-orange-500",
      "Technology": "bg-purple-500/10 text-purple-500",
      "Market Analysis": "bg-green-500/10 text-green-500",
      "Sports": "bg-blue-500/10 text-blue-500",
      "Economy": "bg-yellow-500/10 text-yellow-500",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const featuredArticle = newsArticles.find((article) => article.featured);
  const regularArticles = newsArticles.filter((article) => !article.featured);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">News & Updates</h1>
          <p className="text-muted-foreground">Stay informed with the latest market insights</p>
        </div>

        {featuredArticle && (
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-8 hover:border-primary/50 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    <Sparkles size={14} />
                    Featured
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit ${getCategoryColor(featuredArticle.category)}`}>
                  <Newspaper size={14} />
                  {featuredArticle.category}
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {featuredArticle.title}
                </h2>

                <p className="text-muted-foreground mb-6">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(featuredArticle.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <span>{featuredArticle.readTime}</span>
                  </div>

                  <Button variant="outline" className="gap-2">
                    Read More
                    <ExternalLink size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map((article) => (
            <div
              key={article.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="gap-2">
            <TrendingUp size={18} />
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default News;
