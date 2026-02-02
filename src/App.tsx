import React, { useEffect } from 'react';
import { useGameStore } from './store';
import { TreeDeciduous, Zap, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';

function App() {
  const { lifeForce, focus, maxFocus, upgrades, log, actions } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      actions.tick(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [actions]);

  const autoGrowCost = Math.pow(1.5, upgrades.autoGrow) * 10;
  const efficiencyCost = Math.pow(2, upgrades.efficiency) * 50;

  return (
    <div className="min-h-screen bg-fantasy-bg text-gray-200 p-4 md:p-8 flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center fantasy-card border-b-2 border-fantasy-primary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-fantasy-primary/20 rounded-lg">
            <TreeDeciduous className="text-fantasy-primary w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider uppercase">Deep Root</h1>
            <p className="text-xs text-fantasy-primary/60">Fragment of Ancient Seed</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-fantasy-primary font-bold">
            {Math.floor(lifeForce).toLocaleString()}
          </div>
          <div className="text-xs uppercase tracking-tighter opacity-60">Life Force</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Left Column: Actions & Upgrades */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <section className="fantasy-card flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fantasy-secondary">
              <Zap className="w-4 h-4" /> Focus & Actions
            </h2>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-fantasy-secondary transition-all duration-300"
                style={{ width: `${(focus / maxFocus) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase opacity-60">
              <span>Focus Energy</span>
              <span>{Math.floor(focus)} / {maxFocus}</span>
            </div>
            <button 
              onClick={actions.deepBreath}
              disabled={focus < 10}
              className="fantasy-button w-full flex items-center justify-center gap-2 group"
            >
              <Zap className="w-4 h-4 group-hover:scale-125 transition-transform" />
              深呼吸 (Cost: 10 Focus)
            </button>
          </section>

          <section className="fantasy-card flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-fantasy-primary">
              <TrendingUp className="w-4 h-4" /> Evolution
            </h2>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => actions.buyUpgrade('autoGrow')}
                disabled={lifeForce < autoGrowCost}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                <div className="text-left">
                  <div className="text-sm font-bold">根の拡張</div>
                  <div className="text-[10px] opacity-60">自動成長 +1/s (Lv.{upgrades.autoGrow})</div>
                </div>
                <div className="text-sm font-mono text-fantasy-primary">
                  {Math.floor(autoGrowCost)}
                </div>
              </button>

              <button 
                onClick={() => actions.buyUpgrade('efficiency')}
                disabled={lifeForce < efficiencyCost}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                <div className="text-left">
                  <div className="text-sm font-bold">光合成の効率</div>
                  <div className="text-[10px] opacity-60">獲得量倍率 x{upgrades.efficiency} (Lv.{upgrades.efficiency})</div>
                </div>
                <div className="text-sm font-mono text-fantasy-primary">
                  {Math.floor(efficiencyCost)}
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Narrative Log */}
        <section className="fantasy-card flex flex-col h-full overflow-hidden">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-fantasy-accent mb-4">
            <BookOpen className="w-4 h-4" /> Chronicles
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth">
            {log.map((entry, i) => (
              <div 
                key={i} 
                className={`text-sm flex gap-2 animate-in fade-in slide-in-from-left-2 duration-500 ${i === 0 ? 'text-fantasy-primary border-l-2 border-fantasy-primary pl-2' : 'opacity-60'}`}
              >
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{entry}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="text-[10px] text-center opacity-40 uppercase tracking-[0.2em]">
        &copy; 2026 Deep Root Project - Vibe Coded with Akane
      </footer>
    </div>
  );
}

export default App;
