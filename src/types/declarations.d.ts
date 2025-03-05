declare module 'easy-peasy' {
  export interface StoreActions<T = any> {
    setUser: (user: User | null) => void;
    setActiveGame: (game: string) => void;
    setActiveGamePath: (path: string) => void;
    setChannel: (channel: any) => void;
    setRivals: (rivals: any[]) => void;
    setGameStat: (stats: any) => void;
    [key: string]: any;
  }
  
  export function useStoreActions<T = any>(
    mapActions: (actions: StoreActions<T>) => any
  ): any;
  
  export function useStoreState<T = any>(
    mapState: (state: any) => any
  ): any;
  
  export interface StoreProviderProps {
    store: any;
    children: React.ReactNode;
  }
  
  export function StoreProvider(props: StoreProviderProps): JSX.Element;
  
  export function createStore<T = any>(model: T): any;
  
  export function action<S = any, P = any>(
    reducer: (state: S, payload: P) => void
  ): any;
}

declare module '*.js';
declare module 'uuid';
declare module 'stream-chat';

// Define User type
interface User {
  id: string;
  name: string;
  image?: string;
  online?: boolean;
  firstName?: string;
  lastName?: string;
  hashedPassword?: string;
}

// Define StreamChat type
interface StreamChat<T = any> {
  userID: string;
  connectUser: (user: User, token: string) => Promise<any>;
  disconnectUser: () => Promise<void>;
  [key: string]: any;
  
  static getInstance(apiKey: string): StreamChat;
}

// Define DefaultGenerics type
interface DefaultGenerics {
  [key: string]: any;
} 