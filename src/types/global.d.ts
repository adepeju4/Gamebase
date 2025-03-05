// Define global types used throughout the application

// Error object type used in server error handling
interface ErrorObject {
  log: string;
  status: number;
  message: { err: string } | Record<string, any>;
}

// User type
interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  // Add other user properties as needed
}

// Game statistics type
interface GameStats {
  wins: number;
  losses: number;
  draws: number;
}

// Store model for easy-peasy
interface StoreModel {
  user: User | null;
  activeGame: string;
  activeGamePath: string;
  channel: any; // Ideally this should be a more specific type
  rivals: any[]; // Ideally this should be a more specific type
  gameStats: Record<string, GameStats>;
  
  // Actions
  setUser: (user: User | null) => void;
  setActiveGame: (game: string) => void;
  setActiveGamePath: (path: string) => void;
  setChannel: (channel: any) => void;
  setRivals: (rivals: any[]) => void;
  setGameStat: (payload: { gameId: string, statType: string }) => void;
} 