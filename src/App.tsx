import { useEffect, useState } from 'react';
import { useGameStore } from './store';
import { 
  TreeDeciduous, 
  Zap, 
  BookOpen, 
  Wind, 
  Sparkles, 
  Brain,
  ChevronDown,
  LayoutGrid,
  History,
  TrendingUp,
  Settings,
  HelpCircle,
  Save
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { lifeForce, mana, focus, maxFocus, upgrades, log, actions } = useGameStore();
  const [activeTab, setActiveTab] = useState<'main' | 'chronicles'>('main');

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
    <div className="min-h-screen bg-[#02040a] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-600/5 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-6 min-h-screen">
        
        {/* Header - Centered & Premium */}
        <header className="flex flex-col items-center text-center gap-4 mb-2">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative p-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
              <TreeDeciduous className="text-emerald-400 w-10 h-10 md:w-12 md:h-12 animate-pulse-slow" />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-[0.15em] uppercase bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
              Deep Root
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-mono font-bold text-emerald-500/60 uppercase tracking-widest">Ancient Seed v0.2.5 • Growth Phase</p>
            </div>
          </div>
        </header>

        {/* Resources Card - Centralized */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <ResourceDisplay 
            label="Life Force" 
            value={lifeForce} 
            color="text-emerald-400" 
            icon={<Sparkles className="w-4 h-4" />}
          />
          <ResourceDisplay 
            label="Ancient Mana" 
            value={mana} 
            color="text-blue-400" 
            icon={<Wind className="w-4 h-4" />}
          />
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden bg-slate-900/40 backdrop-blur-lg border border-white/5 rounded-2xl p-1.5 gap-1">
          <button 
            onClick={() => setActiveTab('main')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'main' ? "bg-white/10 text-white" : "text-slate-400"
            )}
          >
            <LayoutGrid className="w-4 h-4" /> Growth
          </button>
          <button 
            onClick={() => setActiveTab('chronicles')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
              activeTab === 'chronicles' ? "bg-white/10 text-white" : "text-slate-400"
            )}
          >
            <History className="w-4 h-4" /> Chronicles
          </button>
        </div>

        {/* Main Content Area */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* Action & Upgrades Column */}
          <div className={cn(
            "flex flex-col gap-6 w-full",
            activeTab !== 'main' && "hidden lg:flex"
          )}>
            {/* Mental Focus Section */}
            <section className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">Mental Focus</h2>
                </div>
                <span className="text-xs font-mono font-bold text-blue-300">{Math.floor(focus)} / {maxFocus}</span>
              </div>
              
              <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-300 relative",
                    focus >= 10 ? "bg-gradient-to-r from-blue-600 to-blue-400 animate-glow-blue shadow-[0_0_15px_rgba(96,165,250,0.5)]" : "bg-slate-700"
                  )}
                  style={{ width: `${(focus / maxFocus) * 100}%` }}
                >
                  {/* Sheen effect when focus is high */}
                  {focus >= 10 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 mt-1">
                <ActionButton 
                  onClick={actions.deepBreath} 
                  disabled={focus < 10}
                  icon={<Zap className="w-5 h-5 text-yellow-400" />}
                  label="Deep Breath"
                  sublabel="Spend 10 Focus"
                  primary={focus >= 10}
                  colorClass="btn-action-primary"
                />
                <ActionButton 
                  onClick={actions.meditate} 
                  disabled={lifeForce < 20 || focus >= maxFocus}
                  icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
                  label="Meditation"
                  sublabel="Life → Focus"
                  primary={lifeForce >= 20 && focus < maxFocus}
                  colorClass="btn-action-secondary"
                />
              </div>
            </section>

            {/* Evolution Upgrades Section */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Evolution Path</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <UpgradeCard 
                  title="Expansion" 
                  desc="Passive life growth" 
                  lv={upgrades.autoGrow} 
                  cost={autoGrowCost} 
                  canAfford={lifeForce >= autoGrowCost}
                  onClick={() => actions.buyUpgrade('autoGrow')}
                  color="emerald"
                />
                <UpgradeCard 
                  title="Photosynthesis" 
                  desc="Growth multiplier" 
                  lv={upgrades.efficiency} 
                  cost={efficiencyCost} 
                  canAfford={lifeForce >= efficiencyCost}
                  onClick={() => actions.buyUpgrade('efficiency')}
                  color="emerald"
                />
                <UpgradeCard 
                  title="Mana Pulse" 
                  desc="Passive mana generation" 
                  lv={upgrades.manaConductivity} 
                  cost={manaCost} 
                  canAfford={lifeForce >= manaCost}
                  onClick={() => actions.buyUpgrade('manaConductivity')}
                  color="blue"
                />
              </div>
            </section>
          </div>

          {/* Chronicles Column */}
          <section className={cn(
            "flex flex-col w-full h-full lg:sticky lg:top-10",
            activeTab !== 'chronicles' && "hidden lg:flex"
          )}>
            <div className="flex items-center justify-between mb-4 px-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-pink-400" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400/80">Chronicles</h2>
              </div>
            </div>
            
            <div className="flex-1 min-h-[400px] lg:min-h-[500px] bg-slate-900/20 backdrop-blur-xl border border-white/5 rounded-[2rem] p-2 relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
              
              <div className="h-[400px] lg:h-[600px] overflow-y-auto custom-scrollbar p-4 space-y-4">
                {log.map((entry, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "group/item transition-all duration-700",
                      i === 0 
                        ? "p-5 rounded-2xl bg-white/5 border border-white/10 shadow-xl opacity-100 translate-y-0" 
                        : "px-5 py-2 opacity-25 blur-[0.3px] hover:opacity-50"
                    )}
                  >
                    <div className="flex gap-4">
                      {i === 0 && <div className="w-1 bg-emerald-500 rounded-full animate-glow-emerald" />}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 opacity-40">
                          <span className="text-[8px] font-mono font-black uppercase tracking-widest">Entry #{log.length - i}</span>
                          {i === 0 && <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-black">LATEST</span>}
                        </div>
                        <p className={cn(
                          "leading-relaxed font-serif",
                          i === 0 ? "text-lg text-emerald-50 md:text-xl" : "text-sm text-slate-400"
                        )}>
                          {entry}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {log.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 italic py-20">
                    <BookOpen className="w-8 h-8 mb-4 opacity-10" />
                    <p className="text-xs uppercase tracking-[0.2em] opacity-40">No memories recorded</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer - Optimized for Mobile */}
        <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-6">
            <FooterLink icon={<Settings className="w-3.5 h-3.5" />} label="Settings" />
            <FooterLink icon={<HelpCircle className="w-3.5 h-3.5" />} label="Guide" />
            <FooterLink icon={<Save className="w-3.5 h-3.5" />} label="Save" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
              <div className="w-1 h-1 bg-emerald-500/40 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-emerald-500/40 rounded-full" />
            </div>
            <p className="text-[8px] md:text-[9px] font-mono font-bold tracking-[0.4em] text-slate-600 uppercase text-center">
              &copy; 2026 kiyo0128 & Akane • The Deep Root Engine
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
    <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl shadow-lg group hover:bg-slate-900/60 transition-colors">
      <div className="flex items-center gap-2 opacity-50 mb-2">
        <div className={cn("p-1 rounded-md bg-white/5", color.replace('text', 'bg').replace('400', '500/10'))}>
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <div className={cn("text-2xl md:text-4xl font-mono font-black tabular-nums tracking-tighter", color)}>
        {Math.floor(value).toLocaleString()}
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, icon, label, sublabel, primary, colorClass }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group w-full p-4 rounded-2xl transition-all duration-300 flex items-center gap-4 text-left overflow-hidden btn-action",
        disabled 
          ? "bg-black/20 border border-white/5 opacity-20 cursor-not-allowed grayscale" 
          : cn("bg-slate-800/50 border border-white/10", colorClass)
      )}
    >
      <div className={cn(
        "p-3 rounded-xl transition-all duration-500",
        primary ? "scale-110 shadow-lg" : "scale-100",
        disabled ? "bg-white/5" : primary ? "bg-white/10" : "bg-white/5"
      )}>
        <div className={cn(disabled ? "opacity-30" : "animate-pulse-slow")}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <div className={cn(
          "text-sm font-black uppercase tracking-tight transition-colors", 
          disabled ? "text-slate-500" : "text-white group-hover:text-white"
        )}>
          {label}
        </div>
        <div className="text-[9px] opacity-40 font-bold uppercase tracking-tighter mt-0.5">{sublabel}</div>
      </div>
      
      {!disabled && primary && (
        <div className="absolute right-4 animate-bounce-x">
           <ChevronDown className="w-4 h-4 -rotate-90 text-white/40" />
        </div>
      )}
      
      {/* Visual pulse for actionable state */}
      {!disabled && primary && (
        <div className="absolute inset-0 border-2 border-white/10 rounded-2xl animate-pulse" />
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
        "group relative flex flex-col p-4 md:p-5 rounded-2xl border transition-all duration-500 overflow-hidden btn-upgrade",
        canAfford 
          ? isEmerald 
            ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
            : "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.05)]"
          : "bg-black/40 border-white/5 opacity-40 cursor-not-allowed grayscale"
      )}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="text-left">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-100 group-hover:text-white transition-colors">{title}</div>
          <div className="text-[9px] opacity-50 font-bold uppercase tracking-tighter mt-1">{desc}</div>
        </div>
        <div className="text-[10px] font-mono font-black bg-white/5 px-2 py-1 rounded-lg text-white/40 border border-white/10 backdrop-blur-sm">
          LV.{lv}
        </div>
      </div>
      
      <div className="flex justify-between items-center relative z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">Require</span>
        <div className={cn(
          "text-base font-mono font-black tabular-nums", 
          canAfford ? isEmerald ? "text-emerald-400" : "text-blue-400" : "text-slate-500"
        )}>
          {Math.floor(cost).toLocaleString()}
        </div>
      </div>

      {/* Actionable Glow */}
      {canAfford && (
        <div className={cn(
          "absolute bottom-0 left-0 h-1 transition-all duration-1000",
          isEmerald ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
        )} style={{ width: '100%' }} />
      )}
    </button>
  );
}

function FooterLink({ label, icon }: { label: string, icon?: React.ReactNode }) {
  return (
    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors py-1">
      {icon && <span className="opacity-60">{icon}</span>}
      {label}
    </button>
  );
}

export default App;
