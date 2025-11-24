import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { Search } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchMarkets } from "@/lib/phantom";
import { formatCurrencyFromWei, formatTimeLeft } from "@/lib/utils";

const categories = [
  { name: "Crypto", color: "from-pink-500 to-pink-600" },
  { name: "Sports", color: "from-orange-500 to-orange-600" },
  { name: "Politics", color: "from-purple-500 to-purple-600" },
  { name: "Economy", color: "from-green-500 to-green-600" },
  { name: "Gaming", color: "from-yellow-500 to-yellow-600" },
  { name: "Culture", color: "from-red-500 to-red-600" },
  { name: "Sentiment", color: "from-orange-400 to-orange-500" },
];

const Markets = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
    staleTime: 15_000,
  });

  const marketCards = useMemo(() => {
    if (!data) return [];
    return data.map((market) => {
      const yes = Number(formatEther(market.yesPool));
      const no = Number(formatEther(market.noPool));
      const total = yes + no;

      const yesPct = total > 0 ? (yes / total) * 100 : 50;
      const noPct = 100 - yesPct;

      return {
        id: market.id,
        title: market.question,
        yesPercentage: Number.isFinite(yesPct) ? yesPct : 50,
        noPercentage: Number.isFinite(noPct) ? noPct : 50,
        participants: market.resolved ? "Resolved" : "Active",
        volume: formatCurrencyFromWei(market.yesPool + market.noPool),
        timeLeft: formatTimeLeft(market.lockTime),
      };
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search Phantom Market"
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
            <Button className="ml-4" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`bg-gradient-to-br ${category.color} rounded-xl px-6 py-8 min-w-[140px] hover:scale-105 transition-transform`}
            >
              <span className="text-white font-semibold">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search markets"
              className="pl-10 bg-secondary border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-secondary">
              Newest
            </Button>
            <Button variant="ghost" size="sm">
              Volume
            </Button>
            <Button variant="ghost" size="sm">
              Trending
            </Button>
            <Button variant="ghost" size="sm">
              Ending
            </Button>
            <Button variant="ghost" size="sm">
              Open
            </Button>
            <Button variant="ghost" size="sm">
              All Tokens
            </Button>
          </div>
        </div>

        {isError && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-sm text-destructive mb-6">
            Unable to load market data from blockchain. Please check contract address and RPC settings.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-72 rounded-xl bg-muted animate-pulse" />
            ))}

          {!isLoading && marketCards.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
              No markets available at the moment. Please try again later.
            </div>
          )}

          {marketCards.map((market) => (
            <MarketCard key={market.id} {...market} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Markets;
