// API functions for sales and dashboard data
import { API_CONFIG, apiRequest } from './apiConfig';

export interface DashboardStats {
    totalRevenue: {
        value: string;
        change: number;
        trend: 'up' | 'down';
    };
    totalSales: {
        value: string;
        change: number;
        trend: 'up' | 'down';
    };
    activeInventory: {
        value: string;
        change: number;
        trend: 'up' | 'down';
    };
    activeCustomers: {
        value: string;
        change: number;
        trend: 'up' | 'down';
    };
}

export interface SalesData {
    name: string;
    sales: number;
}

export interface ChartData {
    salesData: SalesData[];
}

export interface SalesTotalResponse {
    totalSales: number;
    totalRevenue: number;
    totalItemsSold: number;
    period: string;
}

export interface SalesByBranchResponse {
    branchId: string;
    branchName: string;
    totalSales: number;
    totalRevenue: number;
    itemsSold: number;
}

export interface SalesByProductResponse {
    productId: string;
    productName: string;
    totalSales: number;
    totalRevenue: number;
    unitsSold: number;
}

// Fetch dashboard stats
export async function fetchDashboardStats(): Promise<DashboardStats> {
    try {
        if (API_CONFIG.USE_BACKEND_API) {
            // Use actual backend API
            return await apiRequest<DashboardStats>(
                API_CONFIG.ENDPOINTS.DASHBOARD_STATS
            );
        }

        // Development mode: return hardcoded data
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        return {
            totalRevenue: {
                value: '$45,231.89',
                change: 20.1,
                trend: 'up',
            },
            totalSales: {
                value: '+2350',
                change: 18.2,
                trend: 'up',
            },
            activeInventory: {
                value: '573',
                change: -4.5,
                trend: 'down',
            },
            activeCustomers: {
                value: '1,429',
                change: 10.1,
                trend: 'up',
            },
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw new Error('Failed to fetch dashboard stats');
    }
}

// Fetch total sales data
export async function fetchSalesTotal(
    period?: string
): Promise<SalesTotalResponse | undefined> {
    try {
        // working now
        if (API_CONFIG.USE_BACKEND_API) {
            const endpoint = period
                ? `${API_CONFIG.ENDPOINTS.SALES_TOTAL}?period=${period}`
                : API_CONFIG.ENDPOINTS.SALES_TOTAL;
            return await apiRequest<SalesTotalResponse>(endpoint);
        }

        // // Development mode: return mock data
        // await new Promise(resolve => setTimeout(resolve, 300))
        // return {
        //   totalSales: 156,
        //   totalRevenue: 45231.89,
        //   totalItemsSold: 2350,
        //   period: period || 'all-time'
        // }
        return undefined; // Add explicit return for development mode
    } catch (error) {
        console.error('Error fetching sales total:', error);
        throw new Error('Failed to fetch sales total');
    }
}

// // Fetch sales by branch
// export async function fetchSalesByBranch(): Promise<SalesByBranchResponse[]> {
//   try {
//     if (API_CONFIG.USE_BACKEND_API) {
//       return await apiRequest<SalesByBranchResponse[]>(API_CONFIG.ENDPOINTS.SALES_BY_BRANCH)
//     }

//     // Development mode: return mock data
//     await new Promise(resolve => setTimeout(resolve, 300))
//     return [
//       {
//         branchId: "550e8400-e29b-41d4-a716-446655440001",
//         branchName: "Bangi Branch",
//         totalSales: 85,
//         totalRevenue: 28500.50,
//         itemsSold: 1200
//       },
//       {
//         branchId: "550e8400-e29b-41d4-a716-446655440002",
//         branchName: "KL Branch",
//         totalSales: 71,
//         totalRevenue: 16731.39,
//         itemsSold: 1150
//       }
//     ]
//   } catch (error) {
//     console.error('Error fetching sales by branch:', error)
//     throw new Error('Failed to fetch sales by branch')
//   }
// }

// // Fetch sales by product
// export async function fetchSalesByProduct(): Promise<SalesByProductResponse[]> {
//   try {
//     if (API_CONFIG.USE_BACKEND_API) {
//       return await apiRequest<SalesByProductResponse[]>(API_CONFIG.ENDPOINTS.SALES_BY_PRODUCT)
//     }

//     // Development mode: return mock data
//     await new Promise(resolve => setTimeout(resolve, 300))
//     return [
//       {
//         productId: "PROD001",
//         productName: "Laptop Pro",
//         totalSales: 25,
//         totalRevenue: 24999.75,
//         unitsSold: 25
//       },
//       {
//         productId: "PROD002",
//         productName: "Wireless Mouse",
//         totalSales: 150,
//         totalRevenue: 4499.50,
//         unitsSold: 150
//       }
//     ]
//   } catch (error) {
//     console.error('Error fetching sales by product:', error)
//     throw new Error('Failed to fetch sales by product')
//   }
// }

// Fetch chart data
export async function fetchChartData(): Promise<ChartData> {
    try {
        if (API_CONFIG.USE_BACKEND_API) {
            // Use actual backend API
            return await apiRequest<ChartData>(
                API_CONFIG.ENDPOINTS.DASHBOARD_CHARTS
            );
        }

        // Development mode: return hardcoded data
        await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay

        return {
            salesData: [
                { name: 'Mon', sales: 4000 },
                { name: 'Tue', sales: 3000 },
                { name: 'Wed', sales: 2000 },
                { name: 'Thu', sales: 2780 },
                { name: 'Fri', sales: 1890 },
                { name: 'Sat', sales: 2390 },
                { name: 'Sun', sales: 3490 },
            ],
        };
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw new Error('Failed to fetch chart data');
    }
}

// Additional utility functions for specific data types
export async function fetchSalesData(): Promise<SalesData[]> {
    if (API_CONFIG.USE_BACKEND_API) {
        return await apiRequest<SalesData[]>(API_CONFIG.ENDPOINTS.SALES_DATA);
    }

    const chartData = await fetchChartData();
    return chartData.salesData;
}
