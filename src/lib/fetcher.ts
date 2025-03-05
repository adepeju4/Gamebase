interface FetchOptions extends RequestInit {
  body?: any;
}

interface FetcherResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

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
    const data = await response.json();
    
    return {
      status: response.status,
      data,
      error: !response.ok ? data.message || 'An error occurred' : undefined,
    };
  } catch (error) {
    return {
      status: 500,
      error: (error as Error).message || 'An error occurred',
    };
  }
};

export default fetcher; 