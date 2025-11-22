import { Play, Shield, Lock, Coins, TrendingUp, Users, CheckCircle, Info, Book, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Docs = () => {
  const howItWorks = [
    {
      step: 1,
      title: "Connect Your Wallet",
      description: "Connect MetaMask or any Web3 wallet to get started. Make sure you're on Ethereum Sepolia testnet.",
      icon: Lock,
    },
    {
      step: 2,
      title: "Browse Markets",
      description: "Explore prediction markets across various categories: Crypto, Sports, Politics, Economy, and more.",
      icon: TrendingUp,
    },
    {
      step: 3,
      title: "Place Your Bet",
      description: "Choose YES or NO, enter your stake amount. Your position will be encrypted using FHE technology.",
      icon: Shield,
    },
    {
      step: 4,
      title: "Wait for Resolution",
      description: "Once the market closes, the creator resolves the outcome based on oracle data.",
      icon: Zap,
    },
    {
      step: 5,
      title: "Claim Rewards",
      description: "If you predicted correctly, claim your share of the total pool. All payouts are automatic.",
      icon: Coins,
    },
  ];

  const features = [
    {
      title: "Fully Encrypted Positions",
      description: "Your bets are encrypted on-chain using Zama's FHE technology. No one can see your position until market resolution.",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Binary Prediction Markets",
      description: "Simple YES/NO markets on any topic. Easy to understand, easy to participate.",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Curated Markets",
      description: "Markets are carefully created and managed by trusted operators to ensure quality and fair resolution.",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Fair Payouts",
      description: "Winners split the total pool equally. No house edge, no hidden fees.",
      icon: Coins,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  const faq = [
    {
      question: "What is FHE and why does it matter?",
      answer: "Fully Homomorphic Encryption (FHE) allows computations on encrypted data without revealing the underlying information. In Phantom Market, this means your bets remain completely private until the market resolves, preventing front-running and market manipulation.",
    },
    {
      question: "How are markets resolved?",
      answer: "Market creators are responsible for resolving outcomes based on oracle data (e.g., CoinGecko for crypto prices, FIFA.com for sports results). The creator must enable exposure reveal, then submit the final outcome (YES or NO).",
    },
    {
      question: "What happens if I win?",
      answer: "Winners split the total pool (YES pool + NO pool) equally among all winning positions. For example, if the total pool is 10 ETH and there are 5 winners, each winner receives 2 ETH.",
    },
    {
      question: "Can I change my position?",
      answer: "Yes! You can adjust your position at any time before the market locks using the adjustPosition function. Your new encrypted position will replace the old one.",
    },
    {
      question: "What if a market is cancelled?",
      answer: "If a market is cancelled by the creator, all participants receive a full refund of their entry fee. No one wins or loses.",
    },
    {
      question: "Are there any fees?",
      answer: "Phantom Market has 0% protocol fees. You only pay the entry fee set by the market creator, and gas fees for transactions.",
    },
  ];

  const marketLifecycle = [
    {
      phase: "Creation",
      description: "Anyone creates a market with a question, category, rules, entry fee, and duration (1 hour to 30 days).",
      status: "active",
    },
    {
      phase: "Trading",
      description: "Users place encrypted YES/NO positions by paying the entry fee. Positions accumulate in separate pools.",
      status: "active",
    },
    {
      phase: "Lock",
      description: "After the duration expires, the market locks. No more positions can be placed or adjusted.",
      status: "active",
    },
    {
      phase: "Exposure Reveal",
      description: "Creator enables public decryptability of YES/NO exposure totals for transparency (optional step).",
      status: "active",
    },
    {
      phase: "Resolution",
      description: "Creator submits the final outcome (YES or NO) based on real-world oracle data.",
      status: "active",
    },
    {
      phase: "Payout",
      description: "Winners claim their proportional share of the total pool. Losers receive nothing.",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Documentation</h1>
          <p className="text-muted-foreground">Learn how Phantom Market works</p>
        </div>

        {/* Demo Video Section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
          <div className="aspect-video bg-black relative">
            <video
              controls
              className="w-full h-full"
              poster="/bet_demo.mp4"
            >
              <source src="/bet_demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Getting Started with Phantom Market</h3>
                <p className="text-sm text-muted-foreground">Watch how to place encrypted bets on prediction markets</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Play size={16} />
                <span>Demo Video</span>
              </div>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-primary/10 to-bullish/10 border border-primary/30 rounded-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-bullish rounded-xl flex items-center justify-center flex-shrink-0">
              <Book className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">What is Phantom Market?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Phantom Market is a decentralized prediction market platform built on Ethereum Sepolia testnet,
                powered by Zama's Fully Homomorphic Encryption (FHE) technology. Users can create and participate
                in binary (YES/NO) markets on any topic while keeping their positions completely private.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Unlike traditional prediction markets where all bets are public, Phantom Market encrypts every
                position on-chain, preventing front-running, market manipulation, and privacy leaks. Your bets
                remain confidential until the market resolves.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">How It Works</h2>
          <div className="space-y-4">
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-card border border-border rounded-xl p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Market Lifecycle */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Market Lifecycle</h2>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-6">
              {marketLifecycle.map((phase, index) => (
                <div key={phase.phase} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary-foreground ${
                      phase.status === "active" ? "bg-primary" : "bg-muted"
                    }`}>
                      {index + 1}
                    </div>
                    {index < marketLifecycle.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{phase.phase}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="text-primary flex-shrink-0 mt-1" size={20} />
                  <h3 className="text-lg font-bold text-foreground">{item.question}</h3>
                </div>
                <p className="text-muted-foreground pl-8">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Info className="text-yellow-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Important Notes</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>This is a testnet deployment on Ethereum Sepolia. Do not use real funds.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>You need Sepolia ETH to participate. Get free test ETH from a Sepolia faucet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>Market creators are responsible for accurate resolution. Choose markets with trusted creators.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={16} />
                  <span>All positions are final once the market locks. Plan your bets carefully.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-primary/20 to-bullish/20 border border-primary/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Start?</h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet and explore prediction markets with complete privacy
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <a href="/">Browse Markets</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/integrations">View Documentation</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
