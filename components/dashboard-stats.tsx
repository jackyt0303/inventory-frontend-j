import { ArrowDownIcon, ArrowUpIcon, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +20.1% <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+2350</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +18.2% <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Inventory</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500 flex items-center">
              -4.5% <ArrowDownIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,429</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500 flex items-center">
              +10.1% <ArrowUpIcon className="h-3 w-3 ml-1" />
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
