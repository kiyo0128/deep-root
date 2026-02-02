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
    meditation: number;
  };
  
  log: string[];
  storyIndex: number;

  actions: {
    deepBreath: () => void;
    meditate: () => void;
    buyUpgrade: (type: 'autoGrow' | 'efficiency' | 'manaConductivity' | 'meditation') => void;
    tick: (dt: number) => void;
    addLog: (msg: string) => void;
  };
}

const STORY_THRESHOLDS = [
  { threshold: 10, message: "かすかな光を感じる... あなたは種として目覚めた。" },
  { threshold: 100, message: "根が少し伸びた。大地の鼓動が聞こえる。" },
  { threshold: 1000, message: "深い層へと到達した。魔力の脈動を感じる。" },
  { threshold: 5000, message: "最初の双葉が地表に現れた。外界の風が心地よい。" },
  { threshold: 20000, message: "魔力の回路が全身を巡る。自己の存在が確立された。" },
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
    meditation: 1,
  },
  
  log: ["暗闇の中で目覚めた。"],
  storyIndex: 0,

  actions: {
    deepBreath: () => set((state) => {
      if (state.focus < 10) return state;
      const gain = 1 * state.upgrades.efficiency * state.rootEssenceMultiplier;
      const manaGain = state.upgrades.manaConductivity * 0.1;
      return {
        lifeForce: state.lifeForce + gain,
        totalLifeForce: state.totalLifeForce + gain,
        mana: state.mana + manaGain,
        totalMana: state.totalMana + manaGain,
        focus: state.focus - 10
      };
    }),

    meditate: () => set((state) => {
      if (state.lifeForce < 5) return state;
      const focusGain = 20 * state.upgrades.meditation;
      return {
        lifeForce: state.lifeForce - 5,
        focus: Math.min(state.maxFocus, state.focus + focusGain)
      };
    }),

    buyUpgrade: (type) => set((state) => {
      let cost = 0;
      switch(type) {
        case 'autoGrow': cost = Math.pow(1.5, state.upgrades.autoGrow) * 10; break;
        case 'efficiency': cost = Math.pow(2, state.upgrades.efficiency) * 50; break;
        case 'manaConductivity': cost = Math.pow(1.8, state.upgrades.manaConductivity) * 200; break;
        case 'meditation': cost = Math.pow(2.2, state.upgrades.meditation) * 100; break;
      }
      
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
      const focusRegen = (1 + state.upgrades.meditation * 0.2) * dt;
      const newFocus = Math.min(state.maxFocus, state.focus + focusRegen);
      
      // Auto Grow
      const autoGain = state.upgrades.autoGrow * state.upgrades.efficiency * state.rootEssenceMultiplier * dt;
      const newLifeForce = state.lifeForce + autoGain;
      const newTotal = state.totalLifeForce + autoGain;

      // Mana Regen (if conductive)
      const manaRegen = state.upgrades.manaConductivity * 0.05 * dt;
      const newMana = state.mana + manaRegen;
      const newTotalMana = state.totalMana + manaRegen;

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
