import { useEffect } from 'react';
import { useGameStore } from './store';
import { 
  TreeDeciduous, 
  Zap, 
  BookOpen, 
  Wind, 
  Sparkles, 
  Brain,
  ChevronRight,
  ArrowUpCircle
} from 'lucide-react';
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
    <div className="min-h-screen bg-[#030406] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.5)_0%,rgba(3,4,6,1)_100%)]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-12 flex flex-col gap-6 md:gap-8 items-center">
        
        {/* Main Header / Status */}
        <header className="w-full relative group max-w-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-slate-900/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-8 flex flex-col items-center justify-between gap-6 shadow-2xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                <div className="relative p-4 bg-emerald-500/5 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <TreeDeciduous className="text-emerald-400 w-8 h-8 md:w-10 md:h-10" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black tracking-[0.25em] uppercase bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
                  Deep Root
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                  <p className="text-[9px] font-mono font-bold text-emerald-500/50 uppercase tracking-[0.3em]">Seed Phase v0.2.3</p>
                </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 md:gap-8 pt-4 border-t border-white/5">
              <ResourceDisplay 
                label="Life Force" 
                value={lifeForce} 
                color="text-emerald-400" 
                icon={<Sparkles className="w-3 h-3 text-emerald-500/50" />}
              />
              <ResourceDisplay 
                label="Ancient Mana" 
                value={mana} 
                color="text-blue-400" 
                icon={<Wind className="w-3 h-3 text-blue-500/50" />}
              />
            </div>
          </div>
        </header>

        {/* Game Content Stack */}
        <main className="w-full max-w-2xl flex flex-col gap-6 md:gap-10">
          
          {/* Section: Actions */}
          <section className="flex flex-col gap-4">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Core Actions</h2>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-blue-400/70 font-bold">{Math.floor(focus)} / {maxFocus}</span>
                   <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(focus / maxFocus) * 100}%` }}
                      />
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionButton 
                  onClick={actions.deepBreath} 
                  disabled={focus < 10}
                  icon={<Zap className="w-5 h-5" />}
                  label="Deep Breath"
                  sublabel="Spend 10 Focus"
                  primary
                  color="emerald"
                  available={focus >= 10}
                />
                <ActionButton 
                  onClick={actions.meditate} 
                  disabled={lifeForce < 20 || focus >= maxFocus}
                  icon={<Brain className="w-5 h-5" />}
                  label="Meditation"
                  sublabel="20 Life → 40 Focus"
                  primary={false}
                  color="blue"
                  available={lifeForce >= 20 && focus < maxFocus}
                />
             </div>
          </section>

          {/* Section: Evolution */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 px-2">Evolution Path</h2>
            <div className="grid grid-cols-1 gap-3">
              <UpgradeCard 
                title="Root Expansion" 
                desc="Increases passive life growth" 
                lv={upgrades.autoGrow} 
                cost={autoGrowCost} 
                canAfford={lifeForce >= autoGrowCost}
                onClick={() => actions.buyUpgrade('autoGrow')}
                color="emerald"
              />
              <UpgradeCard 
                title="Photosynthesis" 
                desc="Multiplier for growth efficiency" 
                lv={upgrades.efficiency} 
                cost={efficiencyCost} 
                canAfford={lifeForce >= efficiencyCost}
                onClick={() => actions.buyUpgrade('efficiency')}
                color="emerald"
              />
              <UpgradeCard 
                title="Mana Conductivity" 
                desc="Enables passive mana harvesting" 
                lv={upgrades.manaConductivity} 
                cost={manaCost} 
                canAfford={lifeForce >= manaCost}
                onClick={() => actions.buyUpgrade('manaConductivity')}
                color="blue"
              />
            </div>
          </section>

          {/* Section: Chronicles */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/50">Chronicles</h2>
              <BookOpen className="w-3 h-3 text-slate-600" />
            </div>
            
            <div className="bg-slate-900/10 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden min-h-[300px] flex flex-col">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2 max-h-[400px]">
                <div className="flex flex-col gap-2">
                  {log.map((entry, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "transition-all duration-700",
                        i === 0 
                          ? "p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-lg" 
                          : "px-5 py-2 opacity-30 blur-[0.3px]"
                      )}
                    >
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[7px] font-mono font-bold uppercase tracking-widest text-slate-500">#{log.length - i}</span>
                            {i === 0 && <span className="text-[7px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded font-black tracking-widest">RECORDED</span>}
                          </div>
                          <p className={cn(
                            "leading-relaxed tracking-wide",
                            i === 0 ? "text-base md:text-lg text-slate-100 font-medium" : "text-xs text-slate-400"
                          )}>
                            {entry}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {log.length === 0 && (
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-600 italic">
                      <p className="text-sm font-medium tracking-widest opacity-30">The chronicle is empty...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-8 pb-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-8">
            <FooterLink label="Settings" />
            <FooterLink label="Export" />
            <FooterLink label="Discord" />
          </div>
          <div className="flex flex-col items-center gap-2">
             <div className="h-px w-12 bg-white/10" />
             <p className="text-[8px] font-mono font-bold tracking-[0.8em] text-slate-700 uppercase">
               DEEP ROOT PROJECT
             </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// SUB-COMPONENTS

function ResourceDisplay({ label, value, color, icon }: any) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5 opacity-30">
        {icon}
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className={cn("text-xl md:text-3xl font-mono font-black tabular-nums tracking-tight", color)}>
        {Math.floor(value).toLocaleString()}
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, icon, label, sublabel, color, available }: any) {
  const isEmerald = color === 'emerald';
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group w-full p-4 rounded-2xl border flex items-center gap-4 text-left overflow-hidden transition-all duration-300",
        disabled 
          ? "bg-slate-900/20 border-white/5 opacity-40 cursor-not-allowed" 
          : cn(
              "btn-tactile",
              isEmerald ? "btn-tactile-emerald bg-emerald-500/10 border-emerald-500/20" : "btn-tactile-blue bg-blue-500/10 border-blue-500/20",
              available && (isEmerald ? "animate-available-emerald" : "animate-available-blue")
            )
      )}
    >
      <div className={cn(
        "p-3 rounded-xl transition-all duration-500",
        disabled 
          ? "bg-white/5 text-slate-500" 
          : isEmerald 
            ? "bg-emerald-500/20 text-emerald-400 group-hover:scale-110 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
            : "bg-blue-500/20 text-blue-400 group-hover:scale-110 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={cn(
          "text-xs font-black uppercase tracking-widest transition-colors", 
          disabled ? "text-slate-600" : isEmerald ? "text-emerald-300" : "text-blue-300"
        )}>
          {label}
        </div>
        <div className="text-[9px] opacity-40 font-bold uppercase tracking-tighter mt-0.5">{sublabel}</div>
      </div>
      {!disabled && (
        <div className="opacity-0 group-hover:opacity-40 transition-opacity">
          <ChevronRight className="w-4 h-4" />
        </div>
      )}
    </button>
  );
}

function UpgradeCard({ title, desc, lv, cost, canAfford, onClick, color }: any) {
  const isEmerald = color === 'emerald';
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className={cn(
        "group relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
        canAfford 
          ? isEmerald 
            ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 cursor-pointer" 
            : "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 cursor-pointer"
          : "bg-slate-900/10 border-white/5 opacity-30 cursor-not-allowed grayscale"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "p-2.5 rounded-xl border transition-colors",
          canAfford 
            ? isEmerald ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            : "bg-white/5 border-white/10 text-slate-500"
        )}>
          <ArrowUpCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-xs font-black uppercase tracking-widest text-slate-100">{title}</div>
            <div className="text-[8px] font-mono font-black bg-white/5 px-1.5 py-0.5 rounded text-white/30 border border-white/5 uppercase">
              LV.{lv}
            </div>
          </div>
          <div className="text-[9px] opacity-50 font-bold uppercase tracking-tighter mt-1">{desc}</div>
        </div>
      </div>
      
      <div className="flex flex-col items-end relative z-10">
        <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Energy Required</span>
        <div className={cn(
          "text-sm font-mono font-black", 
          canAfford ? isEmerald ? "text-emerald-400" : "text-blue-400" : "text-slate-500"
        )}>
          {Math.floor(cost).toLocaleString()}
        </div>
      </div>

      {/* Decorative progress when affordable */}
      {canAfford && (
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-1 transition-all duration-1000",
          isEmerald ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        )} />
      )}
    </button>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <button className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors">
      {label}
    </button>
  );
}

export default App;
