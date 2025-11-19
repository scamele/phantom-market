const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x47A51b25bB93072514798bC4432a4d83aa052a79";
const THIRTY_DAYS = 30 * 24 * 60 * 60; // 30 days in seconds

const markets = [
  {
    marketId: "btc-100k-2024",
    question: "Will Bitcoin reach $100,000 before December 31, 2024?",
    category: "Crypto",
    rules: "Market resolves YES if Bitcoin (BTC/USD) reaches or exceeds $100,000 on any major exchange (Binance, Coinbase, Kraken) before December 31, 2024, 23:59:59 UTC. Market resolves NO if this price target is not reached by the deadline. Price will be verified using CoinGecko API as the primary oracle source.",
    oracleURI: "https://www.coingecko.com/en/coins/bitcoin",
    entryFee: "0.01"
  },
  {
    marketId: "eth-5k-2024",
    question: "Will Ethereum surpass $5,000 in December 2024?",
    category: "Crypto",
    rules: "Market resolves YES if Ethereum (ETH/USD) reaches or exceeds $5,000 on any major exchange (Binance, Coinbase, Kraken) during December 2024. Market resolves NO if ETH does not reach $5,000 by December 31, 2024, 23:59:59 UTC. Price verification via CoinGecko API.",
    oracleURI: "https://www.coingecko.com/en/coins/ethereum",
    entryFee: "0.01"
  },
  {
    marketId: "world-cup-2026-winner",
    question: "Will Brazil win the 2026 FIFA World Cup?",
    category: "Sports",
    rules: "Market resolves YES if Brazil wins the 2026 FIFA World Cup final match. Market resolves NO if any other team wins. If the tournament is cancelled or Brazil does not participate, market resolves NO. Official FIFA announcements will be used as the oracle source.",
    oracleURI: "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026",
    entryFee: "0.005"
  },
  {
    marketId: "us-gdp-growth-2024",
    question: "Will US GDP growth exceed 3% in Q4 2024?",
    category: "Economy",
    rules: "Market resolves YES if the United States real GDP growth rate for Q4 2024 (year-over-year) exceeds 3.0% according to the official Bureau of Economic Analysis (BEA) advance estimate. Market resolves NO if the growth rate is 3.0% or below. The BEA's first official release will be used as the oracle source.",
    oracleURI: "https://www.bea.gov/data/gdp/gross-domestic-product",
    entryFee: "0.008"
  },
  {
    marketId: "ai-breakthrough-2024",
    question: "Will OpenAI release GPT-5 before 2025?",
    category: "Gaming",
    rules: "Market resolves YES if OpenAI officially announces and releases a model explicitly named 'GPT-5' or 'GPT-5.0' before January 1, 2025, 00:00:00 UTC. Market resolves NO if no such announcement is made by the deadline. Beta releases and preview versions count as official releases. OpenAI's official blog and press releases will serve as the oracle source.",
    oracleURI: "https://openai.com/blog",
    entryFee: "0.01"
  },
  {
    marketId: "tesla-delivery-q4-2024",
    question: "Will Tesla deliver over 500,000 vehicles in Q4 2024?",
    category: "Economy",
    rules: "Market resolves YES if Tesla's official Q4 2024 delivery report shows total vehicle deliveries exceeding 500,000 units. Market resolves NO if deliveries are 500,000 or below. Tesla's official investor relations announcements will be used as the oracle source.",
    oracleURI: "https://ir.tesla.com/",
    entryFee: "0.007"
  }
];

async function main() {
  console.log("Creating prediction markets on PhantomRelayLeague...\n");
  console.log("Contract Address:", CONTRACT_ADDRESS);

  const PhantomRelayLeague = await hre.ethers.getContractFactory("PhantomRelayLeague");
  const contract = PhantomRelayLeague.attach(CONTRACT_ADDRESS);

  console.log("\nCreating markets...\n");

  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const entryFeeWei = hre.ethers.parseEther(market.entryFee);

    try {
      console.log(`[${i + 1}/${markets.length}] Creating: ${market.question}`);
      console.log(`   Category: ${market.category}`);
      console.log(`   Entry Fee: ${market.entryFee} ETH`);
      console.log(`   Duration: 30 days`);

      const tx = await contract.createMarket(
        market.marketId,
        market.question,
        market.category,
        market.rules,
        market.oracleURI,
        entryFeeWei,
        THIRTY_DAYS
      );

      console.log(`   Transaction: ${tx.hash}`);
      await tx.wait();
      console.log(`   ✅ Market created successfully\n`);
    } catch (error) {
      console.error(`   ❌ Failed to create market: ${error.message}\n`);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`Total markets created: ${markets.length}`);
  console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
  console.log("\n✅ All markets created successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
