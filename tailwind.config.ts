import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  safelist: [
    "fixed","bottom-6","right-6","z-50",
    "h-12","w-12","rounded-full","shadow-lg",
    "bg-red-500","bg-red-600","bg-green-500","bg-green-600",
    "text-white","transition-all","duration-200","flex","items-center","justify-center",
    "active:scale-[.98]","focus:outline-none","focus:ring-2","focus:ring-[var(--accent)]/20"
  ],
} satisfies Config;
