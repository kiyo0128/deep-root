import { create } from 'zustand';

interface GameState {
  lifeForce: number;
  totalLifeForce: number;
  focus: number;
  maxFocus: number;
  rootEssence: number;
  rootEssenceMultiplier: number;
  
  upgrades: {
    autoGrow: number;
    efficiency: number;
  };
  
  log: string[];
  storyIndex: number;

  actions: {
    deepBreath: () => void;
    buyUpgrade: (type: 'autoGrow' | 'efficiency') => void;
    tick: (dt: number) => void;
    addLog: (msg: string) => void;
  };
}

const STORY_THRESHOLDS = [
  { threshold: 10, message: "かすかな光を感じる... あなたは種として目覚めた。" },
  { threshold: 100, message: "根が少し伸びた。大地の鼓動が聞こえる。" },
  { threshold: 1000, message: "深い層へと到達した。魔力の脈動を感じる。" },
];

export const useGameStore = create<GameState>((set) => ({
  lifeForce: 0,
  totalLifeForce: 0,
  focus: 100,
  maxFocus: 100,
  rootEssence: 0,
  rootEssenceMultiplier: 1,
  
  upgrades: {
    autoGrow: 0,
    efficiency: 1,
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

    buyUpgrade: (type) => set((state) => {
      const cost = type === 'autoGrow' 
        ? Math.pow(1.5, state.upgrades.autoGrow) * 10 
        : Math.pow(2, state.upgrades.efficiency) * 50;
      
      if (state.lifeForce < cost) return state;

      return {
        lifeForce: state.lifeForce - cost,
        upgrades: {
          ...state.upgrades,
          [type]: type === 'autoGrow' ? state.upgrades.autoGrow + 1 : state.upgrades.efficiency + 1
        }
      };
    }),

    tick: (dt) => set((state) => {
      // Focus recovery
      const focusRegen = 2 * dt;
      const newFocus = Math.min(state.maxFocus, state.focus + focusRegen);
      
      // Auto Grow
      const autoGain = state.upgrades.autoGrow * state.upgrades.efficiency * state.rootEssenceMultiplier * dt;
      const newLifeForce = state.lifeForce + autoGain;
      const newTotal = state.totalLifeForce + autoGain;

      // Story check
      let newStoryIndex = state.storyIndex;
      const newLog = [...state.log];
      if (newStoryIndex < STORY_THRESHOLDS.length && newTotal >= STORY_THRESHOLDS[newStoryIndex].threshold) {
        newLog.unshift(STORY_THRESHOLDS[newStoryIndex].message);
        newStoryIndex++;
      }

      return {
        focus: newFocus,
        lifeForce: newLifeForce,
        totalLifeForce: newTotal,
        storyIndex: newStoryIndex,
        log: newLog.slice(0, 50)
      };
    }),

    addLog: (msg) => set((state) => ({
      log: [msg, ...state.log].slice(0, 50)
    }))
  }
}));
