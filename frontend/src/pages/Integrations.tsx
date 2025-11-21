import { Zap, Shield, Code, Link, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Integrations = () => {
  const integrations = [
    {
      name: "Zama fhEVM",
      category: "Privacy",
      description: "Fully homomorphic encryption for on-chain privacy",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      status: "Active",
      docs: "https://docs.zama.ai/fhevm",
      features: ["Encrypted Computations", "Privacy-Preserving", "Zero-Knowledge Proofs"],
    },
    {
      name: "Ethereum Sepolia",
      category: "Blockchain",
      description: "Ethereum testnet for development and testing",
      icon: Link,
      color: "from-blue-500 to-blue-600",
      status: "Active",
      docs: "https://sepolia.etherscan.io",
      features: ["Smart Contracts", "EVM Compatible", "Test Network"],
    },
    {
      name: "MetaMask",
      category: "Wallet",
      description: "Connect your wallet to place encrypted bets",
      icon: Zap,
      color: "from-orange-500 to-orange-600",
      status: "Active",
      docs: "https://metamask.io",
      features: ["Wallet Connection", "Transaction Signing", "Multi-Chain"],
    },
    {
      name: "Ethers.js",
      category: "Development",
      description: "Web3 library for interacting with Ethereum",
      icon: Code,
      color: "from-green-500 to-green-600",
      status: "Active",
      docs: "https://docs.ethers.org",
      features: ["Contract Interaction", "Event Listening", "ENS Support"],
    },
    {
      name: "CoinGecko API",
      category: "Data",
      description: "Real-time cryptocurrency price data",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600",
      status: "Active",
      docs: "https://www.coingecko.com/api",
      features: ["Price Feeds", "Market Data", "Historical Data"],
    },
    {
      name: "The Graph",
      category: "Data",
      description: "Indexing protocol for querying blockchain data",
      icon: Code,
      color: "from-pink-500 to-pink-600",
      status: "Coming Soon",
      docs: "https://thegraph.com/docs",
      features: ["GraphQL API", "Real-time Updates", "Custom Queries"],
    },
  ];

  const developers = [
    {
      title: "Smart Contract",
      description: "Deploy your own prediction markets using our contracts",
      code: `// Deploy a new market
const tx = await contract.createMarket(
  "market-id",
  "Will Bitcoin reach $150K?",
  "Crypto",
  "Market rules...",
  "https://oracle.example.com",
  ethers.parseEther("0.01"),
  30 * 24 * 60 * 60 // 30 days
);`,
    },
    {
      title: "FHE Encryption",
      description: "Encrypt your bets using Zama's FHE technology",
      code: `// Encrypt bet amount
const encrypted = await encryptBetData(
  amount,
  voteYes,
  contractAddress,
  userAddress
);

// Place encrypted position
await contract.placePosition(
  marketId,
  voteYes,
  encrypted.handle,
  encrypted.proof,
  { value: entryFee }
);`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Integrations</h1>
          <p className="text-muted-foreground">Powered by cutting-edge blockchain technology</p>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-bullish/20 border border-primary/30 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-bullish rounded-xl flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Privacy-First Architecture</h2>
              <p className="text-muted-foreground">Built on Zama's FHE technology for complete privacy</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-bullish" size={20} />
                <h3 className="font-semibold text-foreground">Encrypted Bets</h3>
              </div>
              <p className="text-sm text-muted-foreground">All positions are encrypted on-chain</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-bullish" size={20} />
                <h3 className="font-semibold text-foreground">Private Exposure</h3>
              </div>
              <p className="text-sm text-muted-foreground">Market exposure stays confidential</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-bullish" size={20} />
                <h3 className="font-semibold text-foreground">Trustless Settlement</h3>
              </div>
              <p className="text-sm text-muted-foreground">Automated on-chain resolution</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div
                key={integration.name}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    integration.status === "Active"
                      ? "bg-bullish/10 text-bullish"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {integration.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-1">{integration.name}</h3>
                <p className="text-sm text-primary mb-3">{integration.category}</p>
                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                <div className="space-y-2 mb-4">
                  {integration.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="text-bullish" size={14} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={integration.docs} target="_blank" rel="noreferrer">
                    Documentation
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">For Developers</h2>

          <div className="space-y-6">
            {developers.map((dev) => (
              <div key={dev.title} className="border border-border rounded-lg p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{dev.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{dev.description}</p>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-foreground whitespace-pre-wrap">{dev.code}</pre>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              <Code className="mr-2" size={18} />
              View GitHub
            </Button>
            <Button variant="outline">
              Read API Docs
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-bullish/10 to-primary/10 border border-bullish/30 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Want to Integrate?</h2>
          <p className="text-muted-foreground mb-6">
            Build on top of Phantom Market with our developer-friendly APIs
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
