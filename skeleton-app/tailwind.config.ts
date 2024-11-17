import { join } from "path";
import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { GrayTheme } from "./src/gray-theme";

enum Theme {
  Skeleton = "skeleton",
  Wintry = "wintry",
  Modern = "modern",
  Rocket = "rocket",
  Seafoam = "seafoam",
  Vintage = "vintage",
  Sahara = "sahara",
  Hamlindigo = "hamlindigo",
  GoldNouveau = "gold-nouveau",
  Crimson = "crimson",
}

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}"),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    typography,
    skeleton({
      themes: {
        preset: Object.values(Theme).map((theme) => ({
          name: theme,
          enhancements: true,
        })),
        custom: [GrayTheme],
      },
    }),
  ],
} satisfies Config;
