import { useEffect } from 'react';
import { useGameStore } from './store';
import { 
  TreeDeciduous, 
  Zap, 
  BookOpen, 
  Brain,
  ArrowUpCircle
} from 'lucide-react';

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
    <div className="min-h-screen bg-bg text-text p-4 md:p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        
        {/* HEADER: TITLE */}
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TreeDeciduous className="text-primary w-8 h-8" />
            <h1 className="text-3xl font-black text-white tracking-tighter">DEEP ROOT</h1>
          </div>
          <p className="text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase">SYSTEM VERSION 1.0.0 // STABLE</p>
        </header>

        {/* SECTION: MAIN RESOURCES */}
        <section className="grid grid-cols-2 gap-px bg-border border-2 border-border">
          <ResourceDisplay label="LIFE FORCE" value={lifeForce} color="text-primary" />
          <ResourceDisplay label="ANCIENT MANA" value={mana} color="text-secondary" />
        </section>

        {/* SECTION: FOCUS STATUS */}
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-bold text-text-muted">FOCUS CAPACITY</h2>
            <span className="font-mono text-sm font-bold text-secondary">
              {Math.floor(focus)} / {maxFocus}
            </span>
          </div>
          <div className="h-6 bg-surface border-2 border-border p-1">
            <div 
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${(focus / maxFocus) * 100}%` }}
            />
          </div>
        </section>

        {/* SECTION: CORE ACTIONS */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-text-muted border-l-4 border-primary pl-2">CORE ACTIONS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionButton 
              onClick={actions.deepBreath} 
              disabled={focus < 10}
              icon={<Zap className="w-6 h-6" />}
              label="Deep Breath"
              sublabel="Cost: 10 Focus"
              variant="emerald"
            />
            <ActionButton 
              onClick={actions.meditate} 
              disabled={lifeForce < 20 || focus >= maxFocus}
              icon={<Brain className="w-6 h-6" />}
              label="Meditate"
              sublabel="20 Life → 40 Focus"
              variant="blue"
            />
          </div>
        </section>

        {/* SECTION: EVOLUTION (UPGRADES) */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-bold text-text-muted border-l-4 border-primary pl-2">EVOLUTION PATH</h2>
          <div className="flex flex-col gap-3">
            <UpgradeItem 
              title="ROOT EXPANSION" 
              desc="Higher passive life growth" 
              lv={upgrades.autoGrow} 
              cost={autoGrowCost} 
              canAfford={lifeForce >= autoGrowCost}
              onClick={() => actions.buyUpgrade('autoGrow')}
              color="text-primary"
            />
            <UpgradeItem 
              title="PHOTOSYNTHESIS" 
              desc="Growth efficiency multiplier" 
              lv={upgrades.efficiency} 
              cost={efficiencyCost} 
              canAfford={lifeForce >= efficiencyCost}
              onClick={() => actions.buyUpgrade('efficiency')}
              color="text-primary"
            />
            <UpgradeItem 
              title="MANA CONDUCTIVITY" 
              desc="Passive mana harvesting" 
              lv={upgrades.manaConductivity} 
              cost={manaCost} 
              canAfford={lifeForce >= manaCost}
              onClick={() => actions.buyUpgrade('manaConductivity')}
              color="text-secondary"
            />
          </div>
        </section>

        {/* SECTION: CHRONICLES (LOG) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-text-muted" />
            <h2 className="text-xs font-bold text-text-muted">CHRONICLES</h2>
          </div>
          <div className="bg-surface border-2 border-border h-48 overflow-y-auto flex flex-col-reverse p-4 gap-2 font-mono text-xs">
            {log.length === 0 ? (
              <div className="text-text-muted italic opacity-50">Log is empty...</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className="border-b border-border pb-2 last:border-0">
                  <span className="text-text-muted mr-2">[{log.length - i}]</span>
                  <span className={i === 0 ? "text-white font-bold" : "text-text-muted"}>{entry}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="text-center pt-8 border-t border-border">
          <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
            Deep Root Engine // Powered by Clarity
          </p>
        </footer>
      </div>
    </div>
  );
}

// SUB-COMPONENTS

function ResourceDisplay({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-surface p-4 flex flex-col items-center">
      <span className="text-[10px] font-bold text-text-muted mb-1">{label}</span>
      <span className={`text-2xl md:text-3xl font-black tabular-nums ${color}`}>
        {Math.floor(value).toLocaleString()}
      </span>
    </div>
  );
}

function ActionButton({ onClick, disabled, icon, label, sublabel, variant }: any) {
  const variantClass = variant === 'emerald' ? 'btn-emerald' : 'btn-blue';
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn-practical ${variantClass} min-h-[100px]`}
    >
      <div className="flex items-center gap-4 w-full">
        <div className="p-2 bg-black/20 border-2 border-black/10">
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-black leading-tight">{label}</span>
          <span className="text-[10px] font-bold opacity-70">{sublabel}</span>
        </div>
      </div>
    </button>
  );
}

function UpgradeItem({ title, desc, lv, cost, canAfford, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className="btn-practical flex-row justify-between items-center w-full text-left p-4 h-auto"
    >
      <div className="flex items-center gap-4">
        <ArrowUpCircle className={`w-8 h-8 ${canAfford ? color : 'text-text-muted'}`} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-sm">{title}</span>
            <span className="bg-border px-1 text-[10px] font-mono">LV.{lv}</span>
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-tight">{desc}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-bold text-text-muted uppercase">Cost</span>
        <span className={`text-lg font-black tabular-nums ${canAfford ? color : 'text-text-muted'}`}>
          {Math.floor(cost).toLocaleString()}
        </span>
      </div>
    </button>
  );
}

export default App;
