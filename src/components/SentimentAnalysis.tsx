import { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Brain, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function SentimentAnalysis({ symbol }: { symbol: string }) {
  const [sentiment, setSentiment] = useState<{ score: number; reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeSentiment() {
    setLoading(true);
    try {
      // In a real app, you'd fetch real news headlines here.
      // For this prototype, we'll ask Gemini to simulate current market sentiment based on its training data & search tools.
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the current real-time sentiment for ${symbol}. 
        Provide a JSON response with:
        - score: a number from -1 (extremely bearish) to 1 (extremely bullish)
        - reasoning: a concise 1-sentence explanation.
        Use only factual market data if available.`,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }] // Use search to get recent data
        }
      });

      const data = JSON.parse(response.text || '{}');
      setSentiment(data);
    } catch (error) {
      console.error("Sentiment analysis failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    analyzeSentiment();
    const interval = setInterval(analyzeSentiment, 600000); // Every 10 mins
    return () => clearInterval(interval);
  }, [symbol]);

  if (!sentiment && loading) return <div className="animate-pulse text-xs text-zinc-500">AI brain thinking...</div>;

  return (
    <div className="p-5 rounded border border-slate-800 bg-brand-card">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1 h-3 bg-brand-accent"></span>
        <h3 className="text-[11px] font-bold text-brand-accent uppercase tracking-widest flex items-center gap-2">
          <Brain className="w-3.5 h-3.5" />
          AI Sentiment Analyzer
        </h3>
      </div>
      
      {sentiment && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-slate-800">
             <div className="flex items-center gap-3">
               <div className={cn(
                 "p-2 rounded flex items-center justify-center",
                 sentiment.score > 0.2 ? "bg-emerald-500/10" : sentiment.score < -0.2 ? "bg-rose-500/10" : "bg-slate-800/30"
               )}>
                 {sentiment.score > 0.2 ? (
                   <TrendingUp className="w-5 h-5 text-emerald-500" />
                 ) : sentiment.score < -0.2 ? (
                   <TrendingDown className="w-5 h-5 text-rose-500" />
                 ) : (
                   <Minus className="w-5 h-5 text-slate-500" />
                 )}
               </div>
               <div className="flex flex-col">
                 <span className={`text-xl font-mono font-bold leading-none ${
                   sentiment.score > 0.2 ? 'text-emerald-500' : 
                   sentiment.score < -0.2 ? 'text-rose-500' : 'text-slate-500'
                 }`}>
                   {(sentiment.score * 100).toFixed(0)}%
                 </span>
                 <span className="text-[9px] uppercase tracking-[0.2em] text-slate-600 font-bold mt-1">
                   {sentiment.score > 0.2 ? 'Bullish' : 
                    sentiment.score < -0.2 ? 'Bearish' : 'Neutral'}
                 </span>
               </div>
             </div>
             <Zap className="w-4 h-4 text-slate-700" />
          </div>
          <div className="p-3 bg-slate-900/50 border-l border-slate-700">
            <p className="text-[11px] text-slate-400 leading-relaxed italic font-serif">
              "{sentiment.reasoning}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
