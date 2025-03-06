interface FetchOptions extends RequestInit {
  body?: any;
  skipAuth?: boolean; // Option to skip authentication for public routes
}

interface FetcherResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

import Cookies from 'universal-cookie';

const cookies = new Cookies();

/**
 * Generic fetch function that handles API requests
 * @param url - The URL to fetch from
 * @param options - Fetch options including body
 * @returns A typed response with data, error status, and success flag
 */
const fetcher = async <T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<FetcherResponse<T>> => {
  // Create a new headers object
  const headers = new Headers(options.headers);
  
  // Set content type if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Add authorization header with JWT token if available and not explicitly skipped
  if (!options.skipAuth) {
    const token = cookies.get('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.json();
    
    if (response.ok) {
      return {
        status: response.status,
        data: responseData as T,
        success: true,
      };
    }
    
    // Handle authentication errors
    if (response.status === 401) {
      // If token is expired or invalid, redirect to login
      if (url !== '/Api/Auth/login' && url !== '/Api/Auth/signup') {
        cookies.remove('token');
        window.location.href = '/login';
      }
    }
    
    return {
      status: response.status,
      error: responseData.message || 'An error occurred',
      success: false,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      status: 500,
      error: 'Network error. Please check your connection.',
      success: false,
    };
  }
};

export default fetcher; 