import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import ccxt from "ccxt";
import { EMA, RSI } from "technicalindicators";

// Simple persistent state for the bot in memory (mirrored in Firestore)
let botState = {
  isRunning: false,
  balance: 10000,
  positions: [] as any[],
  logs: [] as any[],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/status", (req, res) => {
    res.json(botState);
  });

  app.post("/api/toggle", (req, res) => {
    botState.isRunning = !botState.isRunning;
    res.json({ isRunning: botState.isRunning });
  });

  // Mock Market Data endpoint
  app.get("/api/market-data", async (req, res) => {
    try {
      const exchange = new ccxt.binance();
      const ohlcv = await exchange.fetchOHLCV("BTC/USDT", "1h", undefined, 100);
      const closes = ohlcv.map(x => x[4]);
      
      const ema9 = EMA.calculate({ period: 9, values: closes });
      const ema21 = EMA.calculate({ period: 21, values: closes });
      const rsi = RSI.calculate({ period: 14, values: closes });

      res.json({
        symbol: "BTC/USDT",
        price: closes[closes.length - 1],
        ema9: ema9[ema9.length - 1],
        ema21: ema21[ema21.length - 1],
        rsi: rsi[rsi.length - 1],
        history: ohlcv.map(x => ({ time: x[0], price: x[4] }))
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Automated Trading Loop (Every 30s)
  setInterval(async () => {
    if (!botState.isRunning) return;

    try {
      const exchange = new ccxt.binance();
      const ohlcv = await exchange.fetchOHLCV("BTC/USDT", "1h", undefined, 50);
      const closes = ohlcv.map(x => x[4]);
      const ema9 = EMA.calculate({ period: 9, values: closes });
      const ema21 = EMA.calculate({ period: 21, values: closes });
      const rsi = RSI.calculate({ period: 14, values: closes });

      const currentPrice = closes[closes.length - 1];
      const e9 = ema9[ema9.length - 1];
      const e21 = ema21[ema21.length - 1];
      const r = rsi[rsi.length - 1];

      // Simple Trend Following Logic: 9EMA > 21EMA and RSI < 70
      if (e9 > e21 && r < 70 && botState.positions.length === 0) {
        // Mock Buy
        const amount = (botState.balance * 0.1) / currentPrice; // Use 10% of balance
        botState.positions.push({ symbol: "BTC/USDT", entry: currentPrice, amount });
        botState.balance -= (amount * currentPrice);
        console.log(`[BOT] BOUGHT BTC at ${currentPrice}`);
      } else if (e9 < e21 && botState.positions.length > 0) {
        // Mock Sell
        const pos = botState.positions.pop();
        botState.balance += (pos.amount * currentPrice);
        console.log(`[BOT] SOLD BTC at ${currentPrice}`);
      }
    } catch (e) {
      console.error("Bot loop error:", e);
    }
  }, 30000);
}

startServer();
