import { Trophy, Medal, Award, TrendingUp, Flame } from "lucide-react";

const Leaderboard = () => {
  const topTraders = [
    {
      rank: 1,
      address: "0x742d...a9B1",
      name: "CryptoWhale",
      totalBets: 1247,
      winRate: 78.5,
      profit: "+245.8 ETH",
      streak: 12,
    },
    {
      rank: 2,
      address: "0x8f3e...c2D4",
      name: "PredictionMaster",
      totalBets: 1089,
      winRate: 76.2,
      profit: "+198.3 ETH",
      streak: 8,
    },
    {
      rank: 3,
      address: "0x5a1b...f7E9",
      name: "MarketSage",
      totalBets: 892,
      winRate: 74.1,
      profit: "+167.5 ETH",
      streak: 15,
    },
    {
      rank: 4,
      address: "0x9d2c...b4A3",
      name: "FortuneTeller",
      totalBets: 756,
      winRate: 71.8,
      profit: "+134.2 ETH",
      streak: 6,
    },
    {
      rank: 5,
      address: "0x4e7f...d8C1",
      name: "OraclePro",
      totalBets: 634,
      winRate: 69.5,
      profit: "+112.7 ETH",
      streak: 9,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-orange-600" size={24} />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-500";
    if (rank === 3) return "bg-gradient-to-r from-orange-500 to-orange-600";
    return "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top traders on Phantom Market</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-bullish to-bullish/70 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">2,847 ETH</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Traders</p>
                <p className="text-2xl font-bold text-foreground">5,429</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-bearish to-bearish/70 rounded-xl flex items-center justify-center">
                <Flame className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Markets</p>
                <p className="text-2xl font-bold text-foreground">247</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">Top Traders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Total Bets</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Win Rate</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Profit/Loss</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Streak</th>
                </tr>
              </thead>
              <tbody>
                {topTraders.map((trader) => (
                  <tr
                    key={trader.rank}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${getRankBadge(trader.rank)}`}>
                        {getRankIcon(trader.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{trader.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{trader.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground font-medium">{trader.totalBets.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2 max-w-[100px]">
                          <div
                            className="bg-bullish h-2 rounded-full"
                            style={{ width: `${trader.winRate}%` }}
                          />
                        </div>
                        <span className="text-bullish font-semibold">{trader.winRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-bullish font-semibold">{trader.profit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Flame className="text-orange-500" size={16} />
                        <span className="text-foreground font-medium">{trader.streak}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Rankings update every 24 hours. All profits are encrypted using FHE technology.
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
