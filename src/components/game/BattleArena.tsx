import { Swords, Ghost } from 'lucide-react';

interface Enemy {
    name: string;
    hp: number;
    maxHp: number;
    level: number;
}

interface BattleArenaProps {
    enemy: Enemy | null;
    onSpawn: () => void;
}

export function BattleArena({ enemy, onSpawn }: BattleArenaProps) {
    return (
        <div className={`
      relative w-full aspect-[4/3] md:aspect-video rounded-3xl border-2 overflow-hidden transition-all duration-500 flex flex-col items-center justify-center p-6
      ${enemy
                ? 'border-danger/30 bg-gradient-to-b from-red-950/20 to-black'
                : 'border-border/50 bg-surface/50'}
    `}>
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {/* Status Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${enemy ? 'bg-danger animate-ping' : 'bg-primary'}`} />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-text-muted">
                    {enemy ? 'COMBAT MODE' : 'SCANNING_DEPTH_CHART'}
                </span>
            </div>

            <div className="z-10 w-full flex flex-col items-center justify-center text-center">
                {enemy ? (
                    <div className="animate-in fade-in zoom-in duration-500 w-full max-w-md">
                        <div className="relative mb-6 mx-auto w-fit">
                            <Ghost className="w-24 h-24 text-danger drop-shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-float" />
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-2 bg-black/50 blur-lg rounded-[100%]" />
                        </div>

                        <h3 className="text-3xl font-black text-white tracking-tighter mb-1 drop-shadow-md">{enemy.name}</h3>
                        <span className="text-xs font-mono text-danger font-bold border border-danger/30 px-2 py-0.5 rounded bg-danger/10 mb-6 inline-block">
                            THREAT LEVEL {enemy.level}
                        </span>

                        {/* HP Bar */}
                        <div className="w-full bg-black/40 border border-danger/30 h-8 rounded-full p-1 relative overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-danger rounded-full relative overflow-hidden transition-all duration-100 ease-out shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                                style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] opacity-30 animate-[move-stripes_1s_linear_infinite]" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-black text-white/90 drop-shadow-sm tracking-wider">
                                    {Math.ceil(enemy.hp).toLocaleString()} / {enemy.maxHp.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <Swords className="w-16 h-16 text-text-muted/20 relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-text-muted font-medium text-sm">No hostile signatures detected.</p>
                            <p className="text-[10px] text-text-dim font-mono">Deep sensors active. Waiting for signal...</p>
                        </div>
                        <button
                            onClick={onSpawn}
                            className="mt-4 px-6 py-2 bg-surface-active border border-border hover:border-text-muted text-xs font-bold uppercase tracking-wider rounded-lg transition-all hover:bg-surface-hover hover:text-white"
                        >
                            Manual Override: Summon
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
