'use client';

import { useEffect, useState } from 'react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    DollarSign,
    Package,
    ShoppingCart,
    Users,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchDashboardStats, type DashboardStats } from '@/utils/salesApi';

export function DashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setLoading(true);
                const data = await fetchDashboardStats();
                setStats(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load stats'
                );
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
                            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="md:col-span-2 lg:col-span-4">
                    <CardContent className="pt-6">
                        <p className="text-red-500">Error: {error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    const StatCard = ({
        title,
        value,
        change,
        trend,
        icon: Icon,
    }: {
        title: string;
        value: string;
        change: number;
        trend: 'up' | 'down';
        icon: React.ElementType;
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    <span
                        className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                    >
                        {trend === 'up' ? '+' : ''}
                        {change}%{' '}
                        {trend === 'up' ? (
                            <ArrowUpIcon className="h-3 w-3 ml-1" />
                        ) : (
                            <ArrowDownIcon className="h-3 w-3 ml-1" />
                        )}
                    </span>{' '}
                    from last month
                </p>
            </CardContent>
        </Card>
    );

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Revenue"
                value={stats.totalRevenue.value}
                change={stats.totalRevenue.change}
                trend={stats.totalRevenue.trend}
                icon={DollarSign}
            />
            <StatCard
                title="Total Sales"
                value={stats.totalSales.value}
                change={stats.totalSales.change}
                trend={stats.totalSales.trend}
                icon={ShoppingCart}
            />
            <StatCard
                title="Active Inventory"
                value={stats.activeInventory.value}
                change={stats.activeInventory.change}
                trend={stats.activeInventory.trend}
                icon={Package}
            />
            <StatCard
                title="Active Customers"
                value={stats.activeCustomers.value}
                change={stats.activeCustomers.change}
                trend={stats.activeCustomers.trend}
                icon={Users}
            />
        </div>
    );
}
