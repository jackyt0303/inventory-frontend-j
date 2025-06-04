import type { Metadata } from "next"

import { DashboardCharts } from "@/components/dashboard-charts"
import { DashboardStats } from "@/components/dashboard-stats"

export const metadata: Metadata = {
  title: "Dashboard - Inventory Management System",
  description: "View sales and inventory analytics",
}

export default async function DashboardPage() {
  return (
    <div className="container space-y-8 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your inventory and sales performance</p>
        </div>
      </div>
      <DashboardStats />
      {/* <DashboardCharts /> */}
    </div>
  )
}
