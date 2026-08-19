# Neo-Mirai Quantitative Terminal Design System

> **Style Standard**: Inspired by Impeccable Neo-Mirai design principles (Tokyo 2042 HUD & Cyberpunk Financial Matrix). High information density, obsidian glass surfaces, laser emerald/rose indicators, and sharp HUD brackets.

---

## 🎨 Color Tokens

| Token Name | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Obsidian Void (Base)** | `#050811` | Primary terminal root background |
| **Surface Dark Panel** | `#090E1C` | Secondary container & modular panels |
| **Surface Elevated Panel** | `#0F172A` | Interactive inputs, modals, & header bars |
| **Hairline Border** | `rgba(56, 189, 248, 0.12)` | Subtle technical panel dividers |
| **Hover Glow Border** | `rgba(0, 245, 212, 0.35)` | Active hover focus & selected states |
| **Laser Emerald (Bullish)**| `#00FF9D` | BUY signals, positive PnL, profit targets |
| **Cyber Rose (Bearish)** | `#FF2A6D` | SELL signals, negative PnL, stop loss |
| **Electric Cyan (Accent)** | `#00F5D4` | Brand highlights, active tabs, HUD indicators |
| **Signal Amber (Warning)** | `#FFB800` | High-impact fundamental news, volatility alerts |
| **Text Primary** | `#E2E8F0` | Primary numerical & technical text |
| **Text Muted** | `#64748B` | Secondary metrics, timestamps, labels |

> ⚠️ **Strict Rule**: Pure `#000000` and pure `#ffffff` are strictly prohibited across all components to maintain authentic high-contrast OLED dark aesthetics.

---

## 📐 Typography & Micro Badges

- **Font Family**:
  - Technical Monospace: `var(--font-azeret-mono)` / `Azeret Mono`, `monospace` with `tabular-nums`.
  - Cyber Display: `var(--font-chakra-petch)` / `Chakra Petch`, `sans-serif`.
  - Kanji Accent: `var(--font-zen-mincho)` / `Zen Old Mincho`, `serif`.

- **HUD Status Indicators**:
  - `[SYS::ONLINE]` — System status active
  - `[FEED::REALTIME]` — WebSocket real-time market stream active
  - `// SMC MATRIX` — Smart Money Concepts engine indicator
  - `// QUANT RADAR` — Mathematical Z-Score & Volatility metrics

---

## ❌ Anti-Patterns to Avoid

1. **No rounded bubbly cards**: Border radius must remain `<= 4px` (`rounded-[3px]` or sharp HUD corners).
2. **No plain default colors**: Never use generic green (`#00ff00`) or red (`#ff0000`).
3. **No low-density spacing**: Keep components compact, high-density, and structured like a Bloomberg/REUTERS quantitative terminal.
4. **No missing tabular-nums**: All numbers must line up vertically using monospace tabular numbers.
