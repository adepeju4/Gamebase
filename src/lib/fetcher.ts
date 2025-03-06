interface FetchOptions extends RequestInit {
  body?: any;
  skipAuth?: boolean;
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
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

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

    if (response.status === 401) {
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
