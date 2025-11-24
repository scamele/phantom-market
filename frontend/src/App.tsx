import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import MarketDetail from "./pages/MarketDetail";
import Leaderboard from "./pages/Leaderboard";
import Earn from "./pages/Earn";
import News from "./pages/News";
import Integrations from "./pages/Integrations";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="myriad-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 ml-64">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/market/:id" element={<MarketDetail />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/earn" element={<Earn />} />
                <Route path="/news" element={<News />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
