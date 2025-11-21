import { Coins, Gift, Users, Zap, TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

const Earn = () => {
  const { account, connect, isConnecting } = useWallet();

  const rewards = [
    {
      title: "Trading Rewards",
      icon: TrendingUp,
      description: "Earn 0.1% of your winning bets as PHANTOM tokens",
      apy: "15-25%",
      color: "from-bullish to-bullish/70",
      earned: "142.5 PHANTOM",
      status: "Active",
    },
    {
      title: "Liquidity Mining",
      icon: Coins,
      description: "Provide liquidity to markets and earn fees",
      apy: "20-35%",
      color: "from-primary to-primary/70",
      earned: "89.3 PHANTOM",
      status: "Active",
    },
    {
      title: "Referral Program",
      icon: Users,
      description: "Invite friends and earn 5% of their trading fees",
      apy: "Variable",
      color: "from-bearish to-bearish/70",
      earned: "67.8 PHANTOM",
      status: "Active",
    },
    {
      title: "Staking Rewards",
      icon: Lock,
      description: "Stake PHANTOM tokens to earn protocol fees",
      apy: "12-18%",
      color: "from-purple-500 to-purple-600",
      earned: "0 PHANTOM",
      status: "Coming Soon",
    },
  ];

  const achievements = [
    { name: "First Bet", reward: "10 PHANTOM", unlocked: true },
    { name: "10 Wins Streak", reward: "50 PHANTOM", unlocked: true },
    { name: "100 Markets Traded", reward: "200 PHANTOM", unlocked: false },
    { name: "Top 100 Trader", reward: "500 PHANTOM", unlocked: false },
    { name: "Market Creator", reward: "100 PHANTOM", unlocked: false },
    { name: "1000 ETH Volume", reward: "1000 PHANTOM", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Earn Rewards</h1>
          <p className="text-muted-foreground">Multiple ways to earn PHANTOM tokens</p>
        </div>

        {account ? (
          <div className="bg-gradient-to-br from-primary/20 to-bullish/20 border border-primary/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                <p className="text-4xl font-bold text-foreground">299.6 PHANTOM</p>
                <p className="text-sm text-muted-foreground mt-2">≈ $1,498.00 USD</p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Gift className="mr-2" size={18} />
                  Claim All
                </Button>
                <Button variant="outline">
                  View History
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-bullish rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coins className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Connect Wallet to Earn</h2>
            <p className="text-muted-foreground mb-6">Start earning PHANTOM tokens by connecting your wallet</p>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <div key={reward.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${reward.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">APY</p>
                    <p className="text-xl font-bold text-bullish">{reward.apy}</p>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{reward.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Earned</p>
                    <p className="text-lg font-semibold text-foreground">{reward.earned}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reward.status === "Active"
                      ? "bg-bullish/10 text-bullish"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {reward.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              <span className="text-sm text-muted-foreground">2/6 Unlocked</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? "bg-bullish/5 border-bullish/30"
                    : "bg-muted/30 border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {achievement.name}
                  </h3>
                  {achievement.unlocked && (
                    <div className="w-6 h-6 bg-bullish rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className={`text-sm font-medium ${achievement.unlocked ? "text-bullish" : "text-muted-foreground"}`}>
                  {achievement.reward}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earn;
