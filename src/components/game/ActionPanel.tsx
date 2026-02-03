import { useState } from 'react';
import { Zap, Brain, Sparkles, ArrowUpCircle, BookOpen, Swords } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';

interface ActionPanelProps {
    store: any; // Using any for speed, but ideally strictly typed from useGameStore
}

export function ActionPanel({ store }: ActionPanelProps) {
    const [activeTab, setActiveTab] = useState<'actions' | 'growth' | 'soul' | 'log'>('actions');

    const { lifeForce, maxFocus, focus, mana, actions, upgrades, multipliers, soulFragments, skills, log } = store;

    const tabs = [
        { id: 'actions', label: 'Actions', icon: Zap },
        { id: 'growth', label: 'Growth', icon: ArrowUpCircle },
        { id: 'soul', label: 'Soul', icon: Sparkles },
        { id: 'log', label: 'Log', icon: BookOpen },
    ] as const;

    // Cost calculations
    const autoGrowCost = Math.pow(1.5, upgrades.autoGrow) * 10;
    const efficiencyCost = Math.pow(2, upgrades.efficiency) * 50;
    const manaCost = Math.pow(3, upgrades.manaConductivity) * 200;
    const soulAttackCost = Math.floor(Math.pow(1.8, multipliers.attack - 1) * 10);
    const soulGrowthCost = Math.floor(Math.pow(1.8, multipliers.growth - 1) * 10);

    return (
        <div className="flex flex-col h-full bg-surface/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
            {/* Tabs */}
            <div className="flex p-1 gap-1 bg-black/20 border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all
              ${activeTab === tab.id
                                ? 'bg-surface-active text-white shadow-lg'
                                : 'text-text-muted hover:text-white hover:bg-white/5'}`
                        }
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">

                {activeTab === 'actions' && (
                    <>
                        <ActionButton
                            label="Deep Breath"
                            subLabel="Focus → Life Force"
                            cost="10 Focus"
                            icon={<Zap className="w-6 h-6" />}
                            variant="primary"
                            disabled={focus < 10}
                            onClick={actions.deepBreath}
                        />
                        <ActionButton
                            label="Meditate"
                            subLabel="Life → Focus Recovery"
                            cost="20 Life"
                            icon={<Brain className="w-6 h-6" />}
                            variant="secondary"
                            disabled={lifeForce < 20 || focus >= maxFocus}
                            onClick={actions.meditate}
                        />
                        <div className="section-gap" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Combat Skills</h4>
                        <ActionButton
                            label="Purifying Radiance"
                            subLabel={skills.purifyingRadiance.active ? `Active: ${Math.ceil(skills.purifyingRadiance.timer)}s` : "Boost Atk: 500%"}
                            cost={`${skills.purifyingRadiance.manaCost} Mana`}
                            icon={<Sparkles className="w-6 h-6" />}
                            variant="accent"
                            isActive={skills.purifyingRadiance.active}
                            disabled={mana < skills.purifyingRadiance.manaCost || skills.purifyingRadiance.active}
                            onClick={() => actions.activateSkill('purifyingRadiance')}
                        />
                    </>
                )}

                {activeTab === 'growth' && (
                    <>
                        <ActionButton
                            label="Root Expansion"
                            subLabel={`Lv. ${upgrades.autoGrow} (Auto-Gain)`}
                            cost={Math.floor(autoGrowCost).toLocaleString()}
                            icon={<ArrowUpCircle className="w-6 h-6" />}
                            variant="primary"
                            disabled={lifeForce < autoGrowCost}
                            onClick={() => actions.buyUpgrade('autoGrow')}
                        />
                        <ActionButton
                            label="Photosynthesis"
                            subLabel={`Lv. ${upgrades.efficiency} (Efficiency)`}
                            cost={Math.floor(efficiencyCost).toLocaleString()}
                            icon={<ArrowUpCircle className="w-6 h-6" />}
                            variant="primary"
                            disabled={lifeForce < efficiencyCost}
                            onClick={() => actions.buyUpgrade('efficiency')}
                        />
                        <ActionButton
                            label="Mana Conductivity"
                            subLabel={`Lv. ${upgrades.manaConductivity} (Mana Gen)`}
                            cost={Math.floor(manaCost).toLocaleString()}
                            icon={<Zap className="w-6 h-6" />}
                            variant="secondary"
                            disabled={lifeForce < manaCost}
                            onClick={() => actions.buyUpgrade('manaConductivity')}
                        />
                    </>
                )}

                {activeTab === 'soul' && (
                    <>
                        <div className="p-4 bg-accent/5 border border-accent/20 rounded-xl mb-4 text-center">
                            <span className="text-xs text-accent uppercase font-bold tracking-widest block mb-1">Soul Fragments</span>
                            <span className="text-3xl font-black text-white">{soulFragments}</span>
                        </div>

                        <ActionButton
                            label="Abyssal Sharpness"
                            subLabel={`Rank ${Math.round((multipliers.attack - 1) * 5)}`}
                            cost={`${soulAttackCost} Soul`}
                            icon={<Swords className="w-6 h-6" />}
                            variant="accent"
                            disabled={soulFragments < soulAttackCost}
                            onClick={() => actions.buySoulUpgrade('attack')}
                        />
                        <ActionButton
                            label="Eternal Growth"
                            subLabel={`Rank ${Math.round((multipliers.growth - 1) * 5)}`}
                            cost={`${soulGrowthCost} Soul`}
                            icon={<ArrowUpCircle className="w-6 h-6" />}
                            variant="accent"
                            disabled={soulFragments < soulGrowthCost}
                            onClick={() => actions.buySoulUpgrade('growth')}
                        />
                    </>
                )}

                {activeTab === 'log' && (
                    <div className="space-y-2 font-mono text-xs">
                        {log.length === 0 ? (
                            <div className="text-center text-text-dim py-10 opacity-50">No records found.</div>
                        ) : (
                            log.map((entry: string, i: number) => (
                                <div key={i} className={`p-2 border-l-2 ${i === 0 ? 'border-primary text-white bg-white/5' : 'border-border text-text-muted'}`}>
                                    <span className="opacity-50 mr-2">[{i === 0 ? 'NEW' : 'OLD'}]</span>
                                    {entry}
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
