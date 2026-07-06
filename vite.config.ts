import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the production build also works when served from a
  // sub-path (e.g. a static host / project sub-site).
  base: "./",
  server: {
    // 5190 keeps Assist Intelligence clear of its sibling projects:
    // dogan 5173, samal 5185, gobeklitepe 5186, colleqtor 5188,
    // third-brain 5189 -> assist-intelligence 5190.
    // strictPort so it always binds exactly 5190 (fails loudly instead of
    // silently hopping to the next free port).
    port: 5190,
    strictPort: true,
    open: false,
  },
  preview: {
    port: 5190,
    strictPort: true,
  },
});
