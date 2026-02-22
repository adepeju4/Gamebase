// User status enum — mirrors server/types/enums.ts
export enum UserStatus {
  Online = 'online',
  Offline = 'offline',
  Away = 'away',
}

// Define User type
export interface User {
  id: string;
  userName: string;
  email?: string;
  image?: string;
  status?: UserStatus;
  firstName: string;
  lastName: string;
  hashedPassword?: string;
}
