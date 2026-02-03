import { useEffect } from 'react';
import { useGameStore } from './store';
import { 
  TreeDeciduous, 
  Zap, 
  BookOpen, 
  Brain,
  ArrowUpCircle,
  Swords,
  Sparkles,
  Flame,
  Ghost
} from 'lucide-react';

function App() {
  const { 
    lifeForce, mana, focus, maxFocus, upgrades, log, actions,
    enemy, soulFragments, multipliers, skills 
  } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      actions.tick(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [actions]);

  const autoGrowCost = Math.pow(1.5, upgrades.autoGrow) * 10;
  const efficiencyCost = Math.pow(2, upgrades.efficiency) * 50;
  const manaCost = Math.pow(3, upgrades.manaConductivity) * 200;

  const soulAttackCost = Math.floor(Math.pow(1.8, multipliers.attack - 1) * 10);
  const soulGrowthCost = Math.floor(Math.pow(1.8, multipliers.growth - 1) * 10);

  return (
    <div className="min-h-screen bg-bg text-text p-4 md:p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        
        {/* HEADER: TITLE */}
        <header className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <TreeDeciduous className="text-primary w-8 h-8" />
            <h1 className="text-3xl font-black text-white tracking-tighter">DEEP ROOT</h1>
          </div>
          <p className="text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase">SYSTEM VERSION 0.4.0 // BATTLE SYSTEM</p>
        </header>

        {/* SECTION: MAIN RESOURCES */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border border-2 border-border">
          <ResourceDisplay label="LIFE FORCE" value={lifeForce} color="text-primary" />
          <ResourceDisplay label="ANCIENT MANA" value={mana} color="text-secondary" />
          <ResourceDisplay label="SOUL FRAGMENTS" value={soulFragments} color="text-amber-400" className="col-span-2 md:col-span-1" />
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
              className="h-full bg-secondary transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${(focus / maxFocus) * 100}%` }}
            />
          </div>
        </section>

        {/* SECTION: BATTLE AREA (v0.4.0) */}
        <section className="flex flex-col gap-4 py-4 px-6 bg-surface border-4 border-red-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Swords className="w-24 h-24" />
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-black text-red-500 tracking-widest uppercase">Battle Front</h2>
            {enemy ? (
              <span className="bg-red-950 text-red-400 px-2 py-0.5 text-[10px] font-mono border border-red-900">ACTIVE</span>
            ) : (
              <button 
                onClick={actions.spawnEnemy}
                className="bg-zinc-800 text-zinc-400 px-2 py-0.5 text-[10px] font-mono border border-zinc-700 hover:bg-zinc-700 transition-colors"
              >
                SPAWN ENEMY
              </button>
            )}
          </div>

          <div className="min-h-[120px] flex flex-col items-center justify-center gap-4 relative z-10">
            {enemy ? (
              <>
                <div className="text-center animate-pulse">
                  <Ghost className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <span className="text-xl font-black text-white">{enemy.name}</span>
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-[10px] font-mono mb-1 text-red-400">
                    <span>HP STATUS</span>
                    <span>{Math.max(0, Math.floor(enemy.hp)).toLocaleString()} / {enemy.maxHp.toLocaleString()}</span>
                  </div>
                  <div className="h-4 bg-black/40 border-2 border-red-900/50 p-0.5">
                    <div 
                      className="h-full bg-red-600 transition-all duration-100"
                      style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-text-muted/30 italic text-sm font-mono flex flex-col items-center gap-2">
                <Swords className="w-8 h-8 opacity-20" />
                <span>Scanning for abyss entities...</span>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: SKILLS & CORE ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-text-muted border-l-4 border-secondary pl-2 uppercase">Core Actions</h2>
            <div className="flex flex-col gap-3">
              <ActionButton 
                onClick={actions.deepBreath} 
                disabled={focus < 10}
                icon={<Zap className="w-5 h-5" />}
                label="Deep Breath"
                sublabel="Cost: 10 Focus"
                variant="emerald"
              />
              <ActionButton 
                onClick={actions.meditate} 
                disabled={lifeForce < 20 || focus >= maxFocus}
                icon={<Brain className="w-5 h-5" />}
                label="Meditate"
                sublabel="20 Life → 40 Focus"
                variant="blue"
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-text-muted border-l-4 border-amber-500 pl-2 uppercase">Ancient Skills</h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => actions.activateSkill('purifyingRadiance')}
                disabled={mana < skills.purifyingRadiance.manaCost || skills.purifyingRadiance.active}
                className={`btn-practical ${skills.purifyingRadiance.active ? 'btn-active-skill' : 'btn-amber'} min-h-[80px]`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-black/20 border-2 border-black/10">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-black leading-tight uppercase">Purifying Radiance</span>
                    <span className="text-[10px] font-bold opacity-70">
                      {skills.purifyingRadiance.active 
                        ? `ACTIVE: ${Math.ceil(skills.purifyingRadiance.timer)}s` 
                        : `Cost: ${skills.purifyingRadiance.manaCost} Mana`
                      }
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* SECTION: EVOLUTION & SOUL UPGRADES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-text-muted border-l-4 border-primary pl-2 uppercase">Evolution Path</h2>
            <div className="flex flex-col gap-3">
              <UpgradeItem 
                title="ROOT EXPANSION" 
                lv={upgrades.autoGrow} 
                cost={autoGrowCost} 
                canAfford={lifeForce >= autoGrowCost}
                onClick={() => actions.buyUpgrade('autoGrow')}
                color="text-primary"
              />
              <UpgradeItem 
                title="PHOTOSYNTHESIS" 
                lv={upgrades.efficiency} 
                cost={efficiencyCost} 
                canAfford={lifeForce >= efficiencyCost}
                onClick={() => actions.buyUpgrade('efficiency')}
                color="text-primary"
              />
              <UpgradeItem 
                title="MANA CONDUCTIVITY" 
                lv={upgrades.manaConductivity} 
                cost={manaCost} 
                canAfford={lifeForce >= manaCost}
                onClick={() => actions.buyUpgrade('manaConductivity')}
                color="text-secondary"
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xs font-bold text-text-muted border-l-4 border-amber-500 pl-2 uppercase">Soul Transcendence</h2>
            <div className="flex flex-col gap-3">
              <SoulUpgradeItem 
                title="Abyssal Sharpness"
                lv={Math.round((multipliers.attack - 1) * 5)}
                cost={soulAttackCost}
                canAfford={soulFragments >= soulAttackCost}
                onClick={() => actions.buySoulUpgrade('attack')}
                icon={<Swords className="w-5 h-5" />}
              />
              <SoulUpgradeItem 
                title="Eternal Growth"
                lv={Math.round((multipliers.growth - 1) * 5)}
                cost={soulGrowthCost}
                canAfford={soulFragments >= soulGrowthCost}
                onClick={() => actions.buySoulUpgrade('growth')}
                icon={<Flame className="w-5 h-5" />}
              />
            </div>
          </section>
        </div>

        {/* SECTION: CHRONICLES (LOG) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-text-muted" />
            <h2 className="text-xs font-bold text-text-muted tracking-widest uppercase">Chronicles</h2>
          </div>
          <div className="bg-surface border-2 border-border h-48 overflow-y-auto flex flex-col-reverse p-4 gap-2 font-mono text-[11px]">
            {log.length === 0 ? (
              <div className="text-text-muted italic opacity-30">Log is empty...</div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className={`border-b border-border/50 pb-2 last:border-0 ${i === 0 ? 'text-white' : 'text-text-muted'}`}>
                  <span className="opacity-30 mr-2">[{log.length - i}]</span>
                  <span className={i === 0 ? "font-bold" : ""}>{entry}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="text-center pt-8 border-t border-border/50">
          <p className="text-[9px] font-mono text-text-muted uppercase tracking-[0.4em]">
            Deep Root Engine // v0.4.0 // Abyss Expansion
          </p>
        </footer>
      </div>
    </div>
  );
}

// SUB-COMPONENTS

function ResourceDisplay({ label, value, color, className = "" }: { label: string, value: number, color: string, className?: string }) {
  return (
    <div className={`bg-surface p-4 flex flex-col items-center ${className}`}>
      <span className="text-[10px] font-black text-text-muted mb-1 tracking-tighter uppercase">{label}</span>
      <span className={`text-xl md:text-2xl font-black tabular-nums ${color}`}>
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
      className={`btn-practical ${variantClass} p-3 min-h-[70px]`}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="p-2 bg-black/20 border-2 border-black/10">
          {icon}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-black leading-tight uppercase">{label}</span>
          <span className="text-[10px] font-bold opacity-70 lowercase">{sublabel}</span>
        </div>
      </div>
    </button>
  );
}

function UpgradeItem({ title, lv, cost, canAfford, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className="btn-practical flex-row justify-between items-center w-full text-left p-3 h-auto"
    >
      <div className="flex items-center gap-3">
        <ArrowUpCircle className={`w-6 h-6 ${canAfford ? color : 'text-text-muted'}`} />
        <div>
          <span className="font-black text-xs block uppercase">{title}</span>
          <span className="bg-border px-1 text-[9px] font-mono">LV.{lv}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black tabular-nums">
          {Math.floor(cost).toLocaleString()}
        </span>
      </div>
    </button>
  );
}

function SoulUpgradeItem({ title, lv, cost, canAfford, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className="btn-practical flex-row justify-between items-center w-full text-left p-3 h-auto btn-amber-border"
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 bg-black/20 border-2 ${canAfford ? 'border-amber-500/50 text-amber-500' : 'border-zinc-700 text-zinc-600'}`}>
          {icon}
        </div>
        <div>
          <span className="font-black text-xs block uppercase">{title}</span>
          <span className="text-amber-600/70 text-[9px] font-mono font-bold">STAGE {lv}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-xs font-black tabular-nums ${canAfford ? 'text-amber-400' : 'text-zinc-600'}`}>
          {cost} <span className="text-[8px] uppercase">Fragments</span>
        </span>
      </div>
    </button>
  );
}

export default App;
