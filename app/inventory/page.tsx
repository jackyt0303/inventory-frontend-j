import type { Metadata } from "next"

import { InventoryList } from "@/components/inventory-list"

export const metadata: Metadata = {
  title: "Inventory - Inventory Management System",
  description: "Manage your inventory items",
}

export default async function InventoryPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">Manage and filter your inventory items</p>
        </div>
      </div>
      <div className="py-8">
        <InventoryList />
      </div>
    </div>
  )
}
