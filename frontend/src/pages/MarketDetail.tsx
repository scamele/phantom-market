import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrencyFromWei,
  formatPercentage,
  formatTimestamp,
  formatTimeLeft,
  shortenAddress,
} from "@/lib/utils";
import {
  fetchMarketById,
  fetchUserPosition,
  placeEncryptedPosition,
} from "@/lib/phantom";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/components/ui/use-toast";

const chartData = [
  { time: "12:00", yes: 0.001, no: 0.001 },
  { time: "15:00", yes: 0.0008, no: 0.0012 },
  { time: "18:00", yes: 0.0009, no: 0.0011 },
  { time: "21:00", yes: 0.0007, no: 0.0013 },
  { time: "00:00", yes: 0.0008, no: 0.0012 },
  { time: "03:00", yes: 0.001, no: 0.001 },
  { time: "06:00", yes: 0.0009, no: 0.0011 },
  { time: "09:00", yes: 0.001, no: 0.001 },
];

const MarketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { account, connect, isConnecting } = useWallet();
  const { toast } = useToast();
  const [selectedSide, setSelectedSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState("");
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const {
    data: market,
    isLoading,
    isError,
    refetch: refetchMarket,
  } = useQuery({
    queryKey: ["market", id],
    queryFn: () => fetchMarketById(id ?? ""),
    enabled: Boolean(id),
    refetchInterval: 15_000,
  });

  const { data: userPosition, refetch: refetchPosition } = useQuery({
    queryKey: ["position", id, account],
    queryFn: () => fetchUserPosition(id ?? "", account ?? ""),
    enabled: Boolean(id && account),
    refetchInterval: 15_000,
  });

  const yesPercent = useMemo(() => {
    if (!market) return 50;
    const yes = Number(formatEther(market.yesPool));
    const no = Number(formatEther(market.noPool));
    const total = yes + no;
    if (total === 0) return 50;
    return (yes / total) * 100;
  }, [market]);

  const noPercent = 100 - yesPercent;
  const totalPool = market ? market.yesPool + market.noPool : 0n;
  const entryFeeLabel = market ? `${Number(formatEther(market.entryFee)).toFixed(4)} ETH` : "-";

  const rulesParagraphs = market?.rules ? market.rules.split(/\n+/).filter(Boolean) : [];

  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");

  const buttonLabel = account
    ? activeTab === "buy"
      ? `Buy ${selectedSide}`
      : "Sell Position"
    : "Connect Wallet";

  const handlePrimaryAction = async () => {
    if (!account) {
      await connect();
      return;
    }

    if (activeTab === "sell") {
      toast({
        title: "Sell flow unavailable",
        description: "Selling positions will be available soon. Thanks for your patience.",
      });
      return;
    }

    if (!market || !id) {
      toast({
        title: "Unable to load market",
        description: "Refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    const shareValue = Number.isFinite(amountNum) && amountNum > 0 ? Math.floor(amountNum) : 1;

    setIsPlacingBet(true);
    toast({
      title: "Encrypting bet",
      description: "Preparing your encrypted stake, please confirm in wallet.",
    });

    try {
      const tx = await placeEncryptedPosition({
        marketId: id,
        voteYes: selectedSide === "YES",
        shareValue,
        entryFee: market.entryFee,
      });

      toast({
        title: "Transaction submitted",
        description: (
          <a
            className="underline"
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View tx {tx.hash.slice(0, 12)}...
          </a>
        ),
      });

      const receipt = await tx.wait();

      toast({
        title: "Bet confirmed",
        description: `Included in block #${receipt.blockNumber}`,
      });

      await Promise.all([refetchMarket(), refetchPosition()]);
      setAmount("");
    } catch (error: any) {
      console.error("Failed to place position:", error);
      toast({
        title: "Bet failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft size={20} />
          <span>Markets</span>
        </button>

        {isError && (
          <div className="bg-destructive/10 border border-destructive rounded-xl p-4 text-sm text-destructive mb-6">
            Unable to load market details. Please verify the market ID exists.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-bullish to-bearish rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {market?.question || "Loading market..."}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      {formatCurrencyFromWei(totalPool)}
                    </span>
                    <span>{market ? `Closes ${formatTimeLeft(market.lockTime)}` : "Loading..."}</span>
                    {market?.oracleURI && (
                      <a
                        className="underline decoration-dotted"
                        href={market.oracleURI}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Oracle
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-foreground">
                    {market ? formatCurrencyFromWei(totalPool, 4) : "$0.00"}
                  </div>
                  <div className="text-sm text-bullish">
                    {market ? formatPercentage(yesPercent) : "--"}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Total Pool Size</p>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-bullish/10 border border-bullish/30 rounded-lg">
                  <div className="w-2 h-2 bg-bullish rounded-full" />
                  <span className="text-sm text-bullish">YES {formatPercentage(yesPercent)}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-bearish/10 border border-bearish/30 rounded-lg">
                  <div className="w-2 h-2 bg-bearish rounded-full" />
                  <span className="text-sm text-bearish">NO {formatPercentage(noPercent)}</span>
                </div>
              </div>

              <Tabs defaultValue="24h" className="mb-6">
                <TabsList className="bg-secondary">
                  <TabsTrigger value="24h">24H</TabsTrigger>
                  <TabsTrigger value="7d">7D</TabsTrigger>
                  <TabsTrigger value="30d">30D</TabsTrigger>
                  <TabsTrigger value="all">ALL</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yes"
                      stroke="hsl(var(--bullish))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="no"
                      stroke="hsl(var(--bearish))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Rules</h2>
              {rulesParagraphs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rules provided for this market yet.</p>
              ) : (
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {rulesParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <Tabs defaultValue="buy" className="mb-6" onValueChange={(value) => setActiveTab(value as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2 bg-secondary">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">{formatPercentage(yesPercent)}</span>
                  <div className="flex-1 mx-3 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-bullish" style={{ width: `${yesPercent}%` }} />
                      <div className="bg-bearish" style={{ width: `${noPercent}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatPercentage(noPercent)}</span>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Pick a side</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedSide === "YES" ? "default" : "outline"}
                      className="border-bullish/50 hover:bg-bullish/10 h-12"
                      onClick={() => setSelectedSide("YES")}
                    >
                      YES
                    </Button>
                    <Button
                      variant={selectedSide === "NO" ? "default" : "outline"}
                      className="border-bearish/50 hover:bg-bearish/10 h-12"
                      onClick={() => setSelectedSide("NO")}
                    >
                      NO
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="bg-secondary border-border h-12 text-lg"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>

                <Button
                  className="w-full h-12 text-base"
                  size="lg"
                  onClick={handlePrimaryAction}
                  disabled={!market || isConnecting || isPlacingBet}
                >
                  {isPlacingBet ? "Processing..." : isConnecting ? "Connecting..." : buttonLabel}
                </Button>

                <div className="space-y-2 pt-4 border-t border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry fee</span>
                    <span className="text-foreground">{entryFeeLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">My stake</span>
                    <span className="text-foreground">
                      {userPosition?.exists ? `${Number(formatEther(userPosition.stake)).toFixed(4)} ETH` : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="text-foreground">0% protocol fee</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max payout</span>
                    <span className="text-foreground">{formatCurrencyFromWei(totalPool)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Timeline</h3>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Creator</p>
                    <p className="text-muted-foreground">
                      {market?.creator ? shortenAddress(market.creator) : "--"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Market closes</p>
                    <p className="text-muted-foreground">
                      {market ? formatTimestamp(market.lockTime) : "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Resolution</p>
                    <p className="text-muted-foreground">
                      {market?.resolved
                        ? `Outcome locked: ${market.outcomeYes ? "YES" : "NO"}`
                        : "Waiting for oracle/resolution"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
