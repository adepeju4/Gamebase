import { createStore, action } from 'easy-peasy';

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

interface StoreModel {
  user: User | null;
  activeGame: string | null;
  activeGamePath: string | null;
  channel: any;
  rivals: any[];
  gameStats: Record<string, GameStats>;
  setUser: (state: StoreModel, payload: User | null) => void;
  setActiveGame: (state: StoreModel, payload: string) => void;
  setActiveGamePath: (state: StoreModel, payload: string) => void;
  setChannel: (state: StoreModel, payload: any) => void;
  setRivals: (state: StoreModel, payload: any[]) => void;
  setGameStat: (state: StoreModel, payload: { gameId: string, outcome: 'win' | 'loss' | 'draw' }) => void;
}

const store = createStore<StoreModel>({
  user: null,
  activeGame: null,
  activeGamePath: null,
  channel: null,
  rivals: [],
  gameStats: {},
  
  setUser: action((state, payload) => {
    state.user = payload;
  }),
  
  setActiveGame: action((state, payload) => {
    state.activeGame = payload;
  }),
  
  setActiveGamePath: action((state, payload) => {
    state.activeGamePath = payload;
  }),
  
  setChannel: action((state, payload) => {
    state.channel = payload;
  }),
  
  setRivals: action((state, payload) => {
    state.rivals = payload;
  }),
  
  setGameStat: action((state, payload) => {
    const { gameId, outcome } = payload;
    
    if (!state.gameStats[gameId]) {
      state.gameStats[gameId] = { wins: 0, losses: 0, draws: 0 };
    }
    
    state.gameStats[gameId][outcome === 'win' ? 'wins' : outcome === 'loss' ? 'losses' : 'draws']++;
  }),
});

export default store; 