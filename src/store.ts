import { create } from 'zustand';

interface GameState {
  lifeForce: number;
  totalLifeForce: number;
  mana: number;
  totalMana: number;
  focus: number;
  maxFocus: number;
  rootEssence: number;
  rootEssenceMultiplier: number;
  
  upgrades: {
    autoGrow: number;
    efficiency: number;
    manaConductivity: number;
  };
  
  log: string[];
  storyIndex: number;

  actions: {
    deepBreath: () => void;
    meditate: () => void;
    buyUpgrade: (type: 'autoGrow' | 'efficiency' | 'manaConductivity') => void;
    tick: (dt: number) => void;
    addLog: (msg: string) => void;
  };
}

const STORY_THRESHOLDS = [
  { threshold: 10, message: "かすかな光を感じる... あなたは種として目覚めた。" },
  { threshold: 50, message: "周囲の土壌から栄養を吸収し始めた。生存への第一歩だ。" },
  { threshold: 100, message: "根が少し伸びた。大地の底流にある微かな鼓動が聞こえる。" },
  { threshold: 500, message: "意識が広がる。自分の体が「植物」以上の何かであることを悟る。" },
  { threshold: 1000, message: "深い層へと到達した。古の魔力の脈動が、根を通じて流れ込む。" },
  { threshold: 5000, message: "深淵の記憶がフラッシュバックする。かつてここには巨大な樹があった。" },
];

export const useGameStore = create<GameState>((set) => ({
  lifeForce: 0,
  totalLifeForce: 0,
  mana: 0,
  totalMana: 0,
  focus: 100,
  maxFocus: 100,
  rootEssence: 0,
  rootEssenceMultiplier: 1,
  
  upgrades: {
    autoGrow: 0,
    efficiency: 1,
    manaConductivity: 0,
  },
  
  log: ["暗闇の中で目覚めた。"],
  storyIndex: 0,

  actions: {
    deepBreath: () => set((state) => {
      if (state.focus < 10) return state;
      const gain = 1 * state.upgrades.efficiency * state.rootEssenceMultiplier;
      return {
        lifeForce: state.lifeForce + gain,
        totalLifeForce: state.totalLifeForce + gain,
        focus: state.focus - 10
      };
    }),

    meditate: () => set((state) => {
      if (state.lifeForce < 20 || state.focus >= state.maxFocus) return state;
      return {
        lifeForce: state.lifeForce - 20,
        focus: Math.min(state.maxFocus, state.focus + 40)
      };
    }),

    buyUpgrade: (type) => set((state) => {
      const costs = {
        autoGrow: Math.pow(1.5, state.upgrades.autoGrow) * 10,
        efficiency: Math.pow(2, state.upgrades.efficiency) * 50,
        manaConductivity: Math.pow(3, state.upgrades.manaConductivity) * 200,
      };
      
      const cost = costs[type];
      if (state.lifeForce < cost) return state;

      return {
        lifeForce: state.lifeForce - cost,
        upgrades: {
          ...state.upgrades,
          [type]: state.upgrades[type] + 1
        }
      };
    }),

    tick: (dt) => set((state) => {
      // Focus recovery (passive)
      const focusRegen = 1 * dt;
      const newFocus = Math.min(state.maxFocus, state.focus + focusRegen);
      
      // Auto Grow
      const autoGain = state.upgrades.autoGrow * state.upgrades.efficiency * state.rootEssenceMultiplier * dt;
      const newLifeForce = state.lifeForce + autoGain;
      const newTotalLife = state.totalLifeForce + autoGain;

      // Mana generation
      const manaGain = state.upgrades.manaConductivity * 0.5 * dt;
      const newMana = state.mana + manaGain;
      const newTotalMana = state.totalMana + manaGain;

      // Story check
      let newStoryIndex = state.storyIndex;
      const newLog = [...state.log];
      if (newStoryIndex < STORY_THRESHOLDS.length && newTotalLife >= STORY_THRESHOLDS[newStoryIndex].threshold) {
        newLog.unshift(STORY_THRESHOLDS[newStoryIndex].message);
        newStoryIndex++;
      }

      return {
        focus: newFocus,
        lifeForce: newLifeForce,
        totalLifeForce: newTotalLife,
        mana: newMana,
        totalMana: newTotalMana,
        storyIndex: newStoryIndex,
        log: newLog.slice(0, 50)
      };
    }),

    addLog: (msg) => set((state) => ({
      log: [msg, ...state.log].slice(0, 50)
    }))
  }
}));
