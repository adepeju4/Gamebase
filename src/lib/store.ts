import { createStore, action } from 'easy-peasy';
import { User } from '../types/index';

interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

interface GameRoom {
  id: string;
  name: string;
  players: string[];
  rivals: string[];
}

interface StoreModel {
  user: User | null;
  activeGame: string | null;
  activeGamePath: string | null;
  gameRoom: GameRoom | null;
  rivals: string[];
  gameStats: Record<string, GameStats>;
  socketConnected: boolean;
  setUser: (state: StoreModel, payload: User | null) => void;
  setActiveGame: (state: StoreModel, payload: string) => void;
  setActiveGamePath: (state: StoreModel, payload: string) => void;
  setGameRoom: (state: StoreModel, payload: GameRoom | null) => void;
  setRivals: (state: StoreModel, payload: string[]) => void;
  setGameStat: (
    state: StoreModel,
    payload: { gameId: string; outcome: 'win' | 'loss' | 'draw' }
  ) => void;
  setSocketConnected: (state: StoreModel, payload: boolean) => void;
}

const store = createStore<StoreModel>({
  user: null,
  activeGame: null,
  activeGamePath: null,
  gameRoom: null,
  rivals: [],
  gameStats: {},
  socketConnected: false,

  setUser: action((state, payload) => {
    state.user = payload;
  }),

  setActiveGame: action((state, payload) => {
    state.activeGame = payload;
  }),

  setActiveGamePath: action((state, payload) => {
    state.activeGamePath = payload;
  }),

  setGameRoom: action((state, payload) => {
    state.gameRoom = payload;
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

  setSocketConnected: action((state, payload) => {
    state.socketConnected = payload;
  }),
});

export default store;
