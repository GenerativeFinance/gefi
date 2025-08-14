/**
 * React Query Configuration
 * 
 * Centralized configuration for React Query with optimized defaults
 * for authentication, error handling, and caching strategies.
 * 
 * Features:
 * - Automatic credential inclusion for all requests
 * - Smart error handling with 401 detection
 * - Optimized caching and retry strategies
 * - Type-safe API request wrapper
 * - Comprehensive error reporting
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Configuration constants
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_RETRIES = 1;

/**
 * Throws an error if the response is not ok, with detailed error information
 * 
 * @param res - Fetch Response object
 */
async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    let errorMessage = res.statusText;
    
    try {
      // Try to get error details from response body
      const errorData = await res.text();
      if (errorData) {
        errorMessage = errorData;
      }
    } catch {
      // Fallback to status text if body parsing fails
    }
    
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

/**
 * Enhanced API request wrapper with authentication and error handling
 * 
 * @param method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param url - Request URL
 * @param data - Request body data (optional)
 * @param options - Additional fetch options (optional)
 * @returns Promise<Response>
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown,
  options: RequestInit = {}
): Promise<Response> {
  const requestOptions: RequestInit = {
    method,
    credentials: "include",
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  };

  try {
    const response = await fetch(url, requestOptions);
    await throwIfResNotOk(response);
    return response;
  } catch (error) {
    // Enhanced error logging for debugging
    console.error(`API Request failed: ${method} ${url}`, {
      error: error.message,
      data,
      status: error.message.split(':')[0],
    });
    throw error;
  }
}

/**
 * Behavior options for handling unauthorized responses
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Creates a query function with configurable 401 handling
 * 
 * @param options - Configuration options for unauthorized behavior
 * @returns QueryFunction for React Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = 
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    const url = queryKey[0] as string;
    
    try {
      const response = await fetch(url, {
        credentials: "include",
        signal, // Support for request cancellation
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      // Handle unauthorized responses based on configuration
      if (response.status === 401) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        throw new Error("401: Unauthorized");
      }

      await throwIfResNotOk(response);
      return await response.json();
    } catch (error) {
      // Don't log errors for aborted requests
      if (error.name !== 'AbortError') {
        console.warn(`Query failed for ${url}:`, error.message);
      }
      throw error;
    }
  };

/**
 * Determines if an error is due to unauthorized access
 * 
 * @param error - Error object to check
 * @returns boolean indicating if error is 401 Unauthorized
 */
export function isUnauthorizedError(error: Error): boolean {
  return /^401:/.test(error.message) || error.message.includes('Unauthorized');
}

/**
 * Determines if an error is a network-related error
 * 
 * @param error - Error object to check
 * @returns boolean indicating if error is network-related
 */
export function isNetworkError(error: Error): boolean {
  return error.message.includes('fetch') || 
         error.message.includes('network') ||
         error.message.includes('Failed to fetch');
}

/**
 * Global error handler for React Query
 * 
 * @param error - Error that occurred
 */
function handleGlobalError(error: Error) {
  // Only log non-401 errors to reduce noise
  if (!isUnauthorizedError(error)) {
    console.error('React Query Global Error:', error);
  }
  
  // Here you could add global error handling like:
  // - Showing toast notifications
  // - Sending error reports to monitoring service
  // - Triggering logout for certain error types
}

/**
 * Configured React Query client with optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Use smart 401 handling by default
      queryFn: getQueryFn({ on401: "returnNull" }),
      
      // Caching strategy
      staleTime: DEFAULT_STALE_TIME,
      gcTime: DEFAULT_CACHE_TIME, // Previously cacheTime
      
      // Retry strategy
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (isUnauthorizedError(error)) {
          return false;
        }
        
        // Retry network errors up to MAX_RETRIES
        return failureCount < MAX_RETRIES && isNetworkError(error);
      },
      
      // Refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Error handling
      onError: handleGlobalError,
    },
    mutations: {
      // Mutations should not retry automatically
      retry: false,
      
      // Error handling for mutations
      onError: handleGlobalError,
    },
  },
});

/**
 * Utility function to invalidate auth-related queries
 * Useful for triggering re-authentication checks after login/logout
 */
export function invalidateAuthQueries() {
  queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
  queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
}

/**
 * Utility function to clear all cached data
 * Useful for complete logout scenarios
 */
export function clearAllCache() {
  queryClient.clear();
}

// Export the configured client as default
export default queryClient;