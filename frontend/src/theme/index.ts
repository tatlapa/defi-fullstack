import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#e6f2ff" },
          100: { value: "#baddff" },
          200: { value: "#8dc8ff" },
          300: { value: "#5eb3ff" },
          400: { value: "#3aa0ff" },
          500: { value: "#1a8cff" },
          600: { value: "#0077e6" },
          700: { value: "#0061c2" },
          800: { value: "#004c99" },
          900: { value: "#003870" },
          950: { value: "#002347" },
        },
      },
      fonts: {
        heading: { value: "var(--font-geist-sans), sans-serif" },
        body: { value: "var(--font-geist-sans), sans-serif" },
      },
      radii: {
        card: { value: "12px" },
        button: { value: "8px" },
      },
      shadows: {
        card: { value: "0 2px 8px rgba(0, 0, 0, 0.08)" },
        cardHover: { value: "0 4px 16px rgba(0, 0, 0, 0.12)" },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          solid: { value: "{colors.brand.600}" },
          contrast: { value: "white" },
        },
        bg: {
          canvas: {
            value: { base: "#f8fafc", _dark: "#0f172a" },
          },
          surface: {
            value: { base: "white", _dark: "#1e293b" },
          },
        },
        text: {
          primary: {
            value: { base: "#0f172a", _dark: "#f1f5f9" },
          },
          secondary: {
            value: { base: "#64748b", _dark: "#94a3b8" },
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
