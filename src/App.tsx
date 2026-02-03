import { useEffect, useState } from 'react';
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
  Ghost,
  Trophy,
  Activity
} from 'lucide-react';

function App() {
  const { 
    lifeForce, mana, focus, maxFocus, upgrades, log, actions,
    enemy, soulFragments, multipliers, skills 
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<'actions' | 'evolve' | 'soul' | 'log'>('actions');

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
    <div className="fixed inset-0 bg-bg text-text flex flex-col p-5 md:p-10 select-none overflow-hidden">
      
      {/* HEADER: RESOURCE OVERVIEW */}
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TreeDeciduous className="text-primary w-5 h-5" />
            <h1 className="text-xl font-black tracking-tighter text-white">DEEP ROOT</h1>
          </div>
          <span className="text-[9px] font-mono text-text-muted/50 tracking-widest uppercase bg-surface px-2 py-0.5 border border-border">v0.4.0</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ResourceBlock label="LIFE" value={lifeForce} color="text-primary" icon={<Flame className="w-3 h-3" />} />
          <ResourceBlock label="MANA" value={mana} color="text-secondary" icon={<Zap className="w-3 h-3" />} />
          <ResourceBlock label="SOUL" value={soulFragments} color="text-accent" icon={<Trophy className="w-3 h-3" />} />
        </div>
      </header>

      {/* CENTER: STATUS & BATTLE */}
      <main className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* FOCUS BAR */}
        <section className="flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-secondary" />
              <h2 className="text-[10px] font-bold text-text-muted tracking-widest uppercase">Focus Capacity</h2>
            </div>
            <span className="font-mono text-[10px] font-bold text-secondary">
              {Math.floor(focus)} / {maxFocus}
            </span>
          </div>
          <div className="bar-container h-4 p-0.5">
            <div 
              className="bar-fill bg-secondary shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              style={{ width: `${(focus / maxFocus) * 100}%` }}
            />
          </div>
        </section>

        {/* BATTLE CARD */}
        <section className={`card-mobile relative flex-1 flex flex-col justify-center transition-colors duration-500 ${enemy ? 'border-danger/30 bg-red-950/5' : 'border-border'}`}>
          <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-40">
            <Swords className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Frontier</span>
          </div>

          <div className="flex flex-col items-center gap-5 z-10">
            {enemy ? (
              <>
                <div className="flex flex-col items-center animate-bounce-slow">
                  <Ghost className="w-16 h-16 text-danger mb-2 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
                  <h3 className="text-2xl font-black text-white">{enemy.name}</h3>
                  <span className="text-[10px] font-mono text-danger/80 bg-danger/10 px-3 py-1 mt-1 border border-danger/20 rounded-full tracking-widest uppercase">Enemy Detected</span>
                </div>
                
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-danger/80 px-1">
                    <span className="font-bold">HEALTH</span>
                    <span className="tabular-nums font-bold">{Math.max(0, Math.floor(enemy.hp)).toLocaleString()} / {enemy.maxHp.toLocaleString()}</span>
                  </div>
                  <div className="bar-container h-5 p-1 border-danger/30">
                    <div 
                      className="bar-fill bg-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                      style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-10">
                <div className="relative inline-block">
                  <Swords className="w-12 h-12 text-text-muted/20 mx-auto" />
                  <div className="absolute inset-0 animate-ping bg-text-muted/10 rounded-full" />
                </div>
                <div className="space-y-1">
                  <p className="text-text-muted text-sm font-medium">Scanning for abyss entities...</p>
                  <p className="text-[10px] text-text-muted/40 font-mono italic">Deep sensor depth: 2,500m</p>
                </div>
                <button 
                  onClick={actions.spawnEnemy}
                  className="btn-tool px-6 py-2 text-xs border-text-muted/30 bg-surface-elevated text-text-muted hover:text-white transition-colors"
                >
                  Manual Trigger
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* BOTTOM CONSOLE: TABS & ACTIONS */}
      <footer className="mt-6 flex flex-col gap-4">
        
        {/* TAB SWITCHER */}
        <nav className="flex gap-1 bg-surface p-1 rounded-xl border border-border">
          <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')} icon={<Activity className="w-4 h-4" />} label="Act" />
          <TabButton active={activeTab === 'evolve'} onClick={() => setActiveTab('evolve')} icon={<ArrowUpCircle className="w-4 h-4" />} label="Grow" />
          <TabButton active={activeTab === 'soul'} onClick={() => setActiveTab('soul')} icon={<Sparkles className="w-4 h-4" />} label="Soul" />
          <TabButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} icon={<BookOpen className="w-4 h-4" />} label="Logs" />
        </nav>

        {/* TAB CONTENT (Fixed height for thumb comfort) */}
        <div className="h-[240px] overflow-y-auto overflow-x-hidden px-1">
          {activeTab === 'actions' && (
            <div className="flex flex-col gap-4 pb-4">
              <LargeActionButton 
                onClick={actions.deepBreath} 
                disabled={focus < 10}
                icon={<Zap className="w-6 h-6" />}
                label="Deep Breath"
                sublabel="Consumption: 10 Focus"
                variant="green"
              />
              <LargeActionButton 
                onClick={actions.meditate} 
                disabled={lifeForce < 20 || focus >= maxFocus}
                icon={<Brain className="w-6 h-6" />}
                label="Meditate"
                sublabel="Exchange: 20 Life → 40 Focus"
                variant="blue"
              />
              <LargeActionButton 
                onClick={() => actions.activateSkill('purifyingRadiance')}
                disabled={mana < skills.purifyingRadiance.manaCost || skills.purifyingRadiance.active}
                icon={<Sparkles className="w-6 h-6" />}
                label="Purify Radiance"
                sublabel={skills.purifyingRadiance.active ? `ACTIVE: ${Math.ceil(skills.purifyingRadiance.timer)}s` : `Cost: ${skills.purifyingRadiance.manaCost} Mana`}
                variant="amber"
                isActive={skills.purifyingRadiance.active}
              />
            </div>
          )}

          {activeTab === 'evolve' && (activeTab === 'evolve' && (
            <div className="flex flex-col gap-3 pb-4">
              <header className="section-label">Evolution Nodes</header>
              <UpgradeRow 
                title="Root Expansion" 
                lv={upgrades.autoGrow} 
                cost={autoGrowCost} 
                canAfford={lifeForce >= autoGrowCost}
                onClick={() => actions.buyUpgrade('autoGrow')}
                color="text-primary"
              />
              <UpgradeRow 
                title="Photosynthesis" 
                lv={upgrades.efficiency} 
                cost={efficiencyCost} 
                canAfford={lifeForce >= efficiencyCost}
                onClick={() => actions.buyUpgrade('efficiency')}
                color="text-primary"
              />
              <UpgradeRow 
                title="Mana Conductivity" 
                lv={upgrades.manaConductivity} 
                cost={manaCost} 
                canAfford={lifeForce >= manaCost}
                onClick={() => actions.buyUpgrade('manaConductivity')}
                color="text-secondary"
              />
            </div>
          ))}

          {activeTab === 'soul' && (
            <div className="flex flex-col gap-3 pb-4">
              <header className="section-label">Soul Transcendence</header>
              <SoulUpgradeRow 
                title="Abyssal Sharpness"
                lv={Math.round((multipliers.attack - 1) * 5)}
                cost={soulAttackCost}
                canAfford={soulFragments >= soulAttackCost}
                onClick={() => actions.buySoulUpgrade('attack')}
                icon={<Swords className="w-5 h-5" />}
              />
              <SoulUpgradeRow 
                title="Eternal Growth"
                lv={Math.round((multipliers.growth - 1) * 5)}
                cost={soulGrowthCost}
                canAfford={soulFragments >= soulGrowthCost}
                onClick={() => actions.buySoulUpgrade('growth')}
                icon={<Flame className="w-5 h-5" />}
              />
            </div>
          )}

          {activeTab === 'log' && (
            <div className="bg-surface-elevated/50 rounded-xl p-4 flex flex-col-reverse gap-3 min-h-full border border-border/30">
              {log.length === 0 ? (
                <div className="text-text-muted/30 italic text-xs text-center py-10">Historical records are blank...</div>
              ) : (
                log.map((entry, i) => (
                  <div key={i} className={`text-[11px] leading-relaxed border-l-2 pl-3 transition-colors ${i === 0 ? 'text-white border-primary font-bold' : 'text-text-muted border-border/40'}`}>
                    {entry}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

// SUB-COMPONENTS

function ResourceBlock({ label, value, color, icon }: any) {
  return (
    <div className="bg-surface-elevated border-2 border-border/50 p-2 flex flex-col items-center justify-center rounded-xl shadow-inner">
      <div className="flex items-center gap-1 mb-1 opacity-60">
        {icon}
        <span className="text-[8px] font-black text-text-muted tracking-widest uppercase">{label}</span>
      </div>
      <span className={`text-sm font-black tabular-nums ${color}`}>
        {Math.floor(value).toLocaleString()}
      </span>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-1 rounded-lg transition-all ${active ? 'bg-surface-elevated text-white shadow-retro-small translate-y-[-2px]' : 'text-text-muted hover:text-white'}`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}

function LargeActionButton({ onClick, disabled, icon, label, sublabel, variant, isActive }: any) {
  const variantClass = variant === 'green' ? 'btn-green' : variant === 'blue' ? 'btn-blue' : 'btn-amber';
  
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn-tool ${variantClass} ${isActive ? 'btn-active-glow' : ''} p-4 rounded-xl flex-row justify-start gap-5`}
    >
      <div className="p-3 bg-black/30 border-2 border-white/5 rounded-xl shadow-inner group-active:scale-95 transition-transform">
        {icon}
      </div>
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-sm font-black tracking-tight text-white uppercase">{label}</span>
        <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">{sublabel}</span>
      </div>
    </button>
  );
}

function UpgradeRow({ title, lv, cost, canAfford, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className="btn-tool bg-surface-elevated flex-row justify-between items-center w-full px-4 py-3 rounded-xl border-border/40"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 bg-black/20 rounded-lg ${canAfford ? color : 'text-text-muted'}`}>
          <ArrowUpCircle className="w-5 h-5" />
        </div>
        <div className="text-left">
          <span className="font-black text-xs block text-white uppercase">{title}</span>
          <span className="text-[8px] font-mono font-black text-text-muted uppercase">Phase: {lv}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-xs font-black tabular-nums ${canAfford ? 'text-primary-light' : 'text-text-muted'}`}>
          {Math.floor(cost).toLocaleString()}
        </span>
        <span className="text-[7px] font-bold opacity-40 uppercase">Life Force</span>
      </div>
    </button>
  );
}

function SoulUpgradeRow({ title, lv, cost, canAfford, onClick, icon }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!canAfford}
      className="btn-tool bg-amber-950/5 flex-row justify-between items-center w-full px-4 py-3 rounded-xl border-amber-900/30"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 bg-black/20 rounded-lg ${canAfford ? 'text-accent' : 'text-text-muted'}`}>
          {icon}
        </div>
        <div className="text-left">
          <span className="font-black text-xs block text-white uppercase">{title}</span>
          <span className="text-accent/60 text-[8px] font-mono font-black uppercase tracking-widest">Memory Stage {lv}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`text-xs font-black tabular-nums ${canAfford ? 'text-accent' : 'text-text-muted'}`}>
          {cost}
        </span>
        <span className="text-[7px] font-bold opacity-40 uppercase">Soul Frag</span>
      </div>
    </button>
  );
}

export default App;
