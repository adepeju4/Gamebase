interface FetchOptions extends RequestInit {
  body?: any;
}

interface FetcherResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  success: boolean;
}

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
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

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
    
   
    throw new Error(responseData.message || responseData.error || 'An error occurred');
  } catch (error) {
    return {
      status: 500,
      error: (error as Error).message || 'An error occurred',
      success: false,
    };
  }
};

export default fetcher; 