import type { Metadata } from "next";
import { Azeret_Mono, Chakra_Petch, Zen_Old_Mincho } from "next/font/google";
import "./globals.css";

const azeretMono = Azeret_Mono({
  variable: "--font-azeret-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-mincho",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nexus Quant Terminal — Neo Mirai Edition",
  description: "High-density quantitative financial trading terminal with live news analytics and TradeLocker execution",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${azeretMono.variable} ${chakraPetch.variable} ${zenOldMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050811] text-[#E2E8F0] font-neo-mono selection:bg-[#00F5D4] selection:text-[#050811]">
        {children}
      </body>
    </html>
  );
}
