// Declaration file for module imports
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

// Extend ImportMeta interface to include env and hot properties
interface ImportMeta {
  env: {
    VITE_KEY: string;
    [key: string]: string;
  };
  hot?: {
    dispose: (callback: () => void) => void;
    accept: (callback: () => void) => void;
  };
}

// Extend Express Request and Response
declare namespace Express {
  interface Request {
    locals?: any;
  }
  
  interface Response {
    locals: any;
  }
}

// Extend easy-peasy store types
declare module 'easy-peasy' {
  interface StoreModel {
    activeGame: string;
    activeGamePath: string;
    channel: any;
    rivals: string[];
    gameStats: Record<string, { wins: number; losses: number; draws: number }>;
    user: any;
    setActiveGame: Action<StoreModel, string>;
    setActiveGamePath: Action<StoreModel, string>;
    setChannel: Action<StoreModel, any>;
    setRivals: Action<StoreModel, string[]>;
    setGameStat: Action<StoreModel, { gameId: string; outcome: string }>;
    setUser: Action<StoreModel, any>;
  }
} 