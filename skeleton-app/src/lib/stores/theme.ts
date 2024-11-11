import { writable, get } from "svelte/store";
import { browser } from "$app/environment";
import { updateUserTheme } from "$lib/stores/user";

interface ThemeLabel {
  name: string;
  emoji: string;
}

export const themeLabels: Array<ThemeLabel> = [
  { name: "skeleton", emoji: "💀" },
  { name: "wintry", emoji: "🌨️" },
  { name: "modern", emoji: "🤖" },
  { name: "rocket", emoji: "🚀" },
  { name: "seafoam", emoji: "🧜‍♀️" },
  { name: "vintage", emoji: "📺" },
  { name: "sahara", emoji: "🏜️" },
  { name: "hamlindigo", emoji: "👔" },
  { name: "gold-nouveau", emoji: "💫" },
  { name: "crimson", emoji: "⭕" },
  { name: "custom", emoji: "🎨" },
  { name: "none", emoji: "📝" },
] as const;

export type ThemeName = (typeof themeLabels)[number]["name"];

export interface Theme {
  name: ThemeName;
  dark: boolean;
}

const defaultTheme: Theme = { name: "none", dark: false };
const themeStore = writable<Theme>(defaultTheme);

export function getTheme(): Theme {
  return get(themeStore);
}

export function setTheme(theme: Theme | null): void {
  if (theme !== null) {
    themeStore.set(theme);
    updateUserTheme(theme);
  }

  applyTheme();
}

function applyTheme(): void {
  const theme = getTheme();
  if (browser) {
    document.body.setAttribute("data-theme", theme.name);

    const currentMode = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const mode = theme.dark ? "dark" : "light";
    if (currentMode !== mode) {
      document.documentElement.classList.remove(currentMode);
      document.documentElement.classList.add(mode);
    }
  }
}
