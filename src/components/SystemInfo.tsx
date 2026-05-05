import { Shield, Lock, AlertTriangle, Cloud, Code, BarChart3 } from 'lucide-react';

export default function SystemInfo() {
  return (
    <div className="space-y-12 pb-20">
      <section className="space-y-6">
        <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2">
          <span className="w-1 h-3 bg-brand-accent"></span>
          01. Security Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono">
          <div className="p-4 bg-black/40 border border-slate-800 rounded space-y-3">
            <h4 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest border-b border-slate-800 pb-2">
              <Lock className="w-3 h-3 text-brand-accent" /> 
              Key Protection
            </h4>
            <p className="text-slate-500 leading-relaxed italic">All exchange API keys are strictly restricted to server-side environments. AES-256 encryption applied at rest.</p>
          </div>
          <div className="p-4 bg-black/40 border border-slate-800 rounded space-y-3">
            <h4 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest border-b border-slate-800 pb-2">
              <Shield className="w-3 h-3 text-brand-accent" /> 
              ABAC Protocol
            </h4>
            <p className="text-slate-500 leading-relaxed italic">Firestore Security Rules enforce attribute-based access. Zero-trust verification on every write operation.</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-[11px] font-bold text-brand-accent uppercase flex items-center gap-2">
          <span className="w-1 h-3 bg-brand-accent"></span>
          02. Deployment Pipeline
        </h2>
        <div className="space-y-3 font-mono text-[10px]">
          {[
            { step: "01", title: "CONTAINERIZATION", desc: "Native Docker (Alpine) image optimized for low-latency Go-style execution overhead." },
            { step: "02", title: "HIGH AVAILABILITY", desc: "Deploy to Cloud Run or Kubernetes with automatic health checks and 24/7 uptime monitoring." },
            { step: "03", title: "OBSERVABILITY", desc: "Full stack telemetry with Prometheus and Grafana integration for real-time drawdown alerts." }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-3 bg-slate-900/20 border border-slate-800/40 rounded">
              <div className="px-2 py-1 bg-slate-800 text-white font-bold shrink-0">{item.step}</div>
              <div>
                <span className="text-white font-bold uppercase tracking-widest block mb-1">{item.title}</span>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-[11px] font-bold text-rose-500 uppercase flex items-center gap-2">
          <span className="w-1 h-3 bg-rose-500"></span>
          03. Risk Management & Legal
        </h2>
        <div className="p-5 border border-rose-900/30 bg-rose-900/5 rounded">
          <ul className="space-y-3 text-[11px] text-slate-400 font-mono">
            <li className="flex gap-2"><span className="text-rose-500 font-bold shrink-0">[!]</span> <span className="italic">SLIPPAGE:</span> Orders may fill at suboptimal price points during liquidity shocks.</li>
            <li className="flex gap-2"><span className="text-rose-500 font-bold shrink-0">[!]</span> <span className="italic">LATENCY:</span> Milliseconds matter. Execution speeds depend on region proximity to exchange colocation centers.</li>
            <li className="flex gap-2"><span className="text-rose-500 font-bold shrink-0">[!]</span> <span className="italic">DISCLAIMER:</span> This is a quantitative proof-of-concept. Trading involves substantial risk. AI models do not guarantee outcomes.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
