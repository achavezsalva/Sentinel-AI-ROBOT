import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, ArrowUpRight, ArrowDownRight, Wallet, History, Settings, Play, Square, Bot, Shield, Zap, Info, Menu, Brain, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SentimentAnalysis from './components/SentimentAnalysis';
import SystemInfo from './components/SystemInfo';
import { cn } from './lib/utils';

export default function App() {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<any>({ isRunning: false, balance: 10000 });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/market-data');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const json = await res.json();
        setStatus(json);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMarketData();
    fetchStatus();
    const interval = setInterval(() => {
      fetchMarketData();
      fetchStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleBot = async () => {
    await fetch('/api/toggle', { method: 'POST' });
    setStatus((prev: any) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  return (
    <div className="min-h-screen bg-brand-bg text-slate-300 font-sans selection:bg-brand-accent/30">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-slate-800/60 bg-[#080809] z-20 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/40">
          <div className="w-8 h-8 rounded bg-brand-accent flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white uppercase">SENTINEL<span className="text-slate-500 font-light">BOT</span></h1>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest block -mt-1 uppercase">v4.2.0 PROD</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
          {[
            { id: 'dashboard', icon: Activity, label: '01. TERMINAL' },
            { id: 'history', icon: History, label: '02. AUDIT TRAIL' },
            { id: 'strategy', icon: Zap, label: '03. LOGIC CORE' },
            { id: 'settings', icon: Settings, label: '04. SYSTEM CFG' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 group text-[11px] font-bold tracking-widest",
                activeTab === item.id 
                  ? "bg-brand-accent/5 text-brand-accent border-l-2 border-brand-accent" 
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/60 bg-black/20">
           <div className="bg-brand-card rounded-lg p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-[10px] font-bold tracking-widest uppercase">
                <span className="text-slate-500">Execution Engine</span>
                <div className={cn("w-2 h-2 rounded-full", status.isRunning ? "bg-brand-accent shadow-[0_0_8px_#10b981]" : "bg-rose-500")} />
              </div>
              <button 
                onClick={toggleBot}
                className={cn(
                  "w-full py-2.5 rounded text-[10px] font-black tracking-widest transition-all uppercase border",
                  status.isRunning 
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500 hover:text-white"
                    : "bg-brand-accent/10 text-brand-accent border-brand-accent/30 hover:bg-brand-accent hover:text-black"
                )}
              >
                {status.isRunning ? "DISCONNECT SYSTEM" : "INITIALIZE BOLT"}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-6 sticky top-0 bg-brand-bg/90 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
             <div className="lg:hidden w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Menu className="w-4 h-4 text-slate-400" />
             </div>
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em]">Market Profile</span>
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    BTC / USDT 
                    <span className="px-1.5 py-0.5 rounded border border-brand-accent/20 text-brand-accent text-[9px] uppercase font-mono">LIVE FEED</span>
                  </span>
                </div>
                <div className="hidden sm:flex flex-col border-l border-slate-800 pl-4">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em]">Latency</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">14ms</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-[9px] uppercase font-bold text-slate-500 tracking-[0.2em]">Portfolio Equities</span>
               <div className="flex items-center gap-2">
                 <span className="text-sm font-mono font-bold text-white">${status.balance?.toLocaleString()}</span>
                 <span className="text-[9px] text-emerald-500 font-bold">+2.4%</span>
               </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-900 border border-slate-800 rounded">
              <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Shield className="w-3 h-3 text-slate-500" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">QT_OP_001</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 xl:grid-cols-12 gap-5"
              >
                {/* Left Column: Chart & Stats */}
                <div className="xl:col-span-8 space-y-5">
                  {/* Performance Snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: "SPOT PRICE", value: `$${data?.price?.toLocaleString()}`, sub: "MARKET", up: true, icon: Activity },
                      { label: "EMA (9)", value: `$${data?.ema9?.toFixed(2)}`, sub: "FAST", up: true, icon: Zap },
                      { label: "EMA (21)", value: `$${data?.ema21?.toFixed(2)}`, sub: "SIGNAL", up: true, icon: TrendingUp },
                      { label: "RSI RELATIVE", value: data?.rsi?.toFixed(2), sub: "MOMENTUM", up: data?.rsi < 70, icon: Shield },
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded border border-slate-800 bg-brand-card group hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <stat.icon className="w-3 h-3 text-slate-600 group-hover:text-brand-accent transition-colors" />
                          <span className={cn("text-[9px] font-bold tracking-widest uppercase", 
                            stat.up ? "text-emerald-500" : "text-rose-500"
                          )}>{stat.sub}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold tracking-widest mb-1 uppercase">{stat.label}</div>
                        <div className="text-xl font-mono font-bold text-white tracking-tighter">{stat.value || "---"}</div>
                      </div>
                    ))}
                  </div>

                  {/* Main Chart */}
                  <div className="p-6 rounded border border-slate-800 bg-brand-card">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2">
                        <span className="w-1 h-3 bg-brand-accent"></span>
                        01. Market Terminal Feed
                      </h2>
                      <div className="flex gap-1.5 p-1 bg-black rounded border border-slate-800">
                        {['1M', '5M', '1H', '1D'].map(t => (
                          <button key={t} className={cn("px-2.5 py-1 text-[9px] font-bold rounded transition-all uppercase", 
                            t === '1H' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                          )}>{t}</button>
                        ))}
                      </div>
                    </div>
                    {data ? (
                      <div className="h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data.history}>
                            <defs>
                              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1C" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis 
                              domain={['auto', 'auto']} 
                              orientation="right" 
                              stroke="#475569" 
                              fontSize={9} 
                              fontFamily="JetBrains Mono"
                              tickFormatter={(v) => `$${v}`}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '4px', fontSize: '10px', fontFamily: 'JetBrains Mono' }}
                              itemStyle={{ color: '#10B981' }}
                            />
                            <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={1.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[380px] flex items-center justify-center text-slate-600 italic text-xs animate-pulse">Establishing secure WebSocket connection...</div>
                    )}
                  </div>
                </div>

                {/* Right Column: AI & Execution */}
                <div className="xl:col-span-4 space-y-5">
                  <SentimentAnalysis symbol="BTC" />

                  {/* Execution Logic */}
                  <div className="p-5 rounded border border-slate-800 bg-brand-card">
                    <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2 mb-6">
                      <span className="w-1 h-3 bg-brand-accent"></span>
                      03. Strategy Execution Core
                    </h2>
                    <div className="space-y-4">
                      <div className="bg-black/40 p-3 rounded border border-slate-800/80">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Trend State</span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", 
                            data?.ema9 > data?.ema21 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                          )}>
                            {data?.ema9 > data?.ema21 ? 'Bullish Dominance' : 'Strong Bearish'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={cn("flex-1 h-1 rounded-full bg-slate-800 overflow-hidden")}>
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: data?.ema9 > data?.ema21 ? '85%' : '20%' }}
                               className={cn("h-full transition-all duration-1000", data?.ema9 > data?.ema21 ? "bg-emerald-500" : "bg-rose-500")}
                             />
                          </div>
                          {data?.ema9 > data?.ema21 ? <ArrowUpRight className="text-emerald-400 w-4 h-4" /> : <ArrowDownRight className="text-rose-400 w-4 h-4" />}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-slate-900/50 p-2.5 border border-slate-800 rounded">
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Risk Exposure</span>
                            <span className="text-xs font-mono text-white">2.5% MAX</span>
                         </div>
                         <div className="bg-slate-900/50 p-2.5 border border-slate-800 rounded">
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest block mb-1">R:R Ratio</span>
                            <span className="text-xs font-mono text-white">1 : 3.2</span>
                         </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          <span>Capital Allocation</span>
                          <span className="text-white">Active Scaling</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                           <div className="h-full bg-slate-600 w-[45%]" />
                        </div>
                      </div>

                      <div className="bg-[#1A1A1C] border border-slate-800 p-3 rounded text-[10px] text-slate-400 leading-relaxed font-mono">
                         <div className="flex items-center gap-2 mb-1">
                           <Info className="w-3 h-3 text-brand-accent" />
                           <span className="text-slate-200">Execution Logic:</span>
                         </div>
                         Wait for EMA9/21 cross-check + RSI stabilization &lt; 65. Verify with AI Sentiment engine score &gt; 0.25.
                      </div>
                    </div>
                  </div>

                  {/* Active Positions */}
                  <div className="p-5 rounded border border-slate-800 bg-brand-card">
                    <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2 mb-6">
                      <span className="w-1 h-3 bg-brand-accent"></span>
                      04. Operational Exposure
                    </h2>
                    <div className="text-center py-8 border border-dashed border-slate-800 bg-slate-900/10 rounded">
                       <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1 italic">Scanning Markets...</p>
                       <p className="text-[9px] text-slate-600 uppercase tracking-widest">No Active Positions In-Flight</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2">
                  <span className="w-1 h-3 bg-brand-accent"></span>
                  02. System Audit Trail
                </h2>
                <div className="rounded border border-slate-800 bg-brand-card overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#080809] text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="p-4">UTC Timestamp</th>
                        <th className="p-4">Asset</th>
                        <th className="p-4">Operation</th>
                        <th className="p-4">Price Basis</th>
                        <th className="p-4">Lot Size</th>
                        <th className="p-4 text-right">Net PnL</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-mono whitespace-nowrap">
                       <tr className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                         <td className="p-4 text-slate-500 tabular-nums">2026-05-04 22:15:02</td>
                         <td className="p-4 font-bold text-white">BTC/USDT</td>
                         <td className="p-4"><span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-sm">BUY_L</span></td>
                         <td className="p-4 tabular-nums">$96,240.21</td>
                         <td className="p-4 tabular-nums">0.1000 BTC</td>
                         <td className="p-4 text-emerald-400 text-right tabular-nums">+$245.22</td>
                       </tr>
                       <tr className="border-b border-slate-800/50 bg-[#121214] hover:bg-slate-800/20 transition-colors">
                         <td className="p-4 text-slate-500 tabular-nums">2026-05-04 18:42:15</td>
                         <td className="p-4 font-bold text-white">BTC/USDT</td>
                         <td className="p-4"><span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 rounded-sm">SELL_S</span></td>
                         <td className="p-4 tabular-nums">$97,100.00</td>
                         <td className="p-4 tabular-nums">0.1000 BTC</td>
                         <td className="p-4 text-rose-400 text-right tabular-nums">-$42.10</td>
                       </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'strategy' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-10">
                <div className="space-y-2 border-b border-slate-800 pb-6">
                  <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Strategy <span className="text-brand-accent">Blueprint</span></h2>
                  <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">System Reference #QT-X702</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[
                     { 
                       step: "01", 
                       title: "TECH FILTERS", 
                       icon: Activity, 
                       color: "text-brand-accent", 
                       desc: "Multi-timeframe EMA crossover detection (9/21). RSI momentum confirmation to avoid bull traps." 
                     },
                     { 
                       step: "02", 
                       title: "AI INFERENCE", 
                       icon: Brain, 
                       color: "text-blue-400", 
                       desc: "High-level LLM analysis of real-time market sentiment via Gemini 3 Flash and Google Search grounding." 
                     },
                     { 
                       step: "03", 
                       title: "RISK PROTOCOL", 
                       icon: Shield, 
                       color: "text-rose-400", 
                       desc: "Strict 1.5% hard stop-loss and 2.0% max daily drawdown limit to preserve institutional capital." 
                     },
                     { 
                       step: "04", 
                       title: "EXECUTION WS", 
                       icon: Zap, 
                       color: "text-amber-400", 
                       desc: "Low-latency CCXT integration for sub-second trade routing across 100+ global exchanges." 
                     }
                   ].map((item, i) => (
                     <div key={i} className="p-6 rounded border border-slate-800 bg-brand-card space-y-4 group">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-600">PHASE_{item.step}</span>
                          <item.icon className={cn("w-5 h-5", item.color)} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.desc}
                        </p>
                     </div>
                   ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 border-b border-slate-800 pb-6">
                  <h2 className="text-3xl font-black tracking-tighter text-white uppercase">System <span className="text-slate-500">Architecture</span></h2>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">Operational guidelines for large-scale deployment</p>
                </div>
                <SystemInfo />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
