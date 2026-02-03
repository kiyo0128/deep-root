import { useEffect } from 'react';
import { useGameStore } from './store';
import { GameLayout } from './components/layout/GameLayout';
import { ResourceCard } from './components/ui/ResourceCard';
import { BattleArena } from './components/game/BattleArena';
import { ActionPanel } from './components/game/ActionPanel';
import { Flame, Zap, Trophy, Activity } from 'lucide-react';

function App() {
  const store = useGameStore();
  const { lifeForce, mana, focus, maxFocus, soulFragments, actions, enemy } = store;

  useEffect(() => {
    const interval = setInterval(() => {
      actions.tick(0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [actions]);

  return (
    <GameLayout
      header={
        <span className="text-[10px] font-mono text-text-dim tracking-widest uppercase bg-surface px-2 py-0.5 border border-border rounded-md">v0.4.0 (Remastered)</span>
      }
      leftPanel={
        <>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Activity className="w-4 h-4 text-text-muted" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Vital Metrics</h2>
          </div>

          <ResourceCard
            label="Focus Capacity"
            value={focus}
            max={maxFocus}
            color="text-secondary"
            icon={Activity}
            subLabel="Regenerates over time"
          />
          <ResourceCard
            label="Life Force"
            value={lifeForce}
            color="text-primary"
            icon={Flame}
            subLabel="Raw biological energy"
            trend={1}
          />
          <ResourceCard
            label="Mana Essence"
            value={mana}
            color="text-blue-400"
            icon={Zap}
            subLabel="Magical conductivity"
          />
          <ResourceCard
            label="Soul Fragments"
            value={soulFragments}
            color="text-accent"
            icon={Trophy}
            subLabel="Condensed memories"
          />
        </>
      }
      centerPanel={
        <BattleArena
          enemy={enemy}
          onSpawn={actions.spawnEnemy}
        />
      }
      rightPanel={
        <ActionPanel store={store} />
      }
      footer={
        <div className="hidden lg:block text-[10px] text-text-muted/40 font-mono tracking-widest mt-4">
          SYSTEM STATUS: OPTIMAL // DEEP_ROOT_PROTOCOL_V4
        </div>
      }
    />
  );
}

export default App;
