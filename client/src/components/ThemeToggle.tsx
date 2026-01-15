import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/App";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-11 h-11 sm:w-10 sm:h-10 bg-secondary hover:bg-accent transition-all"
      data-testid="button-theme-toggle"
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {resolvedTheme === "dark" ? (
          <Moon className="w-5 h-5 text-foreground" />
        ) : (
          <Sun className="w-5 h-5 text-foreground" />
        )}
      </motion.div>
    </Button>
  );
}
