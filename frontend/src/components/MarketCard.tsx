import { TrendingUp, Users, Clock, Bitcoin, TrendingDown, Trophy, DollarSign, Cpu, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface MarketCardProps {
  id: string;
  title: string;
  yesPercentage: number;
  noPercentage: number;
  yesOption?: string;
  noOption?: string;
  participants?: string;
  volume?: string;
  timeLeft?: string;
}

const getMarketVisuals = (id: string, title: string) => {
  const lowerTitle = title.toLowerCase();
  const lowerId = id.toLowerCase();

  // Bitcoin related
  if (lowerTitle.includes('bitcoin') || lowerTitle.includes('btc')) {
    return {
      gradient: 'from-orange-500 via-yellow-500 to-orange-600',
      Icon: Bitcoin,
      iconColor: 'text-white'
    };
  }

  // Ethereum related
  if (lowerTitle.includes('ethereum') || lowerTitle.includes('eth')) {
    return {
      gradient: 'from-purple-500 via-indigo-500 to-purple-600',
      Icon: TrendingUp,
      iconColor: 'text-white'
    };
  }

  // Sports related
  if (lowerTitle.includes('world cup') || lowerTitle.includes('brazil') || lowerTitle.includes('sport')) {
    return {
      gradient: 'from-green-500 via-emerald-500 to-green-600',
      Icon: Trophy,
      iconColor: 'text-white'
    };
  }

  // Economy/GDP related
  if (lowerTitle.includes('gdp') || lowerTitle.includes('economy') || lowerTitle.includes('growth')) {
    return {
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      Icon: DollarSign,
      iconColor: 'text-white'
    };
  }

  // AI/Tech related
  if (lowerTitle.includes('openai') || lowerTitle.includes('gpt') || lowerTitle.includes('ai')) {
    return {
      gradient: 'from-pink-500 via-rose-500 to-pink-600',
      Icon: Cpu,
      iconColor: 'text-white'
    };
  }

  // Tesla/Vehicles related
  if (lowerTitle.includes('tesla') || lowerTitle.includes('vehicle') || lowerTitle.includes('deliver')) {
    return {
      gradient: 'from-red-500 via-orange-500 to-red-600',
      Icon: Zap,
      iconColor: 'text-white'
    };
  }

  // Default
  return {
    gradient: 'from-gray-500 via-slate-500 to-gray-600',
    Icon: TrendingDown,
    iconColor: 'text-white'
  };
};

export const MarketCard = ({
  id,
  title,
  yesPercentage,
  noPercentage,
  yesOption,
  noOption,
  participants = "--",
  volume = "$0.00",
  timeLeft = "Open",
}: MarketCardProps) => {
  const navigate = useNavigate();
  const { gradient, Icon, iconColor } = getMarketVisuals(id, title);

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
      onClick={() => navigate(`/market/${id}`)}
    >
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`w-24 h-24 ${iconColor} opacity-30`} strokeWidth={1.5} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2">{title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div className="flex h-full">
              <div
                className="bg-bullish transition-all"
                style={{ width: `${yesPercentage}%` }}
              />
              <div
                className="bg-bearish transition-all"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground">{yesPercentage}%</span>
          <span className="text-xs text-muted-foreground">{noPercentage}%</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button
            variant="outline"
            className="border-bullish/50 text-bullish hover:bg-bullish/10"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {yesOption || "YES"}
          </Button>
          <Button
            variant="outline"
            className="border-bearish/50 text-bearish hover:bg-bearish/10"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {noOption || "NO"}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{participants}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>{volume}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
