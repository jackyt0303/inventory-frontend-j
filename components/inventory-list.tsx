"use client"

import { useEffect, useState } from "react"
import { Filter, Package, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock inventory data
const inventoryData = [
  {
    id: "INV001",
    name: "Wireless Headphones",
    category: "Electronics",
    supplierName: "TechGear Inc.",
    supplierId: "SUP001",
    cost: 89.99,
    price: 109.99,
    quantity: 24,
    lastUpdated: "2025-04-18 10:15:00",
    status: "In Stock",
  },
  {
    id: "INV002",
    name: "Office Chair",
    category: "Furniture",
    supplierName: "Comfort Furnishings",
    supplierId: "SUP002",
    cost: 149.99,
    price: 179.99,
    quantity: 3,
    lastUpdated: "2025-04-17 14:42:00",
    status: "In Stock",
  },
  {
    id: "INV003",
    name: "Smartphone",
    category: "Electronics",
    supplierName: "TechGear Inc.",
    supplierId: "SUP001",
    cost: 599.99,
    price: 719.99,
    quantity: 8,
    lastUpdated: "2025-04-16 09:30:00",
    status: "In Stock",
  },
  {
    id: "INV004",
    name: "Cotton T-Shirt",
    category: "Clothing",
    supplierName: "Fashion Forward",
    supplierId: "SUP003",
    cost: 19.99,
    price: 24.99,
    quantity: 45,
    lastUpdated: "2025-04-15 13:00:00",
    status: "In Stock",
  },
  {
    id: "INV005",
    name: "Desk Lamp",
    category: "Furniture",
    supplierName: "Comfort Furnishings",
    supplierId: "SUP002",
    cost: 34.99,
    price: 44.99,
    quantity: 18,
    lastUpdated: "2025-04-14 08:10:00",
    status: "In Stock",
  },
  {
    id: "INV006",
    name: "Bluetooth Speaker",
    category: "Electronics",
    supplierName: "SoundWave Audio",
    supplierId: "SUP004",
    cost: 79.99,
    price: 99.99,
    quantity: 0,
    lastUpdated: "2025-04-13 11:45:00",
    status: "Out of Stock",
  },
  {
    id: "INV007",
    name: "Denim Jeans",
    category: "Clothing",
    supplierName: "Fashion Forward",
    supplierId: "SUP003",
    cost: 49.99,
    price: 64.99,
    quantity: 32,
    lastUpdated: "2025-04-12 17:20:00",
    status: "In Stock",
  },
  {
    id: "INV008",
    name: "Coffee Maker",
    category: "Kitchen",
    supplierName: "HomeEssentials",
    supplierId: "SUP005",
    cost: 129.99,
    price: 159.99,
    quantity: 5,
    lastUpdated: "2025-04-11 10:00:00",
    status: "Low Stock",
  },
  {
    id: "INV009",
    name: "Bestselling Novel",
    category: "Books",
    supplierName: "ReadMore Publishing",
    supplierId: "SUP006",
    cost: 24.99,
    price: 29.99,
    quantity: 22,
    lastUpdated: "2025-04-10 15:55:00",
    status: "In Stock",
  },
  {
    id: "INV010",
    name: "Stainless Steel Cookware Set",
    category: "Kitchen",
    supplierName: "HomeEssentials",
    supplierId: "SUP005",
    cost: 199.99,
    price: 249.99,
    quantity: 3,
    lastUpdated: "2025-04-09 12:25:00",
    status: "Low Stock",
  },
];


export function InventoryList() {
  const [inventory, setInventory] = useState<typeof inventoryData>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Simulate API call to fetch inventory data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setInventory(inventoryData)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Filter inventory based on search term, categories, and status
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category)

    const matchesStatus = selectedStatus === "" || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = [...new Set(inventory.map((item) => item.category))]


  // Update active filters
  useEffect(() => {
    const filters: string[] = []

    if (searchTerm) {
      filters.push(`Search: ${searchTerm}`)
    }

    selectedCategories.forEach((category) => {
      filters.push(`Category: ${category}`)
    })

    if (selectedStatus) {
      filters.push(`Status: ${selectedStatus}`)
    }

    setActiveFilters(filters)
  }, [searchTerm, selectedCategories, selectedStatus])

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedStatus("")
  }

  // Remove specific filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Search:")) {
      setSearchTerm("")
    } else if (filter.startsWith("Category:")) {
      const category = filter.split(": ")[1]
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    } else if (filter.startsWith("Status:")) {
      setSelectedStatus("")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            type="search"
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Inventory</SheetTitle>
                <SheetDescription>Apply filters to narrow down your inventory items</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Categories</h4>
                  <div className="grid gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category])
                            } else {
                              setSelectedCategories(selectedCategories.filter((c) => c !== category))
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Low Stock">Low Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeFilter(filter)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove filter</span>
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
            Clear all
          </Button>
        </div>
      )}

      <Card>
        {loading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Supplier ID</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No inventory items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.supplierName}</TableCell>
                    <TableCell>{item.supplierId}</TableCell>
                    <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>
                      {/* <Badge
                        variant={
                          item.status === "In Stock"
                            ? "success"
                            : item.status === "Low Stock"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge> */}
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "default"
                            : item.status === "Low Stock"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
