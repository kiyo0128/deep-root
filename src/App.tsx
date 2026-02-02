import React, { useEffect } from 'react';
import { useGameStore } from './store';
import { TreeDeciduous, Zap, TrendingUp, BookOpen, ChevronRight, Wind, Sparkles, Brain } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { lifeForce, mana, focus, maxFocus, upgrades, log, actions } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      actions.tick(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [actions]);

  const autoGrowCost = Math.pow(1.5, upgrades.autoGrow) * 10;
  const efficiencyCost = Math.pow(2, upgrades.efficiency) * 50;
  const manaCost = Math.pow(3, upgrades.manaConductivity) * 200;

  return (
    <div className="min-h-screen bg-fantasy-bg text-gray-200 p-4 md:p-8 flex flex-col gap-6 max-w-5xl mx-auto overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fantasy-primary/5 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fantasy-secondary/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 fantasy-card border-b-2 border-fantasy-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fantasy-primary/10 rounded-2xl border border-fantasy-primary/20 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
            <TreeDeciduous className="text-fantasy-primary w-8 h-8 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-fantasy-primary to-fantasy-secondary bg-clip-text text-transparent">
              Deep Root
            </h1>
            <p className="text-[10px] text-fantasy-primary/40 font-mono tracking-tighter">PROJECT V0.2.0 • ANCIENT SEED AWAKENING</p>
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <div className="text-2xl font-mono text-fantasy-primary font-black drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">
              {Math.floor(lifeForce).toLocaleString()}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Life Force</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-fantasy-secondary font-black drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]">
              {Math.floor(mana).toLocaleString()}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest opacity-40">Ancient Mana</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Stats & Actions (L: 4) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <section className="fantasy-card flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-fantasy-secondary/80">
              <Zap className="w-3 h-3" /> Focus Core
            </h2>
            <div className="relative w-full bg-white/5 h-4 rounded-full overflow-hidden border border-white/5 p-[2px]">
              <div 
                className="h-full bg-gradient-to-r from-fantasy-secondary to-blue-400 rounded-full transition-all duration-300 relative shadow-[0_0_10px_rgba(96,165,250,0.4)]"
                style={{ width: `${(focus / maxFocus) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-mono font-bold uppercase opacity-50">
              <span>Mental Stability</span>
              <span>{Math.floor(focus)} / {maxFocus}</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={actions.deepBreath}
                disabled={focus < 10}
                className="fantasy-button group relative overflow-hidden flex items-center justify-center gap-3 py-3"
              >
                <Wind className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative z-10">深呼吸 (Focus -10)</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>

              <button 
                onClick={actions.meditate}
                disabled={lifeForce < 20 || focus >= maxFocus}
                className="px-4 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-30 group"
              >
                <Brain className="w-5 h-5 text-fantasy-secondary group-hover:scale-110 transition-transform" />
                <span>瞑想 (Life -20 → Focus +40)</span>
              </button>
            </div>
          </section>

          <section className="fantasy-card flex flex-col gap-4">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-fantasy-primary/80">
              <TrendingUp className="w-3 h-3" /> Evolution Path
            </h2>
            
            <div className="flex flex-col gap-3">
              <UpgradeButton 
                title="根の拡張" 
                desc="自動成長速度アップ" 
                lv={upgrades.autoGrow} 
                cost={autoGrowCost} 
                canAfford={lifeForce >= autoGrowCost}
                onClick={() => actions.buyUpgrade('autoGrow')}
                icon={<TreeDeciduous className="w-4 h-4" />}
              />
              <UpgradeButton 
                title="光合成の最適化" 
                desc="獲得効率の底上げ" 
                lv={upgrades.efficiency} 
                cost={efficiencyCost} 
                canAfford={lifeForce >= efficiencyCost}
                onClick={() => actions.buyUpgrade('efficiency')}
                icon={<Sparkles className="w-4 h-4" />}
              />
              <UpgradeButton 
                title="魔力の伝導性" 
                desc="マナの自然発生" 
                lv={upgrades.manaConductivity} 
                cost={manaCost} 
                canAfford={lifeForce >= manaCost}
                onClick={() => actions.buyUpgrade('manaConductivity')}
                icon={<Wind className="w-4 h-4 text-fantasy-secondary" />}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Narrative Log (L: 8) */}
        <section className="lg:col-span-8 fantasy-card flex flex-col h-full overflow-hidden border-l border-white/5 bg-black/40">
          <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-fantasy-accent/80 mb-6">
            <BookOpen className="w-3 h-3" /> Chronicles of the Seed
          </h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar scroll-smooth">
            {log.map((entry, i) => (
              <div 
                key={i} 
                className={cn(
                  "text-sm p-4 rounded-xl transition-all duration-1000 border border-transparent",
                  i === 0 
                    ? "text-fantasy-primary bg-fantasy-primary/5 border-fantasy-primary/20 shadow-[0_0_15px_rgba(74,222,128,0.05)] scale-100 opacity-100" 
                    : "opacity-30 scale-95"
                )}
              >
                <div className="flex gap-3">
                  <ChevronRight className={cn("w-4 h-4 flex-shrink-0 mt-0.5", i === 0 ? "animate-pulse" : "opacity-0")} />
                  <p className="leading-relaxed font-medium">{entry}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 text-[9px] font-mono text-center opacity-30 italic">
            "The roots run deeper than time itself."
          </div>
        </section>
      </div>

      <footer className="text-[9px] text-center opacity-20 uppercase tracking-[0.4em] font-mono mt-2">
        Vibe Coded by Akane &copy; 2026 // Deep Root Project
      </footer>
    </div>
  );
}

function UpgradeButton({ title, desc, lv, cost, canAfford, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className={cn(
        "group relative flex flex-col p-4 rounded-xl border transition-all duration-300",
        canAfford 
          ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-fantasy-primary/30" 
          : "bg-black/20 border-white/5 opacity-40 cursor-not-allowed"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-lg", canAfford ? "bg-fantasy-primary/20 text-fantasy-primary" : "bg-white/5 opacity-50")}>
            {icon}
          </div>
          <div className="text-left">
            <div className="text-xs font-black uppercase tracking-tight">{title}</div>
            <div className="text-[10px] opacity-50 font-medium">{desc}</div>
          </div>
        </div>
        <div className="text-[10px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded text-white/40">
          LV.{lv}
        </div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <div className="text-[10px] font-black uppercase opacity-40 tracking-widest">Growth Cost</div>
        <div className={cn("text-sm font-mono font-black", canAfford ? "text-fantasy-primary" : "text-gray-500")}>
          {Math.floor(cost).toLocaleString()}
        </div>
      </div>
      {canAfford && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-fantasy-primary animate-in fade-in slide-in-from-left duration-500" style={{ width: '100%' }} />
      )}
    </button>
  );
}

export default App;
