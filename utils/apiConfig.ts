// Configuration for API endpoints and environment settings
// This file makes it easy to switch between development and production modes

export const API_CONFIG = {
  // Set to true when you want to use actual backend API calls
  USE_BACKEND_API: false,
  
  // Your Express backend base URL
  BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333',
  
  // API endpoints
  ENDPOINTS: {
    DASHBOARD_STATS: '/api/dashboard/stats',
    DASHBOARD_CHARTS: '/api/dashboard/charts',
    SALES_DATA: '/api/sales',
    SALES_TOTAL: '/api/sales/total_sales',
    SALES_BY_BRANCH: '/api/sales/by-branch',
    SALES_BY_PRODUCT: '/api/sales/by-product',
    INVENTORY_DATA: '/api/inventory',
    INVENTORY_STATUS: '/api/inventory/status'
  }
}

// Helper function to build full API URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`
}

// Helper function for making API requests with error handling
export async function apiRequest<T>(endpoint: string): Promise<T> {
  const url = buildApiUrl(endpoint)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers here if needed
        // 'Authorization': `Bearer ${token}`
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}
