import Cookies from 'universal-cookie';
import fetcher from './fetcher';
import { User } from '../types/declarations';

const cookies = new Cookies();

/**
 * Check if the user is authenticated
 * @returns boolean indicating if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = cookies.get('token');
  console.log("Checking authentication status, token exists:", !!token);
  return !!token;
};

/**
 * Get the current user's data from cookies
 * @returns User data object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) {
    return null;
  }

  return {
    id: cookies.get('userId'), // Map userId to id for User interface
    firstName: cookies.get('firstName'),
    lastName: cookies.get('lastName'),
    userName: cookies.get('userName'),
    email: cookies.get('email')
  };
};

/**
 * Get the authentication token
 * @returns JWT token or null if not authenticated
 */
export const getToken = (): string | null => {
  return cookies.get('token') || null;
};

/**
 * Log out the current user
 */
export const logout = () => {
  cookies.remove('firstName');
  cookies.remove('lastName');
  cookies.remove('userName');
  cookies.remove('userId');
  cookies.remove('email');
  cookies.remove('token');
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Refresh user profile data from the server
 * @returns Updated user data or null if failed
 */
export const refreshUserProfile = async (): Promise<User | null> => {
  try {
    const result = await fetcher('/Api/Auth/profile', {
      method: 'GET'
    });

    if (result.success && result.data) {
      // Map the response to match User interface
      const userData: User = {
        id: result.data.userId,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        userName: result.data.userName,
        email: result.data.email,
        online: result.data.status === 'online'
      };
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to refresh user profile:', error);
    return null;
  }
};

/**
 * Update the user's status
 * @param status New status ('online', 'offline', 'away')
 * @returns Success status
 */
export const updateUserStatus = async (status: 'online' | 'offline' | 'away') => {
  try {
    const result = await fetcher('/Api/Auth/status', {
      method: 'PUT',
      body: { status }
    });

    return result.success;
  } catch (error) {
    console.error('Failed to update user status:', error);
    return false;
  }
}; 