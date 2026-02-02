import React, { useEffect } from 'react';
import { useGameStore } from './store';
import { TreeDeciduous, Zap, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';

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
  const manaCost = Math.pow(1.8, upgrades.manaConductivity) * 200;
  const meditationCost = Math.pow(2.2, upgrades.meditation) * 100;

  return (
    <div className="min-h-screen bg-[#050507] text-gray-200 p-2 md:p-6 flex flex-col gap-4 max-w-6xl mx-auto selection:bg-fantasy-primary/30">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-fantasy-muted to-black border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fantasy-primary to-transparent opacity-50" />
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-fantasy-primary blur-lg opacity-20 animate-pulse" />
            <div className="relative p-3 bg-fantasy-primary/10 rounded-xl border border-fantasy-primary/30">
              <TreeDeciduous className="text-fantasy-primary w-8 h-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">Deep Root</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fantasy-primary animate-pulse" />
              <p className="text-[10px] text-fantasy-primary uppercase tracking-[0.3em] font-bold">Ver 0.2.0 Soulbound</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="text-right group cursor-default">
            <div className="text-3xl font-mono text-white group-hover:text-fantasy-primary transition-colors">
              {Math.floor(lifeForce).toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-fantasy-primary/60 font-bold">Life Force</div>
          </div>
          <div className="text-right group cursor-default">
            <div className="text-3xl font-mono text-white group-hover:text-fantasy-secondary transition-colors">
              {Math.floor(mana).toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-fantasy-secondary/60 font-bold">Mana Essence</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 h-[calc(100vh-180px)]">
        {/* Actions & Upgrades (Left) */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Panel */}
            <section className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fantasy-secondary">
                  <Zap className="w-4 h-4" /> Inner Spirit
                </h2>
                <span className="text-xs font-mono opacity-60">{Math.floor(focus)} / {maxFocus}</span>
              </div>
              
              <div className="relative w-full h-3 bg-black/40 rounded-full border border-white/5 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-fantasy-secondary shadow-[0_0_15px_rgba(96,165,250,0.5)] transition-all duration-300"
                  style={{ width: `${(focus / maxFocus) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={actions.deepBreath}
                  disabled={focus < 10}
                  className="p-4 rounded-xl bg-fantasy-secondary/10 border border-fantasy-secondary/20 hover:bg-fantasy-secondary/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group"
                >
                  <div className="text-xs font-bold mb-1 group-hover:text-fantasy-secondary">深呼吸</div>
                  <div className="text-[9px] opacity-40 uppercase">-10 Focus</div>
                </button>
                <button 
                  onClick={actions.meditate}
                  disabled={lifeForce < 5}
                  className="p-4 rounded-xl bg-fantasy-accent/10 border border-fantasy-accent/20 hover:bg-fantasy-accent/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale group"
                >
                  <div className="text-xs font-bold mb-1 group-hover:text-fantasy-accent">瞑想</div>
                  <div className="text-[9px] opacity-40 uppercase">-5 Life Force</div>
                </button>
              </div>
            </section>

            {/* Stats Panel */}
            <section className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-xs opacity-40 font-bold uppercase vertical-text border-r border-white/10 pr-2">Aura</div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-mono text-fantasy-primary">+{upgrades.autoGrow * upgrades.efficiency}</div>
                    <div className="text-[9px] uppercase opacity-40 font-bold">Passive Growth</div>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-fantasy-secondary">+{upgrades.manaConductivity * 0.05}</div>
                    <div className="text-[9px] uppercase opacity-40 font-bold">Mana Flow</div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Upgrades Section */}
          <section className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-fantasy-primary w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-widest italic">Evolutionary Paths</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UpgradeButton 
                title="根の拡張" 
                desc={`自動成長 +1/s (Lv.${upgrades.autoGrow})`}
                cost={autoGrowCost}
                canBuy={lifeForce >= autoGrowCost}
                onClick={() => actions.buyUpgrade('autoGrow')}
                color="primary"
              />
              <UpgradeButton 
                title="光合成の効率" 
                desc={`全獲得量 x${upgrades.efficiency} (Lv.${upgrades.efficiency})`}
                cost={efficiencyCost}
                canBuy={lifeForce >= efficiencyCost}
                onClick={() => actions.buyUpgrade('efficiency')}
                color="primary"
              />
              <UpgradeButton 
                title="魔力の伝導性" 
                desc={`マナの生成を解禁 (Lv.${upgrades.manaConductivity})`}
                cost={manaCost}
                canBuy={lifeForce >= manaCost}
                onClick={() => actions.buyUpgrade('manaConductivity')}
                color="secondary"
              />
              <UpgradeButton 
                title="静寂の心" 
                desc={`精神回復速度 +20% (Lv.${upgrades.meditation})`}
                cost={meditationCost}
                canBuy={lifeForce >= meditationCost}
                onClick={() => actions.buyUpgrade('meditation')}
                color="accent"
              />
            </div>
          </section>
        </div>

        {/* Narrative Log (Right) */}
        <div className="lg:col-span-4 h-full overflow-hidden flex flex-col gap-4">
          <section className="flex-1 p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col overflow-hidden relative">
            <div className="absolute inset-0 bg-fantasy-primary/5 pointer-events-none" />
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fantasy-accent mb-6 relative">
              <BookOpen className="w-4 h-4" /> The Chronicles of Seed
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-smooth custom-scrollbar relative">
              {log.map((entry, i) => (
                <div 
                  key={i} 
                  className={`text-sm flex gap-3 animate-in fade-in slide-in-from-right-2 duration-700 ${i === 0 ? 'text-white font-medium scale-105 origin-left' : 'opacity-30 blur-[0.5px] font-light'}`}
                >
                  <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-fantasy-primary' : 'bg-gray-600'}`} />
                  <p className="leading-relaxed">{entry}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <footer className="flex justify-between items-center p-4 border-t border-white/5 opacity-30">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold">Roots run deep into the void</div>
        <div className="text-[10px] uppercase tracking-[0.1em]">Codename: Deep Root</div>
      </footer>
    </div>
  );
}

function UpgradeButton({ title, desc, cost, canBuy, onClick, color }: any) {
  const colorMap = {
    primary: "text-fantasy-primary border-fantasy-primary/30 bg-fantasy-primary/5 hover:bg-fantasy-primary/10 hover:border-fantasy-primary",
    secondary: "text-fantasy-secondary border-fantasy-secondary/30 bg-fantasy-secondary/5 hover:bg-fantasy-secondary/10 hover:border-fantasy-secondary",
    accent: "text-fantasy-accent border-fantasy-accent/30 bg-fantasy-accent/5 hover:bg-fantasy-accent/10 hover:border-fantasy-accent",
  };

  return (
    <button 
      onClick={onClick}
      disabled={!canBuy}
      className={`p-4 rounded-2xl border flex flex-col gap-1 text-left transition-all duration-300 disabled:opacity-20 disabled:grayscale ${colorMap[color as keyof typeof colorMap]}`}
    >
      <div className="text-xs font-black uppercase tracking-wider">{title}</div>
      <div className="text-[9px] opacity-70 mb-2 leading-tight h-6 overflow-hidden">{desc}</div>
      <div className="mt-auto pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="text-[9px] uppercase font-bold opacity-50">Cost</span>
        <span className="text-xs font-mono font-bold tracking-tighter">{Math.floor(cost).toLocaleString()} LF</span>
      </div>
    </button>
  );
}

export default App;
