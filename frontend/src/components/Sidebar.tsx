import { Home, BarChart3, Coins, Newspaper, Puzzle, BookOpen } from "lucide-react";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./ThemeToggle";
import { useWallet } from "@/hooks/use-wallet";

const categories = [
  { name: "Crypto", icon: "🪙", markets: "21.1K" },
  { name: "Sports", icon: "⚽", markets: "12.3K" },
  { name: "Politics", icon: "🏛️", markets: "7.8K" },
  { name: "Economy", icon: "📈", markets: "9.2K" },
  { name: "Gaming", icon: "🎮", markets: "1.9K" },
  { name: "Culture", icon: "🎭", markets: "3.6K" },
  { name: "Sentiment", icon: "💭", markets: "5.1K" },
];

export const Sidebar = () => {
  const { account, connect, isConnecting } = useWallet();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">Phantom Market</span>
        </div>

        <nav className="space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Home size={20} />
            <span>Markets</span>
          </NavLink>
          <NavLink
            to="/leaderboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <BarChart3 size={20} />
            <span>Leaderboard</span>
          </NavLink>
          <NavLink
            to="/earn"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Coins size={20} />
            <span>Earn</span>
          </NavLink>
          <NavLink
            to="/news"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Newspaper size={20} />
            <span>News</span>
          </NavLink>
          <NavLink
            to="/integrations"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Puzzle size={20} />
            <span>Integrations</span>
          </NavLink>
          <NavLink
            to="/docs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <BookOpen size={20} />
            <span>Docs</span>
          </NavLink>
        </nav>
      </div>

      <div className="px-6 mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Topics</h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.name}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="flex-1">{category.name}</span>
              <span className="text-xs text-muted-foreground">{category.markets}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <ThemeToggle />
        <div className="bg-gradient-to-br from-primary/20 to-bearish/20 rounded-xl p-4 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-bearish rounded-lg flex items-center justify-center">
              <span className="text-xl">🔒</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Private Trading</p>
              <p className="text-sm font-semibold text-foreground">with FHE</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Trade with encrypted positions</p>
          <button
            className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            onClick={connect}
            disabled={isConnecting || Boolean(account)}
          >
            {isConnecting ? "Connecting..." : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
          </button>
        </div>
      </div>
    </aside>
  );
};
