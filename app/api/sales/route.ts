import { NextResponse } from 'next/server';

// Mock sales data
const salesData = [
    { date: '2023-04-01', amount: 4200 },
    { date: '2023-04-02', amount: 3800 },
    { date: '2023-04-03', amount: 4100 },
    { date: '2023-04-04', amount: 3600 },
    { date: '2023-04-05', amount: 3900 },
    { date: '2023-04-06', amount: 4500 },
    { date: '2023-04-07', amount: 5200 },
    { date: '2023-04-08', amount: 4800 },
    { date: '2023-04-09', amount: 5100 },
    { date: '2023-04-10', amount: 4700 },
    { date: '2023-04-11', amount: 4300 },
    { date: '2023-04-12', amount: 4600 },
    { date: '2023-04-13', amount: 5000 },
    { date: '2023-04-14', amount: 5300 },
    { date: '2023-04-15', amount: 5500 },
];

export async function GET(request: Request) {
    // Simulate server delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const days = Number.parseInt(searchParams.get('days') || '7');

    // Get sales data for the specified number of days
    const recentSales = salesData.slice(-days);

    return NextResponse.json(recentSales);
}
