// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//
// - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//   componentTagger (dev-only), VITE_* env injection, @ path alias,
//   React/TanStack dedupe, error logger plugins, and sandbox detection.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Tell Nitro that the production deployment target is Vercel.
  nitro: {
    preset: "vercel",
  },

  tanstackStart: {
    // Use our custom SSR error wrapper.
    server: { entry: "server" },
  },
});