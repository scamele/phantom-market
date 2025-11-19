import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors w-full"
    >
      {theme === "light" ? (
        <>
          <Moon size={20} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={20} />
          <span>Light Mode</span>
        </>
      )}
    </button>
  );
}
