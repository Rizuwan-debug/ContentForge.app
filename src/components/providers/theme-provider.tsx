
"use client"

import type { FC, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "system",
  storageKey = "contentforge-theme",
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme; // SSR default
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
        return storedTheme;
      }
    } catch (e) {
      // In case localStorage is unavailable (e.g., private browsing, cookies disabled)
      console.warn(`Failed to get theme from localStorage ('${storageKey}'):`, e);
    }
    return defaultTheme; // Fallback to defaultTheme
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    
    // Determine the theme to apply
    let themeToApply = theme;
    if (theme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Apply the theme class
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]); // This runs when theme state changes (user selection or initial load on client)

  // This effect handles live system theme changes if 'system' is selected
  useEffect(() => {
    if (typeof window === "undefined" || theme !== 'system') {
      return; // Only active if set to 'system' and on client
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) { // System prefers dark
        root.classList.add("dark");
      } else { // System prefers light
        root.classList.remove("dark");
      }
    };
    
    // Ensure initial state for system theme is applied correctly
    // The first useEffect handles the initial state based on `theme`,
    // so this listener is for subsequent OS changes.
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]); // Re-setup listener if theme changes to/from 'system'

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch (e) {
          console.warn(`Failed to save theme to localStorage ('${storageKey}'):`, e);
        }
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
