import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          charcoal: {
            950: "#121011",
            900: "#1A1718",
            800: "#2B2628",
            700: "#443D40",
            600: "#635B5E",
            500: "#8A8184",
          },
          ivory: {
            50: "#FAF8F5",
            100: "#F5F1EB",
            200: "#EAE3D9",
            300: "#DDD2C3",
          },
          rose: {
            50: "#FDF6F6",
            100: "#F9ECEC",
            200: "#F3D8D9",
            300: "#EAA5A5",
            400: "#DE808E",
            500: "#C95F72",
            600: "#AD4458",
            700: "#8E3244",
          },
          champagne: {
            50: "#FCF9F2",
            100: "#F7F2E4",
            200: "#EEE3C8",
            300: "#DFCDA3",
            400: "#CDB37B",
            500: "#B89A58",
          },
          blush: {
            light: "#FFF1F0",
            DEFAULT: "#FDE2E2",
            dark: "#F8B4B4",
          },
        },
        // PujaHop Kolkata Master Color Tokens
        pujahop: {
          charcoal: "#09090B",
          midnight: "#11111A",
          warmblack: "#171216",
          durgared: "#C62828",
          sindoor: "#E53935",
          orange: "#FF8A3D",
          gold: "#D6A84F",
          softgold: "#F1D28A",
          ivory: "#FFF7E8",
          cream: "#E8DCC8",
          success: "#35C98A",
          warning: "#F4B942",
          danger: "#EF4444",
        },
        // Premium Dark Visual Language Tokens
        dark: {
          primary: "#09090B",
          secondary: "#111114",
          surface: "#151519",
          elevated: "#1B1B21",
          glass: "rgba(255, 255, 255, 0.055)",
          border: "rgba(255, 255, 255, 0.10)",
          text: {
            primary: "#FAF7F8",
            secondary: "#B9B2B7",
            muted: "#817980",
          },
          rose: "#EFA3B5",
          roseHighlight: "#FFB8C8",
          champagne: "#E8C98D",
          blush: "#D98A9F",
          success: "#75D5B0",
          warning: "#E8C98D",
          error: "#F28B9A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        bengali: ["var(--font-bengali)", "Noto Serif Bengali", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(40, 25, 30, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(40, 25, 30, 0.12)",
        "luxury-glow": "0 0 35px -5px rgba(222, 128, 142, 0.25)",
        "champagne-glow": "0 0 30px -5px rgba(205, 179, 123, 0.3)",
        "dark-card": "0 20px 60px rgba(0, 0, 0, 0.28)",
        "dark-elevated": "0 25px 70px rgba(0, 0, 0, 0.45)",
        "dark-glow-rose": "0 0 40px -5px rgba(239, 163, 181, 0.22)",
        "dark-glow-champagne": "0 0 35px -5px rgba(232, 201, 141, 0.18)",
      },
      animation: {
        "scan-line": "scanLine 2.6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "float-slow": "floatSlow 8s ease-in-out infinite",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { transform: "translateY(0%)", opacity: "0.2" },
          "50%": { transform: "translateY(100%)", opacity: "0.9" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-8px) scale(1.02)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
