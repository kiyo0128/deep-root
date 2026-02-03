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
  
  // Battle System
  enemy: {
    name: string;
    hp: number;
    maxHp: number;
    level: number;
  } | null;
  soulFragments: number;
  multipliers: {
    attack: number;
    growth: number;
  };
  skills: {
    purifyingRadiance: {
      active: boolean;
      timer: number;
      duration: number;
      manaCost: number;
    }
  };
  
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
    activateSkill: (skillId: 'purifyingRadiance') => void;
    buySoulUpgrade: (type: 'attack' | 'growth') => void;
    spawnEnemy: () => void;
  };
}

const STORY_THRESHOLDS = [
  { threshold: 10, message: "かすかな光を感じる... あなたは種として目覚めた。" },
  { threshold: 50, message: "周囲の土壌から栄養を吸収し始めた。生存への第一歩だ。" },
  { threshold: 100, message: "根が少し伸びた。大地の底流にある微かな鼓動が聞こえる。" },
  { threshold: 500, message: "意識が広がる。自分の体が「植物」以上の何かであることを悟る。" },
  { threshold: 1000, message: "深い層へと到達した。古の魔力の脈動が、根を通じて流れ込む。" },
  { threshold: 2500, message: "深淵の守護者が姿を現した。戦いの時だ。" },
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
  
  enemy: null,
  soulFragments: 0,
  multipliers: {
    attack: 1,
    growth: 1,
  },
  skills: {
    purifyingRadiance: {
      active: false,
      timer: 0,
      duration: 10,
      manaCost: 50,
    }
  },

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
      const gain = 1 * state.upgrades.efficiency * state.rootEssenceMultiplier * state.multipliers.growth;
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

    activateSkill: (skillId) => set((state) => {
      const skill = state.skills[skillId];
      if (state.mana < skill.manaCost || skill.active) return state;
      
      return {
        mana: state.mana - skill.manaCost,
        skills: {
          ...state.skills,
          [skillId]: { ...skill, active: true, timer: skill.duration }
        },
        log: [`【浄化の輝き】を発動！攻撃力が大幅に上昇した。`, ...state.log].slice(0, 50)
      };
    }),

    buySoulUpgrade: (type) => set((state) => {
      const cost = type === 'attack' 
        ? Math.floor(Math.pow(1.8, state.multipliers.attack - 1) * 10)
        : Math.floor(Math.pow(1.8, state.multipliers.growth - 1) * 10);
      
      if (state.soulFragments < cost) return state;

      return {
        soulFragments: state.soulFragments - cost,
        multipliers: {
          ...state.multipliers,
          [type]: state.multipliers[type] + 0.2
        },
        log: [`魂の力で${type === 'attack' ? '攻撃力' : '成長倍率'}を強化した。`, ...state.log].slice(0, 50)
      };
    }),

    spawnEnemy: () => set((state) => {
      const level = state.enemy ? state.enemy.level + 1 : 1;
      const names = ["深淵の守護者", "根を喰らう影", "忘却の亡霊", "闇の触手", "深層の捕食者"];
      const name = names[Math.floor(Math.random() * names.length)];
      const hp = 1000 * Math.pow(2, level - 1);
      
      return {
        enemy: {
          name: `${name} (Lv.${level})`,
          hp: hp,
          maxHp: hp,
          level: level
        },
        log: [`強大な気配を感じる... ${name}が現れた！`, ...state.log].slice(0, 50)
      };
    }),

    tick: (dt) => set((state) => {
      // Focus recovery (passive)
      const focusRegen = 1 * dt;
      const newFocus = Math.min(state.maxFocus, state.focus + focusRegen);
      
      // Auto Grow
      const autoGain = state.upgrades.autoGrow * state.upgrades.efficiency * state.rootEssenceMultiplier * state.multipliers.growth * dt;
      const newLifeForce = state.lifeForce + autoGain;
      const newTotalLife = state.totalLifeForce + autoGain;

      // Mana generation
      const manaGain = state.upgrades.manaConductivity * 0.5 * dt;
      const newMana = state.mana + manaGain;
      const newTotalMana = state.totalMana + manaGain;

      // Skills timer
      const newSkills = { ...state.skills };
      if (newSkills.purifyingRadiance.active) {
        newSkills.purifyingRadiance.timer -= dt;
        if (newSkills.purifyingRadiance.timer <= 0) {
          newSkills.purifyingRadiance.active = false;
          newSkills.purifyingRadiance.timer = 0;
        }
      }

      // Battle Logic
      let newEnemy = state.enemy ? { ...state.enemy } : null;
      let newSoulFragments = state.soulFragments;
      const newLog = [...state.log];

      if (newEnemy) {
        // Damage calculation based on Total Life Force (as requested)
        const baseAttack = Math.sqrt(state.totalLifeForce) * 5;
        const skillMult = state.skills.purifyingRadiance.active ? 5 : 1;
        const totalAttack = baseAttack * state.multipliers.attack * skillMult;
        
        newEnemy.hp -= totalAttack * dt;

        if (newEnemy.hp <= 0) {
          const reward = newEnemy.level * 5;
          newSoulFragments += reward;
          newLog.unshift(`${newEnemy.name}を撃破！ 魂の欠片を${reward}個獲得。`);
          newEnemy = null; // Wait for manual/auto spawn? Let's auto-spawn if reached threshold
        }
      } else if (state.totalLifeForce >= 2500) {
        // Auto-spawn first enemy at 2500 TLF
        const names = ["深淵の守護者"];
        const name = names[0];
        const hp = 1000;
        newEnemy = {
          name: `${name} (Lv.1)`,
          hp: hp,
          maxHp: hp,
          level: 1
        };
        newLog.unshift(`深淵の守護者が姿を現した。戦いの時だ。`);
      }

      // Story check
      let newStoryIndex = state.storyIndex;
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
        log: newLog.slice(0, 50),
        skills: newSkills,
        enemy: newEnemy,
        soulFragments: newSoulFragments
      };
    }),

    addLog: (msg) => set((state) => ({
      log: [msg, ...state.log].slice(0, 50)
    }))
  }
}));
